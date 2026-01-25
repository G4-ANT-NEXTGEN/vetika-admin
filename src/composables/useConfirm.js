import { reactive } from 'vue'

// Confirm dialog store
const confirmState = reactive({
    isVisible: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning', // warning, danger, info
    onConfirm: null,
    onCancel: null,
})

export function useConfirm() {
    /**
     * Show confirmation dialog
     * @param {Object} options - Dialog configuration
     * @param {string} options.title - Dialog title
     * @param {string} options.message - Dialog message
     * @param {string} options.confirmText - Confirm button text
     * @param {string} options.cancelText - Cancel button text
     * @param {string} options.type - Dialog type: 'warning', 'danger', 'info'
     * @param {Function} options.onConfirm - Callback when confirmed
     * @param {Function} options.onCancel - Callback when cancelled
     */
    const show = (options) => {
        const {
            title = 'Confirm',
            message = 'Are you sure?',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            type = 'warning',
            onConfirm = null,
            onCancel = null,
        } = options

        Object.assign(confirmState, {
            isVisible: true,
            title,
            message,
            confirmText,
            cancelText,
            type,
            onConfirm,
            onCancel,
        })
    }

    /**
     * Confirm action
     */
    const confirm = async () => {
        if (confirmState.onConfirm) {
            try {
                await confirmState.onConfirm()
            } catch (error) {
                console.error('Confirm action failed:', error)
            }
        }
        close()
    }

    /**
     * Cancel action
     */
    const cancel = () => {
        if (confirmState.onCancel) {
            confirmState.onCancel()
        }
        close()
    }

    /**
     * Close dialog
     */
    const close = () => {
        confirmState.isVisible = false
        confirmState.onConfirm = null
        confirmState.onCancel = null
    }

    /**
     * Show confirmation dialog and return Promise
     * @param {Object} options - Dialog configuration
     * @returns {Promise<boolean>} - True if confirmed, false if cancelled
     */
    const require = (options) => {
        return new Promise((resolve) => {
            show({
                ...options,
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false),
            })
        })
    }

    return {
        confirmState,
        show,
        confirm,
        cancel,
        close,
        require,
    }
}
