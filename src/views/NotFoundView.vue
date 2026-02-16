<template>
  <section class="not-found">
    <div class="nf-card">
      <span class="nf-glow"></span>
      <span class="nf-ring"></span>
      <div class="nf-mark">404</div>
      <div class="eyebrow-wrapper">
        <div class="icon-circle">
          <i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
        </div>
        <p class="eyebrow">Error 404</p>
      </div>
      <h1 class="header-title">Page not found</h1>
      <p class="subtext">The page you are looking for does not exist.</p>
      <div class="nf-divider"></div>
      <RouterLink to="/" class="btn accent">
        <i class="bi bi-house-fill" aria-hidden="true"></i>
        Back to Dashboard
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.not-found {
  min-height: calc(100vh - 160px);
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background:
    radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.12), transparent 45%),
    radial-gradient(circle at 85% 80%, rgba(16, 185, 129, 0.12), transparent 45%);
}

.nf-card {
  width: min(520px, 100%);
  background: var(--nav-bg);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(6px);
  background-image:
    linear-gradient(var(--color-text) 0.05px, transparent 0.05px),
    linear-gradient(90deg, var(--color-text) 0.05px, transparent 0.05px);
  background-size: 30px 30px;
}

[data-theme='light'] .nf-card {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
}

[data-theme='dark'] .nf-card {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
}

.eyebrow-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.icon-circle {
  width: 28px;
  height: 28px;
  background: var(--nav-surface);
  border-radius: 50%;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  font-size: 14px;
}

.eyebrow {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-muted);
}

.nf-mark {
  position: absolute;
  top: 18px;
  right: 22px;
  font-size: 72px;
  font-weight: 800;
  letter-spacing: 6px;
  color: var(--color-text);
  opacity: 0.06;
  pointer-events: none;
}

.header-title {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.5px;
  background: linear-gradient(120deg, var(--color-text), rgba(59, 130, 246, 0.8));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtext {
  margin: 8px 0 20px;
  color: var(--color-muted);
  font-size: 15px;
}

.nf-divider {
  height: 1px;
  width: 90px;
  margin: 0 auto 18px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
}

.nf-glow {
  position: absolute;
  width: 180px;
  height: 180px;
  top: -80px;
  left: -60px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 70%);
  opacity: 0.8;
  animation: nfFloat 8s ease-in-out infinite;
}

.nf-ring {
  position: absolute;
  width: 220px;
  height: 220px;
  right: -90px;
  bottom: -90px;
  border-radius: 50%;
  border: 1px dashed rgba(148, 163, 184, 0.4);
  animation: nfSpin 16s linear infinite;
}

@keyframes nfFloat {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(12px);
  }
}

@keyframes nfSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.btn {
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn.accent {
  background: var(--color-text);
  color: var(--nav-bg);
  border: none;
}

.btn.accent:hover {
  opacity: 0.9;
}

@media (max-width: 640px) {
  .nf-card {
    padding: 24px;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
