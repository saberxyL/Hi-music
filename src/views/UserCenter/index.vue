<template>
  <div @click="router.back()">
    <h1>个人中心</h1>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
