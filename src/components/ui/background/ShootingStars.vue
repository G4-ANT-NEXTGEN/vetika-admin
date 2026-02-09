<template>
  <div class="stars-container">
    <!-- Static Stars Canvas -->
    <canvas ref="starsCanvas" class="stars-canvas"></canvas>

    <!-- Shooting Stars SVG -->
    <svg ref="shootingStarsSvg" class="shooting-stars-svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: #2EB9DF; stop-opacity: 0;" />
          <stop offset="100%" style="stop-color: #9E00FF; stop-opacity: 1;" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Optional slot for content over the background -->
    <div class="relative z-10 w-full h-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const theme = computed(() => (themeStore.isDarkMode ? 'dark' : 'light'));
const starsCanvas = ref(null);
const shootingStarsSvg = ref(null);
let starsBg = null;
let shootingStarsSys = null;

// ===============================
// STARS BACKGROUND CLASS
// ===============================
class StarsBackground {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    // Configuration
    this.starDensity = options.starDensity || 0.00015;
    this.allStarsTwinkle = options.allStarsTwinkle !== undefined ? options.allStarsTwinkle : true;
    this.twinkleProbability = options.twinkleProbability || 0.7;
    this.minTwinkleSpeed = options.minTwinkleSpeed || 0.5;
    this.maxTwinkleSpeed = options.maxTwinkleSpeed || 1;
    this.starColor = options.starColor || '#ffffff';

    this.stars = [];
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.generateStars();
    this.render();

    // Window resize listener attached in parent component for cleanup safety
    this.resizeHandler = () => {
      this.resizeCanvas();
      this.generateStars();
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  setStarColor(color) {
    this.starColor = color;
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }

  generateStars() {
    if (!this.canvas) return;
    const area = this.canvas.width * this.canvas.height;
    const numStars = Math.floor(area * this.starDensity);

    this.stars = Array.from({ length: numStars }, () => {
      const shouldTwinkle = this.allStarsTwinkle || Math.random() < this.twinkleProbability;
      return {
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 0.05 + 0.5,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: shouldTwinkle
          ? this.minTwinkleSpeed + Math.random() * (this.maxTwinkleSpeed - this.minTwinkleSpeed)
          : null
      };
    });
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.stars.forEach(star => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

      // Use hex color and opacity
      // We need to convert hex to rgb to use rgba, or just use globalAlpha, but simple interpolation is easier if we assume standard colors
      // Since we switch between #ffffff and #000000, let's just use the prop

      // Hacky hex to rgba for simple colors or just use style
      this.ctx.fillStyle = this.getStarFillStyle(star.opacity);
      this.ctx.fill();

      // Update twinkle effect
      if (star.twinkleSpeed !== null) {
        star.opacity = 0.5 + Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5);
      }
    });

    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  getStarFillStyle(opacity) {
    if (this.starColor === '#000000') {
      return `rgba(0, 0, 0, ${opacity})`;
    }
    return `rgba(255, 255, 255, ${opacity})`;
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.resizeHandler);
  }
}

// ===============================
// SHOOTING STARS CLASS
// ===============================
class ShootingStars {
  constructor(svg, options = {}) {
    this.svg = svg;

    // Configuration
    this.minSpeed = options.minSpeed || 10;
    this.maxSpeed = options.maxSpeed || 30;
    this.minDelay = options.minDelay || 1200;
    this.maxDelay = options.maxDelay || 4200;
    this.starColor = options.starColor || '#9E00FF';
    this.trailColor = options.trailColor || '#2EB9DF';
    this.starWidth = options.starWidth || 10;
    this.starHeight = options.starHeight || 1;

    this.currentStar = null;
    this.animationFrameId = null;
    this.timeoutId = null;

    this.init();
  }

  init() {
    this.createStar();
  }

  getRandomStartPoint() {
    if (!this.svg) return { x: 0, y: 0, angle: 45 };
    const parent = this.svg.parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    const side = Math.floor(Math.random() * 4);
    const offset = Math.random() * width;

    switch (side) {
      case 0: // Top
        return { x: offset, y: 0, angle: 45 };
      case 1: // Right
        return { x: width, y: offset, angle: 135 };
      case 2: // Bottom
        return { x: offset, y: height, angle: 225 };
      case 3: // Left
        return { x: 0, y: offset, angle: 315 };
      default:
        return { x: 0, y: 0, angle: 45 };
    }
  }

  createStar() {
    if (!this.svg) return;

    const { x, y, angle } = this.getRandomStartPoint();

    this.currentStar = {
      id: Date.now(),
      x: x,
      y: y,
      angle: angle,
      scale: 1,
      speed: Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed,
      distance: 0,
      element: null
    };

    // Create SVG rect element
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('fill', 'url(#gradient)');
    this.currentStar.element = rect;
    this.svg.appendChild(rect);

    // Start animation
    this.animate();

    // Schedule next star
    const randomDelay = Math.random() * (this.maxDelay - this.minDelay) + this.minDelay;
    this.timeoutId = setTimeout(() => this.createStar(), randomDelay);
  }

  animate() {
    if (!this.currentStar) return;
    if (!this.svg) return;

    const star = this.currentStar;

    // Update position
    star.x += star.speed * Math.cos((star.angle * Math.PI) / 180);
    star.y += star.speed * Math.sin((star.angle * Math.PI) / 180);
    star.distance += star.speed;
    star.scale = 1 + star.distance / 100;

    const parent = this.svg.parentElement;
    const width = parent ? parent.clientWidth : window.innerWidth;
    const height = parent ? parent.clientHeight : window.innerHeight;

    // Check if star is out of bounds
    if (
      star.x < -100 ||
      star.x > width + 100 ||
      star.y < -100 ||
      star.y > height + 100
    ) {
      if (star.element) {
        star.element.remove();
      }
      this.currentStar = null;
      return;
    }

    // Update SVG element
    if (star.element) {
      star.element.setAttribute('x', star.x);
      star.element.setAttribute('y', star.y);
      star.element.setAttribute('width', this.starWidth * star.scale);
      star.element.setAttribute('height', this.starHeight);

      const centerX = star.x + (this.starWidth * star.scale) / 2;
      const centerY = star.y + this.starHeight / 2;
      star.element.setAttribute('transform', `rotate(${star.angle}, ${centerX}, ${centerY})`);
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

onMounted(() => {
  if (starsCanvas.value) {
    // Initialize with correct color based on current theme
    const initialColor = theme.value === 'light' ? '#000000' : '#ffffff';
    starsBg = new StarsBackground(starsCanvas.value, { starColor: initialColor });
  }
  if (shootingStarsSvg.value) {
    shootingStarsSys = new ShootingStars(shootingStarsSvg.value);
  }
});

// Watch for theme changes to update star colors
watch(theme, (newTheme) => {
  if (starsBg) {
    const newColor = newTheme === 'light' ? '#000000' : '#ffffff';
    starsBg.setStarColor(newColor);
  }
});

onUnmounted(() => {
  if (starsBg) starsBg.destroy();
  if (shootingStarsSys) shootingStarsSys.destroy();
});
</script>

<style scoped>
.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: background-color 0.3s ease;
  z-index: 0;
}

.stars-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.shooting-stars-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.relative {
  position: relative;
}

.z-10 {
  z-index: 10;
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}
</style>
