<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";
import {useRoute, useRouter} from "vue-router";
import {computed, ref, provide, onMounted, watch} from "vue";
import ClientLayout from "@/layouts/ClientLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

defineOptions({
  name: 'App'
})

const router = useRouter()
const route = useRoute()
const isAdmin = ref(false)
const prefixAdmin = ref(false)

// router.isReady().then(() => {
//   isAdmin.value = route.name.split('.')[0] === 'admin'
// })


onMounted(() => {
  watch(
    () => router.currentRoute.value.name,
    (name) => {
      if (!name) {
        prefixAdmin.value = false
        return
      }
      prefixAdmin.value = name.split('.')[0] === 'admin'
    },
    { immediate: true }
  )
})

provide('prefixAdmin', prefixAdmin)

</script>

<template>
  <div>
    <AdminLayout v-if="prefixAdmin">
      <router-view/>
    </AdminLayout>

    <ClientLayout v-else>
      <router-view/>
    </ClientLayout>
  </div>
</template>

<style scoped>

</style>

// TODO запись даты в unix time
