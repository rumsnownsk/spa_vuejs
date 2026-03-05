<script setup>
import {inject, onMounted, ref, watch} from "vue";
import {useTagStore} from "@/store/tagStore.js";

defineOptions({
  name: 'Tags'
})

const storeTag = useTagStore()
// const selectedTags = ref([])
const selectedTags = storeTag.selectedTags
const loading = ref(false)
const error = ref(null)

const toggleTag = (tagId) => {
  const index = selectedTags.indexOf(tagId)
  if (index === -1) {
    selectedTags.push(tagId)
  } else {
    selectedTags.splice(index, 1)
  }
}

onMounted(async () => {
  await storeTag.getTags()
})

// Отслеживаем изменения массива tags
watch(
    () => storeTag.tags, // функция-геттер для отслеживания
    (newTags, oldTags) => {
      // console.log('newT: ' + newTags)
      // console.log('oldT: ' + oldTags)
    },
    {
      immediate: true, // сразу выполнить при создании watcher
      deep: true     // отслеживать глубокие изменения (если нужны)
    })
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-white">Теги по выбранной темe:</h2>

    <transition-group
        name="tags-stagger"
        tag="div"
        class="flex flex-wrap gap-3"
    >
      <div
          v-for="(tag, index) in storeTag.tags"
          @click="toggleTag(tag.id)"
          :key="tag.id"
          :class="[
            'px-4 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer',
            selectedTags.includes(tag.id)
              ? 'bg-cyan-400 text-white shadow-lg'
              : 'bg-gray-200 text-gray-200 hover:bg-cyan-300'
          ]"
      >
        <span class="font-semibold text-lg text-gray-800">{{ tag.name }}</span>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.tags-stagger-enter-active {
  transition: all 0.4s ease;
}

.tags-stagger-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.tags-stagger-enter-from {
  opacity: 0;
  transform: translateX(-30px) rotate(-10deg);
}

.tags-stagger-leave-to {
  opacity: 0;
  transform: translateX(30px) rotate(10deg);
}
</style>