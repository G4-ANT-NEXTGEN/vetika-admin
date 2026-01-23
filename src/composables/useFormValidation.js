import { reactive, computed } from 'vue'

/**
 * Form validation composable
 * Manages form state, validation rules, and error messages
 */
export function useFormValidation(initialValues = {}, rules = {}) {
    const formData = reactive({ ...initialValues })
    const errors = reactive({})
    const touched = reactive({})
    const isDirty = reactive({})

    /**
     * Validation rules registry
     */
    const validationRules = {
        required: (value) => {
            if (Array.isArray(value)) {
                return value.length > 0 || 'This field is required'
            }
            return (value && value.toString().trim() !== '') || 'This field is required'
        },

        email: (value) => {
            if (!value) return true
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return emailRegex.test(value) || 'Please enter a valid email address'
        },

        minLength: (min) => (value) => {
            return (value && value.length >= min) || `Minimum length is ${min} characters`
        },

        maxLength: (max) => (value) => {
            return (value && value.length <= max) || `Maximum length is ${max} characters`
        },

        min: (min) => (value) => {
            return value >= min || `Value must be at least ${min}`
        },

        max: (max) => (value) => {
            return value <= max || `Value must be at most ${max}`
        },

        pattern: (pattern, message) => (value) => {
            const regex = new RegExp(pattern)
            return regex.test(value) || !value || message || 'Invalid format'
        },

        matches: (fieldName) => (value, allValues) => {
            return value === allValues[fieldName] | `Fields do not match`
        },

        custom: (validatorFn) => validatorFn,
    }

    /**
     * Validate a single field
     */
    const validateField = (fieldName, value = formData[fieldName]) => {
        const fieldRules = rules[fieldName]
        if (!fieldRules) return true

        const ruleArray = Array.isArray(fieldRules) ? fieldRules : [fieldRules]

        for (const rule of ruleArray) {
            let validator

            if (typeof rule === 'function') {
                validator = rule
            } else if (typeof rule === 'string') {
                validator = validationRules[rule]
            } else if (typeof rule === 'object') {
                const [ruleName, ...args] = Object.entries(rule)[0]
                const ruleFunc = validationRules[ruleName]
                if (typeof ruleFunc === 'function' && args[0]) {
                    validator = ruleFunc(...args)
                } else {
                    validator = ruleFunc
                }
            }

            if (validator) {
                const result = validator(value, formData)
                if (result !== true) {
                    errors[fieldName] = result
                    return false
                }
            }
        }

        errors[fieldName] = ''
        return true
    }

    /**
     * Validate all fields
     */
    const validate = () => {
        let isValid = true
        Object.keys(rules).forEach((fieldName) => {
            if (!validateField(fieldName)) {
                isValid = false
            }
        })
        return isValid
    }

    /**
     * Mark field as touched
     */
    const touch = (fieldName) => {
        touched[fieldName] = true
    }

    /**
     * Mark field as dirty (modified)
     */
    const markDirty = (fieldName) => {
        isDirty[fieldName] = true
    }

    /**
     * Reset form to initial state
     */
    const reset = () => {
        Object.keys(formData).forEach((key) => {
            formData[key] = initialValues[key]
        })
        Object.keys(errors).forEach((key) => {
            errors[key] = ''
        })
        Object.keys(touched).forEach((key) => {
            touched[key] = false
        })
        Object.keys(isDirty).forEach((key) => {
            isDirty[key] = false
        })
    }

    /**
     * Set field value
     */
    const setFieldValue = (fieldName, value) => {
        formData[fieldName] = value
        markDirty(fieldName)
    }

    /**
     * Set field error
     */
    const setFieldError = (fieldName, error) => {
        errors[fieldName] = error
    }

    /**
     * Get field state
     */
    const getFieldState = (fieldName) => {
        return {
            value: formData[fieldName],
            error: errors[fieldName],
            touched: touched[fieldName],
            isDirty: isDirty[fieldName],
            isValid: !errors[fieldName],
        }
    }

    /**
     * Computed: Check if form has errors
     */
    const hasErrors = computed(() => Object.values(errors).some((error) => error !== ''))

    /**
     * Computed: Check if form is dirty
     */
    const isFormDirty = computed(() => Object.values(isDirty).some((dirty) => dirty))

    /**
     * Computed: Check if form is valid
     */
    const isFormValid = computed(() => !hasErrors.value)

    return {
        formData,
        errors,
        touched,
        isDirty,
        hasErrors,
        isFormDirty,
        isFormValid,
        validate,
        validateField,
        touch,
        markDirty,
        reset,
        setFieldValue,
        setFieldError,
        getFieldState,
        validationRules,
    }
}

/**
 * Quick validation rules preset
 */
export const ValidationRules = {
    required: 'required',
    email: 'email',
    minLength: (min) => ({ minLength: min }),
    maxLength: (max) => ({ maxLength: max }),
    min: (min) => ({ min: min }),
    max: (max) => ({ max: max }),
    pattern: (pattern, message) => ({ pattern: [pattern, message] }),
    matches: (fieldName) => ({ matches: fieldName }),
}
