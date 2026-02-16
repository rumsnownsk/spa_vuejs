<script setup>
import DeletePost from "@/components/DeletePost.vue";
import EditPost from "@/components/EditPost.vue";
import FavoritePost from "@/components/FavoritePost.vue";
import {ref} from "vue";

const {post} = defineProps({
  post: {
    required: true,
    type: Object
  }
})

// const {isValidated} = defineEmits(['isValidated'])

const postClass =  ref(post.is_favored ? 'border-sky-500' : 'border-gray-200')
</script>

<template>
  <div
      :class="[
      postClass,
       'bg-white w-full border-2 p-4 mb-4 flex items-center justify-between'
       ]">
    <div>
      <h3 class="text-lg text-gray-700">Title: {{ post.title }}</h3>
      <p class="text-sm text-gray-500">Content: {{ post.content }}</p>
    </div>
    <div class="flex items-center">

      <EditPost :post="post"/>
      <DeletePost :post="post"/>
      <FavoritePost :post="post"/>
    </div>
  </div>
</template>

<style scoped>

</style>