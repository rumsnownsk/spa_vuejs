<script setup>
import {inject, nextTick, onMounted, onUpdated, ref, watch} from "vue";
import {useTagStore} from "@/store/tagStore.js";

defineOptions({
  name: 'Tags'
})

const storeTag = useTagStore()
// const selectedTags = ref([])
const selectedTags = storeTag.selectedTags
const loading = ref(false)
const error = ref(null)
const tagsSection = ref(null)

const updateHeightTags = async () => {
  await nextTick() // ждём перерисовки DOM
  const tagsHeight = tagsSection.value?.offsetHeight || 0
  // Устанавливаем CSS‑переменную с реальной высотой зоны тегов
  document.documentElement.style.setProperty('--tags-section-height', `${tagsHeight}px`)
}

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
  await updateHeightTags()
  window.addEventListener('resize', updateHeightTags)
})
onUpdated(async () => {
  await updateHeightTags()
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
  <div ref="tagsSection" class="tags-section p-3 max-w-4xl mx-auto flex-shrink-0">
    <h2 class="text-2xl font-bold mb-6 text-white justify-self-center">Выбрать теги:</h2>

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
.tags-section {
  flex: 0 0 auto; /* не сжимается, не растёт, высота по контенту */
}
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.tags-section {
  flex: 0 0 auto; /* не сжимается, не растёт, высота по контенту */
}
</style>