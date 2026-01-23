# Phase 2: Form Enhancement Guide

Complete implementation of **BaseSelect**, **BaseTextarea**, **BaseCheckbox**, **FormGroup**, and **useFormValidation** composable.

---

## 📋 What Was Created

### Components

- ✅ `src/components/ui/base/BaseSelect.vue` - Dropdown select
- ✅ `src/components/ui/base/BaseTextarea.vue` - Multi-line text input
- ✅ `src/components/ui/base/BaseCheckbox.vue` - Checkbox input
- ✅ `src/components/form/FormGroup.vue` - Label + error wrapper

### Composables

- ✅ `src/composables/useFormValidation.js` - Complete validation system

---

## 🎯 Component Usage

### 1. BaseSelect - Dropdown Select

#### Basic Usage

```vue
<template>
  <BaseSelect
    v-model="form.status"
    label="Status"
    placeholder="Select status..."
    :options="statusOptions"
  />
</template>

<script setup>
import { ref } from 'vue'
import BaseSelect from '@/components/ui/base/BaseSelect.vue'

const form = ref({ status: '' })

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
]
</script>
```

#### With Validation

```vue
<template>
  <BaseSelect
    v-model="form.category"
    label="Category"
    placeholder="Choose category..."
    :options="categories"
    :error="errors.category"
    :is-valid="!errors.category && isDirty.category"
    required
    @blur="validateField('category')"
  />
</template>

<script setup>
import { useFormValidation, ValidationRules } from '@/composables/useFormValidation'

const {
  formData: form,
  errors,
  isDirty,
  validateField,
} = useFormValidation({ category: '' }, { category: ValidationRules.required })

const categories = ['Mathematics', 'Science', 'English', 'History']
</script>
```

#### Props

| Prop          | Type           | Default | Description                                             |
| ------------- | -------------- | ------- | ------------------------------------------------------- |
| `modelValue`  | String, Number | -       | Selected value                                          |
| `label`       | String         | -       | Field label                                             |
| `placeholder` | String         | -       | Placeholder text                                        |
| `options`     | Array          | []      | Options array (objects with `value`/`label` or strings) |
| `error`       | String         | -       | Error message                                           |
| `disabled`    | Boolean        | false   | Disable select                                          |
| `required`    | Boolean        | false   | Required field indicator                                |
| `isValid`     | Boolean        | false   | Show valid state                                        |

---

### 2. BaseTextarea - Multi-line Text

#### Basic Usage

```vue
<template>
  <BaseTextarea
    v-model="form.description"
    label="Description"
    placeholder="Enter description..."
    rows="5"
    :maxlength="500"
    :show-char-count="true"
  />
</template>

<script setup>
import { ref } from 'vue'
import BaseTextarea from '@/components/ui/base/BaseTextarea.vue'

const form = ref({ description: '' })
</script>
```

#### With Validation

```vue
<template>
  <BaseTextarea
    v-model="form.notes"
    label="Notes"
    placeholder="Add notes..."
    rows="4"
    :maxlength="1000"
    :show-char-count="true"
    :error="errors.notes"
    :is-valid="!errors.notes && isDirty.notes"
    required
    @blur="validateField('notes')"
  />
</template>

<script setup>
import { useFormValidation, ValidationRules } from '@/composables/useFormValidation'

const {
  formData: form,
  errors,
  isDirty,
  validateField,
} = useFormValidation(
  { notes: '' },
  { notes: [ValidationRules.required, ValidationRules.minLength(10)] },
)
</script>
```

#### Props

| Prop            | Type           | Default | Description            |
| --------------- | -------------- | ------- | ---------------------- |
| `modelValue`    | String, Number | -       | Textarea value         |
| `label`         | String         | -       | Field label            |
| `placeholder`   | String         | -       | Placeholder text       |
| `rows`          | Number         | 4       | Number of visible rows |
| `maxlength`     | Number         | 500     | Maximum characters     |
| `showCharCount` | Boolean        | false   | Show character counter |
| `error`         | String         | -       | Error message          |
| `disabled`      | Boolean        | false   | Disable textarea       |
| `required`      | Boolean        | false   | Required indicator     |
| `isValid`       | Boolean        | false   | Show valid state       |

