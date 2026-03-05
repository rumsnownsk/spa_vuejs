<script setup>
import ZoneTags from '@/pages/client/ZoneTags.vue'
import ZonePosts from "@/pages/client/ZonePosts.vue";


</script>

<template>
  <!-- Область с листингом постов (прокрутка только здесь) -->
  <main class="flex-1 bg-white/5 backdrop-blur-lg overflow-y-auto h-[calc(100vh-80px)]">
    <div class="p-6 space-y-6">
      <ZoneTags>

      </ZoneTags>
      <ZonePosts>

      </ZonePosts>
    </div>
  </main>
</template>

<style scoped>

</style>