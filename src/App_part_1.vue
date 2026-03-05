<script setup>

import {computed, provide, reactive, ref, watch} from "vue";
import PostItem from "@/components/PostItem.vue";

// posts - это массив
// обращение всегда через value
const posts = ref([])
const errors = ref([])

// post - это
const post = reactive({
  title: '',
  content: '',
  is_favored: false
})

const favoredPosts = computed(()=>posts.value.filter(item => item.is_favored === true))

provide('posts', posts)
provide('errors', errors)

watch(posts, () => {
  console.log(post)
})

const storePost = () => {

  if (isValidated()) return;

  posts.value.unshift({
    title: post.title,
    content: post.content
  })

  // триггер на перересовку, или Ререндеринг
  Object.assign(post, {
    title: '',
    content: ''
  })
}
const isValidated = ()=>{
  errors.value = []
  if (post.title === '') errors.value.push('field Title is required')
  if (post.content === '') errors.value.push('field Content is required')
  return errors.value.length > 0
}
</script>

<template>
  <div class="w-1/2 mx-auto p-4">
    <div class="bg-white border border-gray-200 p-4">
      <div class="mb-4">
        <input v-model="post.title" type="text" placeholder="title" class="p-4 border border-green-400 w-full">
      </div>
      <div class="mb-4">
        <textarea v-model="post.content" placeholder="content" class="p-4 border border-green-400 w-full"/>
      </div>
      <div v-if="errors.length > 0">
        <div v-for="error in errors" class="text-red-600">{{ error }}</div>
      </div>
      <div class="">
        <a
            @click.prevent="storePost"
            href="#"
            class="inline-block px-3 py-2 bg-sky-600 border border-sky-700 text-white"
        >
          store post
        </a>
      </div>
    </div>
  </div>
  <div v-if="posts.length>0" class="flex">
    <div class="flex flex-col w-1/3 mx-auto ">
      <h3 class="text-center mb-4">Posts</h3>
      <div class="flex flex-col items-center justify-center">
        <PostItem v-for="post in posts" :post="post" />
      </div>
    </div>
    <div class="flex flex-col w-1/3 mx-auto ">
      <h3 class="text-center mb-4">Favorite Posts</h3>
      <div class="flex flex-col items-center justify-center">
        <PostItem v-for="post in favoredPosts" :post="post" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
