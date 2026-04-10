<script setup>
import {useTopicStore} from "@/store/topicStore.js";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {usePostStore} from "@/store/postStore.js";
import {useAuthStore} from "@/store/authStore.js";

defineOptions({
  name: 'ClientLayout'
})

const topicStore = useTopicStore()
const authStore = useAuthStore()

// Реф для хедера
const headerRef = ref(null)

// Рефы для управления боковой панелью
const mobileAside = ref(null)
const asideToggle = ref(null)

// Состояние видимости панели
const isAsideVisible = ref(false)
let hideTimeout = null

// Функция обновления высоты хедера
const updateHeaderHeight = () => {
  if (headerRef.value) {
    const height = headerRef.value.offsetHeight
    document.documentElement.style.setProperty('--header-height', `${height}px`)
  }
}

// Функции управления видимостью панели
const showAside = () => {
  isAsideVisible.value = true
  clearTimeout(hideTimeout)
}
const hideAside = () => {
  isAsideVisible.value = false
}
const toggleAside = () => {
  if (isAsideVisible.value) {
    hideAside()
  } else {
    showAside()
  }
}
// Запуск таймера автоскрытия
const startAutoHide = () => {
  hideTimeout = setTimeout(hideAside, 5000)
}
// Проверка размера экрана
const isMobile = ref(window.innerWidth <= 768)
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
  // На больших экранах панель всегда видна
  if (!isMobile.value) {
    isAsideVisible.value = true
  }
}


onMounted(async () => {
  await topicStore.init()
  await topicStore.getTopics()
  await authStore.restoreAuth()

  // Затем настраиваем отслеживание высоты хедера
  updateHeaderHeight()
  window.addEventListener('resize', updateHeaderHeight)

  // Инициализация логики боковой панели
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)

// Запуск автоскрытия при наведении
  if (mobileAside.value) {
    mobileAside.value.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout)
    })
    mobileAside.value.addEventListener('mouseleave', startAutoHide)
  }

// Закрытие при клике вне панели
  document.addEventListener('click', (e) => {
    if (
        mobileAside.value &&
        !mobileAside.value.contains(e.target) &&
        asideToggle.value &&
        !asideToggle.value.contains(e.target)
    ) {
      hideAside()
    }
  })
})


onUnmounted(() => {
  window.removeEventListener('resize', updateHeaderHeight)
  window.removeEventListener('resize', checkScreenSize)
  clearTimeout(hideTimeout)
})

const selectTopic = async (topic) => {
  if (topicStore.topic.id === topic.id){
    topicStore.resetTopic()
    return;
  }
  await topicStore.setSelectedTopic(topic)
}

// Вычисляемое свойство для отслеживания статуса авторизации
const isLoggedIn = computed(() => authStore.isAuthenticated)

const openModalWindow = () => {
  if (!isLoggedIn.value) {
    authStore.showAuthModal = true
  }

}
const closeAuthModal = () => {
  authStore.showAuthModal = false
}

const getImageUrl = (topicImage) => {
  return topicImage ? new URL(`/src/assets/images/${topicImage}`, import.meta.url).href : ''
}

// Наблюдатель за изменением видимости панели
watch(isAsideVisible, (newVal) => {
  if (newVal && isMobile.value) {
    startAutoHide()
  } else {
    clearTimeout(hideTimeout)
  }
})
</script>

