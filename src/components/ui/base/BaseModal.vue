<template>
  <teleport to="body">
    <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="close">
      <div class="modal-dialog modal-dialog-centered" :class="sizeClass">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ props.title }}</h5>
            <button type="button" class="btn-close" @click="close"></button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  size: { type: String, default: "" },
});

const emit = defineEmits(["close"]);

const close = () => emit("close");

const sizeClass = computed(() => (props.size ? `modal-${props.size}` : ""));
</script>