---

### 3. BaseCheckbox - Checkbox Input

#### Basic Usage

```vue
<template>
  <BaseCheckbox v-model="form.agreeTerms" label="I agree to the terms and conditions" />
</template>

<script setup>
import { ref } from 'vue'
import BaseCheckbox from '@/components/ui/base/BaseCheckbox.vue'

const form = ref({ agreeTerms: false })
</script>
```

#### Multiple Checkboxes

```vue
<template>
  <div>
    <p class="mb-3">Select skills:</p>
    <BaseCheckbox
      v-for="skill in skills"
      :key="skill.id"
      :id="`skill-${skill.id}`"
      v-model="form.selectedSkills[skill.id]"
      :label="skill.name"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseCheckbox from '@/components/ui/base/BaseCheckbox.vue'

const form = reactive({
  selectedSkills: {
    1: false,
    2: false,
    3: false,
  },
})

const skills = [
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'Vue.js' },
  { id: 3, name: 'TypeScript' },
]
</script>
```

#### Props

| Prop         | Type    | Default | Description            |
| ------------ | ------- | ------- | ---------------------- |
| `modelValue` | Boolean | false   | Checkbox checked state |
| `label`      | String  | -       | Label text             |
| `id`         | String  | -       | Input ID               |
| `disabled`   | Boolean | false   | Disable checkbox       |
| `required`   | Boolean | false   | Required indicator     |

---

### 4. FormGroup - Label + Error Wrapper

#### Basic Usage

```vue
<template>
  <FormGroup
    label="Email"
    id="email"
    :error="errors.email"
    hint="We'll never share your email"
    required
  >
    <BaseInput v-model="form.email" id="email" placeholder="you@example.com" />
  </FormGroup>
</template>

<script setup>
import FormGroup from '@/components/form/FormGroup.vue'
import BaseInput from '@/components/ui/base/BaseInput.vue'
import { useFormValidation, ValidationRules } from '@/composables/useFormValidation'

const { formData: form, errors } = useFormValidation(
  { email: '' },
  { email: [ValidationRules.required, ValidationRules.email] },
)
</script>
```

#### Props

| Prop       | Type    | Default | Description             |
| ---------- | ------- | ------- | ----------------------- |
| `label`    | String  | -       | Field label             |
| `id`       | String  | -       | Associated input ID     |
| `error`    | String  | -       | Error message           |
| `hint`     | String  | -       | Helper text below field |
| `required` | Boolean | false   | Required indicator      |

---

## 🔧 Form Validation with useFormValidation

### Basic Setup

```javascript
import { useFormValidation, ValidationRules } from '@/composables/useFormValidation'

const {
  formData, // Reactive form object
  errors, // Reactive errors object
  touched, // Fields user has interacted with
  isDirty, // Fields user has modified
  validate, // Validate all fields
  validateField, // Validate single field
  reset, // Reset form to initial state
  hasErrors, // Computed: true if any errors
  isFormDirty, // Computed: true if any changes
  isFormValid, // Computed: true if all valid
} = useFormValidation(initialValues, rules)
```

### Validation Rules

#### Built-in Rules

```javascript
import { useFormValidation, ValidationRules } from '@/composables/useFormValidation'

const { formData, errors, validateField } = useFormValidation(
  {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    website: '',
    bio: '',
  },
  {
    username: [
      ValidationRules.required,
      ValidationRules.minLength(3),
      ValidationRules.maxLength(20),
    ],
    email: [ValidationRules.required, ValidationRules.email],
    password: [ValidationRules.required, ValidationRules.minLength(8)],
    confirmPassword: [
      ValidationRules.required,
      ValidationRules.matches('password'), // Must match another field
    ],
    age: [ValidationRules.required, ValidationRules.min(18), ValidationRules.max(100)],
    website: [ValidationRules.pattern('^(https?://)?.+\\.', 'Please enter a valid URL')],
    bio: [ValidationRules.maxLength(500)],
  },
)
```

#### Custom Validation Rules

