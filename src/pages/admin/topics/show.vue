<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {useTopicStore} from "@/store/topicStore.js";
import {useRoute} from "vue-router";
import router from "@/router/router.js";

defineOptions({
  name: 'Show'
})
const {topic, getTopic} = useTopicStore()
onMounted(() => {
  getTopic()
})

</script>

<template>
  <div>
    <div class="flex justify-between">
      <div class="mb-1">
        <h2> SHOW</h2>
      </div>
      <RouterLink :to="{name: 'admin.topics'}"
                  class="inline-block px-4 py-2 bg-sky-600 border border-sky-400 text-white"
        >
        LIST of Topics
      </RouterLink>
    </div>
    <div>
      <div class="w-full border-gray-200 bg-gray-50 text-center">
        <h3 class="mb-4 text-lg">Name: {{ topic.name }}</h3>
        <p class="text-sm">Description: {{ topic.description }}</p>
      </div>
    </div>
  </div>
</template>

