<template>
  <div class="contact-edit">
    <h1 style="text-align: center; margin: 20px 0">
      {{ $route.params.id ? '编辑联系人' : '添加联系人' }}
    </h1>
    <ContactForm />
  </div>
</template>

<script setup>
import ContactForm from '@/components/ContactForm.vue'
</script>

<style scoped>
.contact-edit {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
</style>