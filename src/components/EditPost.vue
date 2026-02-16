<script setup>
import {inject, reactive, ref} from "vue";
const isModalOpen = ref(false)

const {post} = defineProps({
  post: {
    type: Object,
    required: true
  },

})
const newEditedPost = reactive({
  title: '',
  content: '',
  is_favored: false
})

const posts = inject('posts')
const errors = inject('errors')
// const isValidated = inject('isValidated')

const {isValidated} = defineEmits(['isValidated'])

const editPost = (post)=>{
  Object.assign(newEditedPost, {
    index: posts.value.indexOf(post),
    title: post.title,
    content: post.content
  })
  isModalOpen.value = true
}
const updatePost = ()=>{

  if (isValidated) return;

  Object.assign(posts.value[newEditedPost.index], {
    title: newEditedPost.title,
    content: newEditedPost.content
  })
  isModalOpen.value = false
}


</script>

<template>
  <div>
    <svg @click="editPost(post)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
         stroke="currentColor" class="size-6 text-orange-500 cursor-pointer m-2">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/>
    </svg>
  </div>

  <!--  модальное окно-->
  <div v-if="isModalOpen" @click="isModalOpen=false" class="flex fixed inset-0 bg-black bg-opacity-100 items-center justify-center p-4" >
<!--    <div @click.stop class="modal bg-white border border-gray-400 p-4 max-w-md w-full transform transition-all duration-300 ease-out">-->
    <div @click.stop class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full transform transition-all duration-900 ease-out scale-95">
      <div class="mb-4">
        <input v-model="newEditedPost.title" type="text" name="" placeholder="title"
               class="p-4 border bg-gray-200 w-full">
      </div>
      <div class="mb-4">
        <textarea v-model="newEditedPost.content" type="text" name="" placeholder="any text.."
                  class="p-4 border bg-gray-200 w-full"/>
      </div>
      <div v-if="errors.length > 0">
        <div v-for="error in errors" class="text-red-600">{{ error }}</div>
      </div>
      <div>
        <a @click.prevent="updatePost()" href="#"
           class="inline-block px-3 py-2 bg-sky-600 border border-sky-700 text-white">Update post</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-shadow {
  //width: 100%;
  //height: 100%;
  //position: fixed;
  //top: 0;
  //left: 0;
  //background: rgba(0, 0, 0, 0.8);
  display: flex;
  //align-items: center;
  //justify-content: center;
}

.modal {
  width: 50%;
}
</style>