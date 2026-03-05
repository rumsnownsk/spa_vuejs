<script setup>
import {ref} from "vue";

defineOptions({
  name: 'AdminLayout'
})
const models = ref([
  {name: 'topics', label: 'Темы', route: 'admin.topics'},
  {name: 'posts', label: 'Посты', route: 'admin.posts'},
  {name: 'tags', label: 'Теги', route: 'admin.tags'}
])

</script>

<template>
  <div class="">
    <section class="bg-blue-900 p-4 h-24 content-center">
      <header class="flex justify-between w-3/4 mx-auto content-center">
        <h1 class="h-auto text-yellow-50 uppercase text-2xl my-auto
          border-1 border-transparent rounded-2xl
          px-8 py-4 bg-gray-800 animate-pulse-blue
          font-bold relative overflow-hidden"
        >
          Admin Panel
        </h1>
        <div class="flex items-center">
          <router-link
              :to="{name: 'index'}"
              class="h-max p-3 font-bold text-gray-900 bg-gradient-to-b from-sky-200 to-sky-300
              border-b-4 border-sky-600 rounded-xl shadow-2xl shadow-sky-400/60
              hover:from-sky-300 hover:to-sky-400 hover:border-sky-700 hover:-translate-y-1
              active:translate-y-0.5 active:shadow-inner active:shadow-sky-500/40 transition-all duration-100">
            Client page
          </router-link>
        </div>
      </header>
    </section>
    <section class="flex">
      <aside class="bg-gray-600 min-h-screen w-1/4 text-white">
        <div class="text-center">ASIDE</div>

        <router-link
            v-for="model in models"
            :key="model.name"
            :to="{name: model.route}"
            class="block text-gray-200 p-2 border-b bg-gray-500 text-xl uppercase text-center font-bold">
          {{ model.name }}
        </router-link>
      </aside>
      <article class="bg-gray-200 w-3/4 p-4">
        <slot/>
      </article>
    </section>
  </div>
</template>

<style scoped>
@keyframes pulse-blue {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  }
  50% {
    box-shadow: 0 0 30px rgba(147, 197, 253, 0.9);
  }
}

.animate-pulse-blue {
  animation: pulse-blue 3s ease-in-out infinite;
}
</style>