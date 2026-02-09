<template>
  <div class="background-beams-container">
    <div ref="beamsWrapper" class="beams-wrapper">
      <!-- Beams will be generated here -->
    </div>

    <!-- Optional slot for content intended to be collided with, though in this bg context it might be empty -->
    <div ref="contentContainer" class="content-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const beamsWrapper = ref(null);
const contentContainer = ref(null);
let beamSystem = null;

// Beam Configuration
const beamConfigs = [
  { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2 },
  { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4 },
  { initialX: 100, translateX: 100, duration: 7, repeatDelay: 7, delay: 0, className: 'h-6' },
  { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4 },
  { initialX: 800, translateX: 800, duration: 11, repeatDelay: 2, delay: 0, className: 'h-20' },
  { initialX: 1000, translateX: 1000, duration: 4, repeatDelay: 2, delay: 0, className: 'h-12' },
  { initialX: 1200, translateX: 1200, duration: 6, repeatDelay: 4, delay: 2, className: 'h-6' }
];

class BeamCollisionSystem {
  constructor(wrapper, container) {
    this.beamsWrapper = wrapper;
    this.contentContainer = container;
    this.beams = [];
    this.collisionDetected = new Set();
    this.intervals = [];
    this.init();
  }

  init() {
    if (!this.beamsWrapper) return;

    // Add collision zone marker
    const collisionZone = document.createElement('div');
    collisionZone.className = 'collision-zone';
    this.beamsWrapper.appendChild(collisionZone);

    // Create beams
    beamConfigs.forEach((config, index) => {
      this.createBeam(config, index);
    });

    // Start collision detection
    this.startCollisionDetection();

    // Initial adjustment
    this.adjustBeamsForScreenSize();

    // Window resize listener
    this.resizeHandler = () => this.adjustBeamsForScreenSize();
    window.addEventListener('resize', this.resizeHandler);
  }

  cleanup() {
    this.intervals.forEach(clearInterval);
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    if (this.beamsWrapper) {
      this.beamsWrapper.innerHTML = '';
    }
  }

  createBeam(config, index) {
    const beam = document.createElement('div');
    beam.className = `beam ${config.className || ''}`;
    beam.style.left = `${config.initialX}px`;
    beam.dataset.index = index;
    beam.dataset.active = 'true';

    // Calculate total cycle time
    const totalDuration = (config.duration + (config.repeatDelay || 0)) * 1000;

    // Set animation
    beam.style.animation = `beamDrop ${config.duration}s linear ${config.delay || 0}s infinite`;
    beam.style.animationDelay = `${config.delay || 0}s`;

    this.beamsWrapper.appendChild(beam);

    const beamData = {
      element: beam,
      config: config,
      index: index,
      cycleCollisionDetected: false
    };

    this.beams.push(beamData);

    // Reset collision detection for each cycle
    const resetInterval = setInterval(() => {
      if (beamData.element.parentNode) {
        beamData.cycleCollisionDetected = false;
        this.collisionDetected.delete(index);
      } else {
        clearInterval(resetInterval);
      }
    }, totalDuration);

    this.intervals.push(resetInterval);
  }

  startCollisionDetection() {
    const detectionInterval = setInterval(() => {
      this.checkCollisions();
    }, 50);
    this.intervals.push(detectionInterval);
  }

  checkCollisions() {
    if (!this.contentContainer) return;

    // Since this is a background, we might check collisions against the center or a virtual line
    // Or if content is slotted, we check against that.
    // For a generic background, let's assume a "virtual" collision zone in the middle if no content
    let collisionY;

    if (this.contentContainer.children.length > 0) {
      const contentRect = this.contentContainer.getBoundingClientRect();
      collisionY = contentRect.top;
    } else {
      // Default to middle of screen
      collisionY = window.innerHeight / 2;
    }

    this.beams.forEach((beamData) => {
      if (beamData.cycleCollisionDetected) return;

      const beamRect = beamData.element.getBoundingClientRect();
      const beamBottom = beamRect.bottom;

      // Check if beam has reached the collision zone
      if (beamBottom >= collisionY && beamBottom <= collisionY + 50) {
        if (!this.collisionDetected.has(beamData.index)) {
          this.collisionDetected.add(beamData.index);
          beamData.cycleCollisionDetected = true;

          const relativeX = beamRect.left + beamRect.width / 2;
          const relativeY = beamBottom;

          this.createExplosion(relativeX, relativeY);
        }
      }
    });
  }

  createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    // Adjust for container position if necessary, but here we use fixed/absolute positioning logic
    // Since beamsWrapper is fixed inset 0, x/y from rect should work relative to viewport
    // But let's make sure it's relative to the wrapper

    const wrapperRect = this.beamsWrapper.getBoundingClientRect();
    explosion.style.left = `${x - wrapperRect.left}px`;
    explosion.style.top = `${y - wrapperRect.top}px`;

    // Create 20 particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'explosion-particle';

      const directionX = Math.floor(Math.random() * 80 - 40);
      const directionY = Math.floor(Math.random() * -50 - 10);

      particle.style.setProperty('--tx', `${directionX}px`);
      particle.style.setProperty('--ty', `${directionY}px`);

      explosion.appendChild(particle);
    }

    this.beamsWrapper.appendChild(explosion);

    // Remove explosion after animation
    setTimeout(() => {
      explosion.remove();
    }, 1000);
  }

  adjustBeamsForScreenSize() {
    const screenWidth = window.innerWidth;

    this.beams.forEach((beamData) => {
      const config = beamData.config;

      // Scale X position based on screen width
      if (screenWidth < 1400) {
        const scaleFactor = screenWidth / 1400;
        const adjustedX = config.initialX * scaleFactor;
        beamData.element.style.left = `${adjustedX}px`;
      }
    });
  }
}

onMounted(() => {
  if (beamsWrapper.value && contentContainer.value) {
    beamSystem = new BeamCollisionSystem(beamsWrapper.value, contentContainer.value);
  }
});

onUnmounted(() => {
  if (beamSystem) {
    beamSystem.cleanup();
  }
});
</script>

<style>
/* Scoped styles might be better, but for dynamic elements created by JS (beams, explosions),
   we need deep selectors or global styles. I'll use a specific class scope. */

.background-beams-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: transparent;
  /* Assuming overlay on existing BG or handling BG itself */
  pointer-events: none;
  /* Let clicks pass through to content */
  z-index: 0;
  /* Behind everything */
}



/* Beams Wrapper */
.beams-wrapper {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

/* Individual Beam */
.beam {
  position: absolute;
  width: 2px;
  height: 200px;
  background: linear-gradient(to bottom,
      rgba(59, 130, 246, 0),
      rgba(59, 130, 246, 0.6),
      var(--color-primary));
  filter: blur(1.5px);
  top: -200px;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
  opacity: 0.4;
}

[data-theme="light"] .beam {
  background: linear-gradient(to bottom,
      rgba(59, 130, 246, 0),
      rgba(59, 130, 246, 0.6),
      rgba(37, 99, 235, 0.8));
  opacity: 0.5;
}

.beam.h-6 {
  height: 1.5rem;
}

.beam.h-12 {
  height: 3rem;
}

.beam.h-20 {
  height: 5rem;
}

/* Content Container */
.content-container {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
}

/* Explosion Effect */
.explosion {
  position: absolute;
  pointer-events: none;
  z-index: 5;
}

.explosion-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(to right, #3b82f6, var(--color-primary));
  border-radius: 50%;
  animation: explode 0.8s ease-out forwards;
}

@keyframes explode {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }

  100% {
    transform: translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
}

/* Beam Animation Keyframes */
@keyframes beamDrop {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(calc(100vh + 200px));
  }
}

/* Collision Zone */
.collision-zone {
  position: absolute;
  bottom: 50%;
  left: 0;
  right: 0;
  height: 200px;
  pointer-events: none;
  z-index: 2;
  /* opacity: 0; invisible */
}
</style>
