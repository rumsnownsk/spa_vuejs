<script setup>

import {usePostStore} from "@/store/postStore.js";
import {onMounted, watch, ref} from "vue";
import {useTagStore} from "@/store/tagStore.js";
import {useTopicStore} from "@/store/topicStore.js";

const tagStore = useTagStore()
const topicStore = useTopicStore()

const postStore = usePostStore()

// Загружаем все посты при монтировании компонента (без фильтров)
onMounted(async () => {
  await postStore.getPosts()
})

watch(
    [
      () => topicStore.topic,
      () => tagStore.selectedTags,
    ],
    ([newTopic, newTags]) => {

      postStore.getPosts(newTopic.id, newTags)
    },
    {
      deep: true,
    }
)

// Реактивная переменная для отслеживания скопированного поста
const copiedPostId = ref(null);

// Функция копирования в буфер обмена
const copyToClipboard = async (post) => {
  try {
    await navigator.clipboard.writeText(post.body);
    // Показываем индикатор успеха
    copiedPostId.value = post.id;

    // Автоматически скрываем индикатор через 2 секунды
    setTimeout(() => {
      copiedPostId.value = null;
    }, 2000);
  } catch (err) {
    console.error('Ошибка копирования в буфер:', err);
    // fallbackCopyText(text);
  }
};
// Форматирование даты
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-2 text-white">Лист всех записей</h2>
  </div>
  <!-- Листинг постов -->
  <div
      v-for="post in postStore.posts"
      :key="post.id"
      class="card-3d max-w-max bg-white rounded-2xl p-3 shadow-xl transform-gpu transition-all duration-500"
  >
    <div class="flex justify-between">
      <h2 class="text-lg font-bold text-gray-900 mb-4">{{ post.title }}</h2>
      <div
          :class="[
              'text-sm text-gray-500  ml-2',
              post.topic?.name ? '' : 'text-red-500'
              ]"
      >
        {{ post.topic?.name || 'no topic' }}
      </div>
    </div>
    <!-- Основной текст с оформлением -->
    <div class="relative group">
      <!-- Кликабельный блок текста -->
      <p
          @click="copyToClipboard(post)"
          class="
      text-gray-700
      mb-4
      line-clamp-3
      leading-relaxed
      tracking-wide
      font-light
      cursor-pointer
      p-4
      rounded-lg
      bg-gray-50
      hover:bg-gray-100
      transition-all
      duration-300
      ease-in-out
      relative
      z-10
    "
          title="click to copy"
      >
        {{ post.body }}
      </p>

      <!-- всплывающий элемент «Копировать» -->
      <div class="absolute top-0 right-0
      opacity-0
      group-hover:opacity-100
      transition-opacity
      duration-200
      pointer-events-none
      z-20
    ">
        <div class="
      bg-gradient-to-r
      from-blue-500
      to-purple-600
      text-white
      px-2
      py-1
      rounded-full
      text-xs
      font-semibold
      shadow-2xl
      transform
      -rotate-6
      group-hover:rotate-0
      group-hover:scale-105
      transition-transform
      duration-300
    ">
          📋 copy
        </div>
      </div>

      <!-- Индикатор успешного копирования -->
      <div
          v-if="copiedPostId === post.id"
          class="
      absolute
      top-4
      left-1/2
      -translate-x-1/2
      bg-green-500
      text-white
      px-6
      py-2
      rounded-xl
      text-sm
      font-medium
      shadow-lg
      animate-pulse
      z-30
    "
      >
        ✅ Скопировано в буфер обмена!
      </div>
    </div>
    <div class="flex justify-between items-center">
      <div class="flex gap-2 flex-wrap">
        <span
            v-for="tag in post.tags"
            class="px-3 py-1 text-sm bg-cyan-300 rounded-full"
        >
          {{ tag.name }}
        </span>
      </div>
      <div class="self-end">
        <div
            v-if="post.updated_at"
            class="text-xs text-gray-500 ml-2">
          upd: {{ post.updated_at }}
        </div>
        <div
            v-if="post.created_at"
            class="text-sm text-gray-500 ml-2">
          Создан: {{ post.created_at }}
        </div>
      </div>

    </div>
  </div>
</template>


<style scoped>
/* 3D-эффект карточки */
.card-3d {
  transform-style: preserve-3d;
  perspective: 1000px;
  background: #c5e5d1;
  position: relative; /* Важно для корректной работы псевдоэлементов */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.8),
  0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
}

.card-3d::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.3));
  border-radius: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.card-3d:hover::before {
  opacity: 1;
}

/* Эффект появления тени по периметру при наведении */
.card-3d:hover {
  box-shadow: 0 10px 25px -3px rgba(59, 130, 246, 0.25),
  0 8px 32px -8px rgba(30, 41, 59, 0.15),
  0 0 0 4px rgba(59, 130, 246, 0.1); /* Дополнительная подсветка по периметру */
}

/* Эффект поворота по оси Y */
.hover\:rotate-y-10 {
  transform: rotateY(-10deg) !important;
}

/* Градиентный фон */
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, #0f172a, #1e293b, #0c4a6e);
}

/* Плавные переходы для 3D */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform, box-shadow;
}
</style>
