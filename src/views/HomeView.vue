<template>
  <div class="home">
    <h1 style="text-align: center; margin: 20px 0">地址簿系统</h1>
    <ContactList />
  </div>
</template>

<script setup>
import ContactList from '@/components/ContactList.vue'
</script>

<style scoped>
.home {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}
</style>