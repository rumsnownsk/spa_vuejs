<script setup>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

defineOptions({
  name: 'Show'
})

// const post = reactive({})
// const route = useRoute()
const {getPost, post} = usePostStore()

onMounted(() => {
  getPost()
})



// const getPost = () => {
//   axios.get(`http://localhost:3000/posts/${route.params.id}`)
//       .then(res => {
//         Object.assign(post, res.data) // объекту POST отдай res.data
//         post.value = res.data
//       })
// }
</script>

<template>
  <div>
    <div class="mb-1">
      <h2> SHOW</h2>
    </div>
    <div>
      <div class="w-full border-gray-200 bg-gray-50 text-center">
        <h3 class="mb-4 text-lg">{{post.title}}</h3>
        <p class="text-sm">{{post.content}}</p>
      </div>
    </div>
  </div>
</template>

