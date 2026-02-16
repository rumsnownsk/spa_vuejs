<script setup>

import {provide, reactive, ref, watch} from "vue";
import PostItem from "@/components/PostItem.vue";

// posts - это массив
// обращение всегда через value
const posts = ref([])

// post - это
const post = reactive({
  title: '',
  content: '',
  is_favored: false
})


provide('posts', posts)

watch(posts, () => {
  console.log(posts)
})

const storePost = () => {
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
  <div v-if="posts.length>0">
    <div class="flex flex-col w-2/3 mx-auto ">
      <h3 class="text-center mb-4">Posts</h3>
      <div class="flex flex-col items-center justify-center">
        <PostItem v-for="post in posts" :post="post" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
