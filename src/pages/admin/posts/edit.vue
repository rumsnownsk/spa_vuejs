<script setup>
import {computed, onMounted, ref} from "vue";
import {usePostStore} from "@/store/postStore.js";
import {useTagStore} from "@/store/tagStore.js";
import {useTopicStore} from "@/store/topicStore.js";
import {storeToRefs} from "pinia";

defineOptions({
  name: 'PostEdit'
})

const postStore = usePostStore()
const tagStore = useTagStore()
const topicStore = useTopicStore()

const {topics} = storeToRefs(topicStore)
const {tags} = storeToRefs(tagStore)

// Локальное состояние
const selectedTopicId = ref(null);
const selectedTagIds = ref([]);
const isLoading = ref(false);
const errors = ref({});

onMounted(async () => {
  try {
    await topicStore.getTopics()
    await tagStore.getTags()
    await postStore.getPost()

    if (postStore.post) {
      selectedTopicId.value = postStore.post.topic.id
      selectedTagIds.value = postStore.post.tags.map(tag => tag.id) || []
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    errors.value.general = 'Не удалось загрузить данные для редактирования';
  }
})

// Вычисляемое свойство для проверки валидности формы
const isFormValid = computed(() => {
  return postStore.post.title && postStore.post.body && postStore.post.topic_id
})

const handleSubmit = async () => {
  if (!isFormValid) {
    errors.value.form = "Нужно заполнить обязательные поля";
    return;
  }
  isLoading.value = true

  try {
    const postData = {
      ...postStore.post,
      topic_id: selectedTopicId.value,
      tag_ids: selectedTagIds.value
    }
    await postStore.updateTopic(postData)
  } catch (error) {

  }
}
</script>

<template>
  <div class="mb-4">
    <div class="bg-white border border-gray-200 p-4">

      <div class="mb-4">
        <label class="block mb-2 font-semibold">Title</label>
        <input
            v-model="postStore.post.title"
            class="border border-gray-200 p-4 w-full"
            type="text"
            placeholder="Title Post">
      </div>

      <div class="mb-4">
        <label class="block mb-2 font-semibold">Body</label>
        <textarea
            v-model="postStore.post.body"
            class="border border-gray-200 p-4 w-full"
            type="text"
            placeholder="body"/>
      </div>

      <!-- Выбор темы -->
      <div class="mb-4">
        <label class="block mb-2 font-semibold">Topic</label>
        <select
            v-model="selectedTopicId"
            class="border border-gray-200 p-2 w-full"
        >
          <option value="" disabled>Select topic</option>
          <option
              v-for="topic in topics"
              :key="topic.id"
              :value="topic.id"
          >
            {{ topic.name }}
          </option>
        </select>
      </div>

      <!-- Выбор тегов -->
      <div class="mb-4">
        <label class="block mb-2 font-semibold">Tags</label>
        <div class="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
          <label
              v-for="tag in tags"
              :key="tag.id"
              class="flex items-center space-x-2 cursor-pointer"
          >
            <input
                type="checkbox"
                :value="tag.id"
                v-model="selectedTagIds"
                class="rounded text-blue-600"
            />
            <span>{{ tag.name }}</span>
          </label>
        </div>
      </div>

      <div class="mb-4">
        <!-- Кнопки управления -->
        <div class="flex justify-between">
          <div>
            <button
                @click="handleSubmit"
                type="button"
                :disabled="isLoading"
                class="inline-block px-3 py-2 bg-sky-600 text-white border border-sky-700 cursor-pointer rounded hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading">Creating...</span>
              <span v-else>Update Post</span>
            </button>
          </div>
          <div>
            <router-link
                :to="{ name: 'admin.posts' }"
                class="inline-block px-3 py-2 bg-yellow-500 text-gray-900 border border-yellow-600 cursor-pointer rounded hover:bg-yellow-700"
            >
              All posts
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>