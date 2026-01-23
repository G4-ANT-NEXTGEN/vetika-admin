<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-left">
        <div class="login-left-content">
          <div class="login-logo">
            <i class="bi bi-grid-3x3-gap"></i>
            <span>NextGen</span>
          </div>

          <div class="login-hero">
            <h1 class="login-title">Connect.Innovate.<br>Grow Together.</h1>
            <p class="login-subtitle">A vibrant community for students, freelancers, entrepreneurs, and
              investors to connect, innovate, and grow together.</p>
          </div>

          <a href="#" class="back-to-website">
            <i class="bi bi-arrow-left"></i>
            Back to Website
          </a>
        </div>
      </div>

      <div class="login-right">
        <div class="login-form-container">
          <div class="login-header">
            <h2>Welcome Back!</h2>
            <p>Log in to connect with your community and start building together.</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form" novalidate>
            <div class="form-group">
              <label for="email">Email</label>
              <div class="input-wrapper">
                <i class="bi bi-envelope"></i>
                <input type="email" id="email" v-model="email" placeholder="Input your email"
                  :class="{ 'is-invalid': errors.email }" @blur="validateEmail" @input="errors.email = ''"
                  autocomplete="email">
              </div>
              <span class="validation-error" v-if="errors.email">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <i class="bi bi-lock"></i>
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                  placeholder="Input your password" :class="{ 'is-invalid': errors.password }" @blur="validatePassword"
                  @input="errors.password = ''" autocomplete="current-password">
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
              <span class="validation-error" v-if="errors.password">{{ errors.password }}</span>
            </div>

            <button type="submit" class="login-btn" :class="{ 'is-loading': loading }" :disabled="loading">
              <span v-if="loading" class="btn-spinner">
                <span class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
              </span>
              <span>{{ loading ? 'Logging in...' : 'Login' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const authStore = useAuthStore();
const { add: addToast } = useToast();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errors = ref({
  email: '',
  password: ''
});

const validateEmail = () => {
  if (!email.value) {
    errors.value.email = 'Email is required';
    return false;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    errors.value.email = 'Please enter a valid email address';
    return false;
  }
  errors.value.email = '';
  return true;
};

const validatePassword = () => {
  if (!password.value) {
    errors.value.password = 'Password is required';
    return false;
  }
  if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
    return false;
  }
  errors.value.password = '';
  return true;
};

const handleLogin = async () => {
  // Validate all fields
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (!isEmailValid || !isPasswordValid) {
    return;
  }

  loading.value = true;

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    addToast({
      message: 'Login successful! Redirecting...',
      type: 'success',
      duration: 2000
    });
    router.push({ name: "dashboard" });
  } catch (error) {
    console.error('Login error:', error);
    addToast({
      message: 'An error occurred. Please try again later.',
      type: 'error',
      duration: 4000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f7;
  padding: 20px;
}

.login-card {
  display: flex;
  width: calc(80vw - 40px);
  height: calc(90vh - 40px);
  max-width: 100%;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.login-left {
  flex: 1;
  background: #0a0a0a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.login-left-content {
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.login-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
}

.login-logo i {
  font-size: 28px;
}

.login-hero {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  letter-spacing: -1px;
}

.login-subtitle {
  font-size: 16px;
  line-height: 1.5;
  color: #cccccc;
  margin: 0;
}

.back-to-website:hover {
  color: #ffffff;
}

.back-to-website i {
  font-size: 16px;
}

.login-right {
  flex: 1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
}

.login-form-container {
  max-width: 440px;
  width: 100%;
}

.login-header {
  margin-bottom: 40px;
}

.login-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #0a0a0a;
  margin: 0 0 12px 0;
}

.login-header p {
  font-size: 14px;
  color: #7a7a7a;
  margin: 0;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #0a0a0a;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper>i {
  position: absolute;
  left: 16px;
  color: #7a7a7a;
  font-size: 18px;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: #fafafa;
  color: #0a0a0a;
  transition: all 0.2s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #0a0a0a;
  background: #ffffff;
}

.input-wrapper input.is-invalid {
  border-color: #dc3545;
  background: #fff5f5;
}

.input-wrapper input.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.input-wrapper input::placeholder {
  color: #a0a0a0;
}

.validation-error {
  color: #dc3545;
  font-size: 12px;
  margin-top: -4px;
  display: block;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toggle-password {
  position: absolute;
  right: 16px;
  background: transparent;
  border: none;
  color: #7a7a7a;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: #0a0a0a;
}

.toggle-password i {
  font-size: 18px;
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: #0a0a0a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
}

.login-btn:hover:not(:disabled) {
  background: #1a1a1a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;

  .btn-spinner {
    display: flex;
    align-items: center;
  }

  .spinner-icon {
    font-size: 18px;
    animation: spin 0.8s linear infinite;
  }

  /* Pulse spinner when loading */
  .login-btn.is-loading .spinner-icon {
    animation: spin 0.8s linear infinite, pulse 1.6s ease-in-out infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.9;
    }

    50% {
      transform: scale(1.15);
      opacity: 1;
    }

    100% {
      transform: scale(1);
      opacity: 0.9;
    }
  }

  /* Animated progress bar at bottom of button while loading */
  .login-btn.is-loading::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0) 100%);
    background-size: 200% 100%;
    animation: progressSlide 1.2s linear infinite;
  }

  @keyframes progressSlide {
    0% {
      background-position: 200% 0;
    }

    100% {
      background-position: -200% 0;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
  }
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin: 0;
  text-align: center;
}

@media (max-width: 1024px) {
  .login-left {
    display: none;
  }

  .login-card {
    max-width: 500px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 20px;
  }

  .login-right {
    padding: 40px 24px;
  }

  .login-header h2 {
    font-size: 28px;
  }

  .login-title {
    font-size: 36px;
  }
}
</style>
