<script setup>
import {onMounted, reactive, ref} from "vue";
import {useTopicStore} from "@/store/topicStore.js";

defineOptions({
  name: 'Edit'
})

const topicStore = useTopicStore()

onMounted(() => {
  topicStore.getTopic()
})

</script>

<template>
  <div class="mb-4">
    <div class="bg-white border border-gray-200 p-4">
      <div class="mb-4">
        <input
            v-model="topicStore.topic.name"
            class="border border-gray-200 p-4 w-full" type="text" placeholder="title">
      </div>
      <div class="mb-4">
        <textarea v-model="topicStore.topic.description" class="border border-gray-200 p-4 w-full" type="text"
                  placeholder="content"/>
      </div>
      <div class="flex justify-between">
        <div class="mb-4">
          <a @click.prevent="topicStore.updateTopic()"
             class="inline-block px-3 py-2 bg-sky-600 text-white border border-sky-700 cursor-pointer"
          >
            UPDATE TOPIC
          </a>
        </div>
        <div>
          <router-link
              :to="{ name: 'admin.topics'}"
              class="inline-block px-3 py-2 bg-yellow-500 text-gray-900 border border-yellow-600 cursor-pointer rounded hover:bg-yellow-700"
          >
            All topics
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>