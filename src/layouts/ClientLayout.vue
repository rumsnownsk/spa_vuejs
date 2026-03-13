<script setup>
import {useTopicStore} from "@/store/topicStore.js";
import {computed, onMounted, provide, ref} from "vue";
import {useTagStore} from "@/store/tagStore.js";
import {usePostStore} from "@/store/postStore.js";
import {useAuthStore} from "@/store/authStore.js";

defineOptions({
  name: 'ClientLayout'
})

const topicStore = useTopicStore()
const postStore = usePostStore()
const authStore = useAuthStore()

onMounted(async () => {
  await topicStore.init()
  await topicStore.getTopics()
  await authStore.restoreAuth()
})

const selectTopic = async (topic) => {
  await topicStore.setSelectedTopic(topic)
}

// Вычисляемое свойство для отслеживания статуса авторизации
const isLoggedIn = computed(() => authStore.isAuthenticated)

const openModalWindow = ()=>{
  if (!isLoggedIn.value){
    authStore.showAuthModal = true
  }

}
const closeAuthModal = () => {
  authStore.showAuthModal = false
}

const getImageUrl = (topicImage)=>{
  return topicImage ? new URL(`/src/assets/images/${topicImage}`, import.meta.url).href : ''
}


</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 max-w-full">
    <!-- Фиксированный хедер -->
    <header class="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-b border-white/20 z-50 h-20">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-cyan-300 uppercase text-2xl font-bold">Client Panel</h1>
        <div class="flex items-center">
          <div
              v-if="authStore.isAuthenticated"
              class="flex items-center gap-4 px-2 py-1 mr-20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-200/50 rounded-xl backdrop-blur-sm"
          >
            <div
                class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
              {{ authStore.user.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="font-bold text-red-50">
                Привет, {{ authStore.user.name }}
              </p>
              <p class="text-xs font-medium text-cyan-600 flex items-center gap-1">
                <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="4"/>
                </svg>
                Онлайн
              </p>
            </div>
          </div>
            <router-link
                v-if="authStore.isAuthenticated"
                :to="{name:'admin.topics'}"
                class="mr-4 px-6 py-3 font-bold text-gray-100 bg-gradient-to-b from-cyan-600/90 to-blue-700/90
          border-b-4 border-cyan-400 rounded-xl shadow-2xl shadow-cyan-500/40
          hover:from-cyan-500 hover:to-blue-600 hover:border-cyan-300 hover:-translate-y-1
          active:translate-y-0.5 active:shadow-inner active:shadow-cyan-400/50 transition-all duration-200"
            >
              ADMIN PAGE
            </router-link>

          <button
              v-if="!isLoggedIn"
              @click="openModalWindow"
              type="button"
              class=" cursor-pointer w-50 h-12 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-center"
          >
            <p class="font-medium flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 01-7 7 7 7 0 0114 0 7 7 0 01-7-7z"/>
              </svg>

              Please, logged in
            </p>
          </button>
          <button
              v-else
              @click="authStore.logout()"
              type="button"
              class="px-6 py-3 font-bold text-gray-100 bg-gradient-to-b from-cyan-600/90 to-blue-700/90
                    border-b-4 border-cyan-400 rounded-xl shadow-2xl shadow-cyan-500/40 cursor-pointer
                    hover:from-cyan-500 hover:to-blue-600 hover:border-cyan-300 hover:-translate-y-1
                    active:translate-y-0.5 active:shadow-inner active:shadow-cyan-400/50 transition-all duration-200"
          >
            logout
          </button>
        </div>
      </div>
    </header>

    <!-- Основной макет -->
    <div class="flex pt-20 min-h-screen max-w-screen-2xl m-auto">
      <!-- Фиксированная боковая панель -->
      <aside
          class="left-0 top-20 bottom-0 min-w-fit max-w-fit bg-white/5 backdrop-blur-lg border-r border-white/10 z-40">
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
              <div
                  class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <!-- Иконка с 3D-эффектом @/assets/images/ -->
              <div
                  class="w-10 h-10 mr-4 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-md shadow-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-400/50 group-hover:-translate-y-1 group-hover:scale-105 z-10">
                <img
                    :src="getImageUrl(topic.image)"
                    class="p-1 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300"
                      alt=""
                >
              </div>
              <span class="text-lg font-medium text-white flex-1 truncate z-10">{{ topic.name }}</span>
              <span
                  class="px-3 py-1 bg-gradient-to-b from-cyan-600/80 to-blue-700/80 text-cyan-100 text-20 rounded-full min-w-max font-medium border border-cyan-400/50 backdrop-blur-sm z-10 transition-all duration-300 group-hover:bg-cyan-500/90 group-hover:border-cyan-300/70">
                {{ topic.posts_count || 0 }}
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
  <!-- Всплывающее окно авторизации -->
<div
  v-if="authStore.showAuthModal"
  class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  @click.self="closeAuthModal"
>
  <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200">
    <!-- Заголовок и кнопка закрытия -->
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold text-gray-800">Авторизация</h3>
      <button
        @click="closeAuthModal"
        class="text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Форма авторизации -->
    <form @submit.prevent="authStore.login()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          v-model="authStore.loginForm.email"
          type="email"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          placeholder="Введите ваш email"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
        <input
          v-model="authStore.loginForm.password"
          type="password"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          placeholder="Введите пароль"
        >
      </div>

      <!-- Сообщения -->
      <div v-if="authStore.loginForm.errors.length>0" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
        <p
            v-for="error in authStore.loginForm.errors"
        >{{ error }}
        </p>

      </div>
      <div v-if="authStore.loginForm.success" class="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
        Успешный вход!
      </div>

      <!-- Кнопка отправки -->
      <button
        type="submit"
        :disabled="authStore.loginForm.loading"
        class="cursor-pointer w-full  py-3 px-4 rounded-lg font-semibold text-gray-900"
      >
        <span v-if="!authStore.loginForm.loading">Войти</span>
        <span v-else class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8a8 8 0 01-8-8z"></path>
          </svg>
          Вход...
        </span>
      </button>
    </form>
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