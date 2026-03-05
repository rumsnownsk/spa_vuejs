<script setup>
import {onMounted, reactive, ref} from "vue";
import {useTagStore} from "@/store/tagStore.js";

defineOptions({
  name: 'tagsEdit'
})

onMounted(() => {
  tagStore.getTag()
})

const tagStore = useTagStore()


</script>

<template>
  <div class="mb-4">
    <div class="bg-white border border-gray-200 p-4">
      <div class="mb-4">
        <input
            v-model="tagStore.tag.name"
            class="border border-gray-200 p-4 w-full" type="text" placeholder="inter tag name">
      </div>

      <div class="flex justify-between">
        <div class="mb-4">
          <a @click.prevent="tagStore.updateTag()"
             class="inline-block px-3 py-2 bg-sky-600 text-white border border-sky-700 cursor-pointer">UPDATE TAG</a>
        </div>
        <div>
          <router-link
              :to="{ name: 'admin.tags' }"
              class="inline-block px-3 py-2 bg-yellow-500 text-gray-900 border border-yellow-600 cursor-pointer rounded hover:bg-yellow-700"
          >
            All tags
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>