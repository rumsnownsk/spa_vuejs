<script setup>
import {useRoute} from "vue-router";
import router from "@/router/router.js";
import {computed, inject, onMounted, ref, watch} from "vue";

defineOptions({
  name: 'DefaultLayout'
})
const title = ref('')
const nameButton = ref('')
const prefix = inject('prefix')
const prefixLink = ref(null)




onMounted(() => {
  console.log(prefix.value);
  switch (prefix.value) {
    case 'admin':
      title.value = 'Admin Panel'
      nameButton.value = 'Main Page'
      prefixLink.value = 'index'
      break;
    case 'index':
      title.value = 'Client Panel'
      nameButton.value = 'Admin Page'
      prefixLink.value = 'admin.topics'
      break;
  }
})


</script>

<template>

  <div class="">
    <section class="bg-blue-900 p-4 h-24 content-center">
      <header class="flex justify-between w-3/4 mx-auto">
        <h1 class="text-yellow-50 uppercase text-2xl my-auto">{{ title }}</h1>
        <div>
          <router-link
              :to="{name: prefixLink}"
              class="inline-block p-3 font-bold text-gray-900 bg-gradient-to-b from-sky-200 to-sky-300 border-b-4 border-sky-600 rounded-xl shadow-2xl shadow-sky-400/60 hover:from-sky-300 hover:to-sky-400 hover:border-sky-700 hover:-translate-y-1 active:translate-y-0.5 active:shadow-inner active:shadow-sky-500/40 transition-all duration-100">
            Main page
          </router-link>
        </div>
      </header>
    </section>
    <section class="flex">

      <article class="bg-gray-200 w-3/4 p-4">
        <slot/>
      </article>
    </section>
  </div>
</template>

<style scoped>

</style>