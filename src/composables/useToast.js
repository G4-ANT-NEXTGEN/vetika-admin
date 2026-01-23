import { reactive } from 'vue'

// Toast store - manages all toast notifications
const toasts = reactive([])
let toastId = 0

export function useToast() {
    /**
     * Add a new toast notification
     * @param {Object} options - Toast configuration
     * @param {string} options.message - Toast message content
     * @param {string} options.type - Toast type: 'success', 'error', 'warning', 'info'
     * @param {number} options.duration - Auto-close duration in ms (0 = no auto-close)
     * @returns {number} Toast ID for manual removal
     */
    const add = (options) => {
        const { message = '', type = 'info', duration = 3000 } = options

        const id = toastId++
        const toast = {
            id,
            message,
            type,
            duration,
        }

        toasts.push(toast)

        // Auto-remove if duration is set
        if (duration > 0) {
            setTimeout(() => {
                remove(id)
            }, duration)
        }

        return id
    }

    /**
     * Remove a toast by ID
     * @param {number} id - Toast ID
     */
    const remove = (id) => {
        const index = toasts.findIndex((t) => t.id === id)
        if (index > -1) {
            toasts.splice(index, 1)
        }
    }

    /**
     * Clear all toasts
     */
    const clear = () => {
        toasts.length = 0
    }

    /**
     * Show success toast
     * @param {string} message - Success message
     * @param {number} duration - Auto-close duration
     */
    const success = (message, duration = 3000) => {
        return add({ message, type: 'success', duration })
    }

    /**
     * Show error toast
     * @param {string} message - Error message
     * @param {number} duration - Auto-close duration (default: 5s for errors)
     */
    const error = (message, duration = 5000) => {
        return add({ message, type: 'error', duration })
    }

    /**
     * Show warning toast
     * @param {string} message - Warning message
     * @param {number} duration - Auto-close duration
     */
    const warning = (message, duration = 4000) => {
        return add({ message, type: 'warning', duration })
    }

    /**
     * Show info toast
     * @param {string} message - Info message
     * @param {number} duration - Auto-close duration
     */
    const info = (message, duration = 3000) => {
        return add({ message, type: 'info', duration })
    }

    return {
        toasts,
        add,
        remove,
        clear,
        success,
        error,
        warning,
        info,
  };
}
