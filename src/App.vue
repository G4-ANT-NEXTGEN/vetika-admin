<template>
  <router-view />
  <!-- Global Toast Notifications -->
  <ToastContainer />
  <!-- Global Confirm Dialog -->
  <ConfirmDialog />
</template>
<script setup>

import ToastContainer from '@/components/ui/ToastContainer.vue'
import ConfirmDialog from '@/components/ui/base/ConfirmDialog.vue'

</script>
