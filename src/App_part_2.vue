<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import ClientLayout from "@/layouts/ClientLayout.vue";

defineOptions({
  name: 'App'
})

const router = useRouter()
const route = useRoute()
const isAdmin = ref(false)

router.isReady().then(()=>{
  isAdmin.value = route.name.split('.')[0] === 'admin'
})


</script>

<template>
<div>
    <AdminLayout v-if="isAdmin">
      <router-view />
    </AdminLayout>

    <ClientLayout v-else>
      <router-view />
    </ClientLayout>
</div>
</template>

<style scoped>

</style>
