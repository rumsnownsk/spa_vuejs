<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useTopicStore} from "@/store/topicStore.js";
import {storeToRefs} from "pinia";

const countTopics = ref(0)
const topicStore = useTopicStore()
const {topics} = storeToRefs(topicStore)

onMounted(async () => {
  await topicStore.getTopics()
})

watch(
    ()=>topics.value,
    (newTopics) => {
      countTopics.value = newTopics?.length ?? 0
    },
    {
      deep: true,
      immediate: true // Опционально: запустить сразу при монтировании
    })
</script>

<template>
  <div>
    <div class="mb-1 flex my-auto justify-between ">
      <div class="flex my-auto mx-auto ">
        <h3 class="text-lg font-bold uppercase"> all topics</h3>
        <span class="ml-2 h-full my-auto">(count: {{ countTopics }})</span>
      </div>
      <div>
        <router-link :to="{name: 'admin.topics.create'}"
                     class="inline-block px-4 py-2 bg-sky-600 border border-sky-400 text-white">
          Create Topic
        </router-link>
      </div>
    </div>
    <div>
      <table class="w-full border border-gray-200">
        <thead>
        <tr class="bg-white border-b border-gray-200 text-left p-2">
          <th>ID</th>
          <th>name</th>
          <th>Slug</th>
          <th>Desc</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="topic in topics" class="bg-white border-b border-gray-200 text-left p-2">
          <td>{{ topic.id }}</td>
          <td>
            <router-link
                :to="{name: 'admin.topics.show', params: {id: topic.id}}"
            >
              {{ topic.name }}
            </router-link>
          </td>
          <td>{{ topic.slug }}</td>
          <td>{{ topic.description }}</td>
          <td>
            <div class="flex mx-auto">
              <div class="mr-2">
                <svg @click="topicStore.deleteTopic(topic.id)" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-6 cursor-pointer text-red-500">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                </svg>
              </div>
              <div>
                <router-link :to="{name: 'admin.topics.edit', params:{id: topic.id }}">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="size-6 text-emerald-600 cursor-pointer">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                  </svg>
                </router-link>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>