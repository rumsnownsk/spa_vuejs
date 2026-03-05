<script setup>
import {useTopicStore} from "@/store/topicStore.js";
import {computed, onMounted, provide, ref} from "vue";
import {useTagStore} from "@/store/tagStore.js";
import {usePostStore} from "@/store/postStore.js";

defineOptions({
  name: 'ClientLayout'
})

const topicStore = useTopicStore()
const postStore = usePostStore()

const {loadTagsByTopic} = useTagStore()

onMounted(() => {
  topicStore.getTopics()
  topicStore.init()
})

const selectTopic = async (topic)=>{
  const topicId = topic.id
  await topicStore.setSelectedTopic(topic)
  await loadTagsByTopic(topicId)
}

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 max-w-full">
    <!-- Фиксированный хедер -->
    <header class="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-b border-white/20 z-50 h-20">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-cyan-300 uppercase text-2xl font-bold">Client Panel</h1>
        <router-link
            :to="{name:'admin.topics'}"
            class="px-6 py-3 font-bold text-gray-100 bg-gradient-to-b from-cyan-600/90 to-blue-700/90
          border-b-4 border-cyan-400 rounded-xl shadow-2xl shadow-cyan-500/40
          hover:from-cyan-500 hover:to-blue-600 hover:border-cyan-300 hover:-translate-y-1
          active:translate-y-0.5 active:shadow-inner active:shadow-cyan-400/50 transition-all duration-200"
        >
          ADMIN PAGE
        </router-link>
      </div>
    </header>

    <!-- Основной макет -->
    <div class="flex pt-20 min-h-screen max-w-screen-2xl m-auto">
      <!-- Фиксированная боковая панель -->
      <aside class="left-0 top-20 bottom-0 min-w-fit max-w-fit bg-white/5 backdrop-blur-lg border-r border-white/10 z-40">
        <div class="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
          <div class="px-6 py-4 border-b border-white/20">
            <h3 class="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-cyan-500">
              Выбрать тему
            </h3>
          </div>
          <nav class="flex flex-col space-y-2">
            <a
                v-for="topic in topicStore.topics"
                :key="topic.id"
                @click.prevent="selectTopic(topic)"
                :class="[
                'flex items-center cursor-pointer px-2 py-4 text-blue-200 border-l-4 border-transparent transition-all duration-300 transform-gpu group relative',
                topicStore.topic.id === topic.id
                  ? 'bg-blue-800/60 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                  : 'hover:bg-blue-900/30 hover:border-blue-400'
              ]"
            >
              <!-- Эффект блика при наведении -->
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <!-- Иконка с 3D-эффектом -->
              <div class="w-10 h-10 mr-4 bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-md shadow-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-400/50 group-hover:-translate-y-1 group-hover:scale-105 z-10">
                <img class="w-6 h-6 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300" src="@/assets/images/linux.svg" alt="">
              </div>
              <span class="text-lg font-medium text-white flex-1 truncate z-10">{{ topic.name }}</span>
              <span class="ml-3 px-4 py-2 bg-gradient-to-b from-cyan-600/80 to-blue-700/80 text-cyan-100 text-sm rounded-full min-w-max font-medium border border-cyan-400/50 backdrop-blur-sm z-10 transition-all duration-300 group-hover:bg-cyan-500/90 group-hover:border-cyan-300/70">
                {{ topic.count || 0 }}
              </span>
            </a>
          </nav>
        </div>
      </aside>
      <div class="w-full">
        <slot/>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Градиентный фон для всего приложения */
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, #0f172a, #1e293b, #0c4a6e);
}

/* Плавные переходы для 3D */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}

/* Стили для скроллбара */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thumb-blue-600::-webkit-scrollbar-thumb {
  background-color: #3b82f6;
  border-radius: 3px;
}
.scrollbar-track-blue-100::-webkit-scrollbar-track {
  background-color: #e0f2fe;
}

/* 3D-эффект карточек */
.card-3d {
  transform-style: preserve-3d;
}

/* Градиенты */
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}
.bg-gradient-to-b {
  background: linear-gradient(to bottom, var(--tw-gradient-stops));
}
</style>