<template>
  <div
      class="flex flex-col h-screen overflow-hidden sm:w-auto max-w-screen-2xl mx-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
    <!--      <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 max-w-full">-->
    <!-- Фиксированный хедер -->
    <header ref="headerRef"
            class="flex-shrink-0 m-auto max-w-screen-2xl fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-b border-white/20 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-cyan-300 uppercase text-3xl font-bold text-center cursor-effect leading-none relative flex items-end dishes">
          find or fail <span class="cursor-bar">|</span>
        </h1>
        <div class="mx-5 text-center">
          <p class="text-cyan-300 text-xl">
            Быстрый поиск команды для консольной строки по ключевым обрывкам памяти
          </p>

        </div>
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
              class="cursor-pointer w-max px-4 h-12 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-center"
          >
            <p class="font-medium flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 01-7 7 7 7 0 0114 0 7 7 0 01-7-7z"/>
              </svg>

              <span class="max-md:hidden">Logged in</span>
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
      <div
          class="relative right-0 sm:right-0 top-5 z-50 w-full px-2 bg-yellow-400/90 backdrop-blur-md rotate-1 text-white text-base sm:text-xl h-auto flex items-center justify-center border-t border-orange-400/50 shadow-2xl shadow-orange-500/40 origin-bottom-right transition-all duration-400 cursor-default overflow-hidden">
        <div class="whitespace-nowrap">
    <span class="animate-marquee inline-flex text-gray-900">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
           class="size-6 mr-2" transform="scale(-1, 1)">
        <path stroke-linecap="round" stroke-linejoin="round"
        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
      </svg>

      Сырой проект — идут доработки, наполняется функционал
    </span>
        </div>
      </div>

    </header>


    <!-- Основной макет -->
    <section class="w-full min-h-screen mx-auto flex flex-col sm:flex-row main-layout relative">

      <!-- Кнопка для открытия панели (видима только на мобильных) -->
      <button
          ref="asideToggle"
          @click="toggleAside"
          class="fixed h-30 w-1/6 text-3xl right-0 top-1/2 -translate-y-1/2 z-50 bg-blue-600 text-white px-2 py-4 rounded-l-lg hover:bg-blue-700 transition-colors duration-300 lg:hidden"
      >
        ☰
      </button>

      <!-- Фиксированная боковая панель -->
      <aside
          ref="mobileAside"
          :class="[
    'fixed left-0 backdrop-blur-2xl! border-r border-white/10 z-40 transition-all duration-300 ease-in-out',
    !isAsideVisible && isMobile ? 'left-[-50%] max-h-max' : 'left-0  max-h-max w-2/3',
    !isMobile ? 'relative left-0 w-64 max-w-none mb-0 border-r' : ''
  ]">
        <div class="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
          <div class="px-4 py-3 border-b border-white/20">
            <h3 class="text-lg font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-cyan-500">
              Выбрать тему
            </h3>
          </div>
          <nav class="flex flex-col space-y-2">
            <!-- Элементы меню -->
            <a v-for="topic in topicStore.topics"
               :key="topic.id"
               @click.prevent="selectTopic(topic)"
               :class="[
             'flex items-center cursor-pointer py-3 text-blue-200 border-l-4 border-transparent transition-all duration-300 transform-gpu group relative p-3',
             topicStore.topic.id === topic.id
               ? 'bg-blue-800/60 border-blue-400 text-white shadow-lg shadow-blue-500/20'
               : 'hover:bg-blue-900/30 hover:border-blue-400'
           ]">
              <div
                  class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div
                  class="w-8 h-8 mr-3 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-md shadow-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-400/50 group-hover:-translate-y-1 group-hover:scale-105 z-10">
                <img :src="getImageUrl(topic.image)"
                     class="p-1 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300" alt="">
              </div>
              <span class="text-xl font-medium text-white flex-1 truncate z-10">{{ topic.name }}</span>
              <span
                  class="px-4 py-2 bg-gradient-to-b from-cyan-600/80 to-blue-700/80 text-cyan-100 text-base rounded-full min-w-max font-medium border border-cyan-400/50 backdrop-blur-sm z-10 transition-all duration-300 group-hover:bg-cyan-500/90 group-hover:border-cyan-300/70">
            {{ topic.posts_count || 0 }}
          </span>
            </a>
          </nav>
        </div>
      </aside>
      <div class="w-full flex-1">


        <slot/>

      </div>
    </section>
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
        <div v-if="authStore.loginForm.errors.length>0"
             class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <p
              v-for="error in authStore.loginForm.errors"
          >{{ error }}
          </p>

        </div>
        <div v-if="authStore.loginForm.success"
             class="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
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
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24">
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
/* Скрываем кнопку на больших экранах */
#asideToggle {
  display: none;
}

@media (max-width: 425px) {
  #asideToggle {
    display: block;
  }
}

/* Стили для скроллбара (если нужно) */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-blue-600::-webkit-scrollbar-thumb {
  background-color: #3B82F6;
}

.scrollbar-track-blue-100::-webkit-scrollbar-track {
  background: #F0F9FF;
}

.main-layout {
  padding-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
}

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

/* Градиенты */
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-b {
  background: linear-gradient(to bottom, var(--tw-gradient-stops));
}

.cursor-bar {
  margin-left: 3px;
  color: #22d3ee;
  font-weight: bold;
  line-height: 1em; /* наследуем line-height от h1 */
  font-size: inherit; /* наследуем font-size от h1 */
  animation: blink-cursor 2.0s step-start infinite; /* анимация мигания */
  vertical-align: text-bottom; /* выравнивание по нижнему краю текста */
  display: inline-block; /* для корректной работы vertical-align */
}

@keyframes blink-cursor {
  0%, 50% {
    opacity: 1; /* курсор виден */
  }
  51%, 100% {
    opacity: 0; /* курсор скрыт */
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  animation: marquee 20s linear infinite;
  white-space: nowrap;
}
</style>