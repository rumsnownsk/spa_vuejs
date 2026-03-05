import {createRouter, createWebHistory} from "vue-router";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'index',
            component: ()=> import('@/pages/client/index.vue')
        },
        {
            path: '/admin',
            name: 'admin.topics',
            component: ()=> import('@/pages/admin/topics/index.vue')
        },
        {
            path: '/admin/topics/:id',
            name: 'admin.topics.show',
            component: ()=> import('@/pages/admin/topics/show.vue')
        },
        {
            path: '/admin/topics/create',
            name: 'admin.topics.create',
            component: ()=> import('@/pages/admin/topics/create.vue')
        },
        {
            path: '/admin/topics/:id/edit',
            name: 'admin.topics.edit',
            component: ()=> import('@/pages/admin/topics/edit.vue')
        },
        {
            path: '/admin/posts',
            name: 'admin.posts',
            component: ()=>import('@/pages/admin/posts/index.vue')
        },
        {
            path: '/admin/posts/create',
            name: 'admin.posts.create',
            component: ()=>import('@/pages/admin/posts/create.vue')
        },
        {
            // параметризированные роуты должны быть снизу
            path: '/admin/posts/:id',
            name: 'admin.posts.show',
            component: ()=>import('@/pages/admin/posts/show.vue')
        },
        {
            // параметризированные роуты должны быть снизу
            path: '/admin/posts/:id/edit',
            name: 'admin.posts.edit',
            component: ()=>import('@/pages/admin/posts/edit.vue')
        },

        {
            path: '/admin/tags',
            name: 'admin.tags',
            component: ()=>import('@/pages/admin/tags/index.vue')
        },
        {
            path: '/admin/tags/create',
            name: 'admin.tags.create',
            component: ()=>import('@/pages/admin/tags/create.vue')
        },
        {
            // параметризированные роуты должны быть снизу
            path: '/admin/tags/:id',
            name: 'admin.tags.show',
            component: ()=>import('@/pages/admin/tags/show.vue')
        },
        {
            // параметризированные роуты должны быть снизу
            path: '/admin/tags/:id/edit',
            name: 'admin.tags.edit',
            component: ()=>import('@/pages/admin/tags/edit.vue')
        },
    ]

})

export default router