```javascript
const { formData, errors, validateField } = useFormValidation(
  { password: '', confirmPassword: '' },
  {
    password: [
      'required',
      (value) => {
        // Custom rule: Must contain uppercase, lowercase, and number
        if (!value) return true
        const hasUpper = /[A-Z]/.test(value)
        const hasLower = /[a-z]/.test(value)
        const hasNumber = /[0-9]/.test(value)
        return (
          (hasUpper && hasLower && hasNumber) ||
          'Password must contain uppercase, lowercase, and numbers'
        )
      },
    ],
    confirmPassword: [
      'required',
      (value, allValues) => {
        return value === allValues.password || 'Passwords do not match'
      },
    ],
  },
)
```

---

## 📝 Complete Form Example

### Skill Creation Form

```vue
<template>
  <div class="skill-form">
    <h3>Create New Skill</h3>

    <!-- Loading state -->
    <LoadingSpinner v-if="isSubmitting" label="Creating skill..." />

    <BaseForm v-else @submit="handleSubmit">
      <!-- Skill Name -->
      <FormGroup
        label="Skill Name"
        id="name"
        :error="errors.name"
        hint="Enter the skill name (e.g., JavaScript, Communication)"
        required
      >
        <BaseInput
          v-model="formData.name"
          id="name"
          placeholder="e.g., JavaScript"
          type="text"
          @blur="touch('name')"
        />
      </FormGroup>

      <!-- Description -->
      <FormGroup
        label="Description"
        id="description"
        :error="errors.description"
        hint="Provide a brief description of the skill"
      >
        <BaseTextarea
          v-model="formData.description"
          id="description"
          placeholder="What is this skill about?"
          rows="4"
          :maxlength="500"
          :show-char-count="true"
          @blur="touch('description')"
        />
      </FormGroup>

      <!-- Category -->
      <FormGroup label="Category" id="category" :error="errors.category" required>
        <BaseSelect
          v-model="formData.category"
          id="category"
          placeholder="Select a category"
          :options="categoryOptions"
          @blur="validateField('category')"
        />
      </FormGroup>

      <!-- Difficulty Level -->
      <FormGroup label="Difficulty Level" id="difficulty" :error="errors.difficulty">
        <BaseSelect
          v-model="formData.difficulty"
          id="difficulty"
          placeholder="Select difficulty"
          :options="['Beginner', 'Intermediate', 'Advanced']"
        />
      </FormGroup>

      <!-- Status -->
      <FormGroup label="Status" id="status" :error="errors.status" required>
        <BaseSelect
          v-model="formData.status"
          id="status"
          placeholder="Select status"
          :options="['Active', 'Inactive', 'Pending']"
        />
      </FormGroup>

      <!-- Is Featured -->
      <FormGroup label="Options" id="featured">
        <BaseCheckbox v-model="formData.isFeatured" label="Mark as featured skill" />
      </FormGroup>

      <!-- Required Approval -->
      <FormGroup label="">
        <BaseCheckbox
          v-model="formData.requiresApproval"
          label="This skill requires admin approval"
        />
      </FormGroup>

      <!-- Buttons -->
      <div class="form-actions">
        <BaseButton variant="secondary" type="button" @click="handleReset"> Reset </BaseButton>
        <BaseButton :disabled="hasErrors || isSubmitting" :is-loading="isSubmitting" type="submit">
          Create Skill
        </BaseButton>
      </div>
    </BaseForm>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFormValidation, ValidationRules } from '@/composables/useFormValidation'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import { createSkill } from '@/api/api'

import BaseForm from '@/components/form/BaseForm.vue'
import BaseInput from '@/components/ui/base/BaseInput.vue'
import BaseSelect from '@/components/ui/base/BaseSelect.vue'
import BaseTextarea from '@/components/ui/base/BaseTextarea.vue'
import BaseCheckbox from '@/components/ui/base/BaseCheckbox.vue'
import BaseButton from '@/components/ui/base/BaseButton.vue'
import FormGroup from '@/components/form/FormGroup.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const { success, error } = useToast()
const { show: showConfirm } = useConfirm()

const isSubmitting = ref(false)

const categoryOptions = [
  { label: 'Technical', value: 'technical' },
  { label: 'Soft Skills', value: 'soft' },
  { label: 'Leadership', value: 'leadership' },
]

const { formData, errors, hasErrors, validate, validateField, touch, reset, isFormValid } =
  useFormValidation(
    {
      name: '',
      description: '',
      category: '',
      difficulty: 'Beginner',
      status: 'Pending',
      isFeatured: false,
      requiresApproval: false,
    },
    {
      name: [ValidationRules.required, ValidationRules.minLength(2)],
      category: ValidationRules.required,
      status: ValidationRules.required,
    },
  )

const handleSubmit = async () => {
  // Validate before submit
  if (!validate()) {
    error('Please fix the errors before submitting')
    return
  }

  isSubmitting.value = true
  try {
    await createSkill(formData)
    success('Skill created successfully!')
    reset()
  } catch (err) {
    error('Failed to create skill: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

const handleReset = () => {
  showConfirm({
    title: 'Reset Form?',
    message: 'Are you sure you want to reset all fields?',
    confirmText: 'Reset',
    type: 'warning',
    onConfirm: () => {
      reset()
      success('Form reset!')
    },
  })
}
</script>

<style scoped>
.skill-form {
  max-width: 600px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }
}
</style>
```

