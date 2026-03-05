<script setup>
import {onMounted} from "vue";
import {useTagStore} from "@/store/tagStore.js";

defineOptions({
  name: 'tagsShow'
})

const {getTags, tag} = useTagStore()

onMounted(() => {
  getTags()
})

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