---

## 🎯 Validation Rules Reference

### Required

```javascript
{
  fieldName: ValidationRules.required
}
// Error: "This field is required"
```

### Email

```javascript
{
  email: ValidationRules.email
}
// Error: "Please enter a valid email address"
```

### Min/Max Length

```javascript
{
  username: [ValidationRules.minLength(3), ValidationRules.maxLength(20)]
}
// Error: "Minimum length is 3 characters"
// Error: "Maximum length is 20 characters"
```

### Min/Max Value

```javascript
{
  age: [ValidationRules.min(18), ValidationRules.max(100)]
}
// Error: "Value must be at least 18"
// Error: "Value must be at most 100"
```

### Pattern (Regex)

```javascript
{
  phone: ValidationRules.pattern('^\\d{10}$', 'Phone must be 10 digits')
}
```

### Field Matching

```javascript
{
  password: ValidationRules.required,
  confirmPassword: ValidationRules.matches('password')
}
// Error: "Fields do not match"
```

### Multiple Rules

```javascript
{
  password: [
    ValidationRules.required,
    ValidationRules.minLength(8),
    (value) => {
      // Custom validation
      if (!/[A-Z]/.test(value)) return 'Must contain uppercase'
      return true
    },
  ]
}
```

---

## 💡 Best Practices

### 1. Always Show Validation on Blur

```vue
<BaseInput v-model="formData.email" @blur="validateField('email')" />
```

### 2. Use FormGroup for Consistency

```vue
<FormGroup
  label="Email"
  id="email"
  :error="errors.email"
  hint="We'll send confirmation here"
  required
>
  <BaseInput v-model="formData.email" id="email" />
</FormGroup>
```

### 3. Show Spinner During Submit

```javascript
const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (!validate()) return
  isSubmitting.value = true
  try {
    await submitForm()
    success('Submitted!')
  } finally {
    isSubmitting.value = false
  }
}
```

### 4. Combine with Toast for Feedback

```javascript
const { success, error } = useToast()

if (!validate()) {
  error('Please fix validation errors')
  return
}

await submitForm()
success('Form submitted successfully!')
```

### 5. Use Computed for Disabled States

```vue
<BaseButton :disabled="!isFormValid || isSubmitting" :is-loading="isSubmitting" type="submit">
  Submit
</BaseButton>
```

---

## 🔗 Integration with Phase 1

### Toast + Validation

```javascript
const { error } = useToast()
const { validate, errors } = useFormValidation(...)

if (!validate()) {
  error('Fix validation errors before submitting')
  return
}
```

### Confirm + Reset

```javascript
const { show } = useConfirm()
const { reset } = useFormValidation(...)

const handleReset = () => {
  show({
    title: 'Reset Form?',
    onConfirm: reset
  })
}
```

---

## 📖 Next Steps

Phase 3 will include:

- **CrudPageTemplate** - Reusable CRUD template (biggest time saver!)
- **BaseBadge** - Status indicators
- **BaseSearch** - Search component
- **PageHeader** - Page titles
- **ActionButtons** - Table action buttons

These components will dramatically reduce code duplication across Skills, Schools, Degrees, Subjects, and Categories pages!
