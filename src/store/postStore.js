import {defineStore} from "pinia";
import {useRoute} from "vue-router";
import axiosInstance from "@/lib/axios.js";
import router from "@/router/router.js";

export const usePostStore = defineStore(
    'post',
    {
        state: () => ({
            route: useRoute(),
            post: {
                id: null,
                title: '',
                body: '',
                description:'',
                slug: '',
                topic_id: '',
                tag_ids: []
            },
            posts: [],
            errors: [],
            messages: []
        }),
        getters: {},
        actions: {
            async getPosts(topic = null, tags = []) {
                try {
                    const config = {
                        params: {
                            tags: tags.length > 0 ? tags : undefined,
                            topic: topic ? topic : undefined
                        },
                        paramsSerializer: (params) => {
                            const result = new URLSearchParams()
                            if (params.tags) {
                                params.tags.forEach(tag => result.append('tags[]', tag))
                            }
                            if (params.topic) {
                                result.set('topic', params.topic)
                            }
                            return result.toString()
                        }
                    }
                    const {data} = await axiosInstance.get(`/posts`, config)
                    this.posts = await data.data
                } catch (e) {
                    console.error('Ошибка загрузки постов:', e);
                    this.errors.push('Не удалось загрузить посты')
                }
            },
            async getPost() {
                const {data} = await axiosInstance.get(`/posts/${this.route.params.id}`)
                Object.assign(this.post, data.data)
            },

            async storePost(postData) {
                console.log(postData)
                try {
                    await axiosInstance.post(`/posts`, postData)
                    await this.getPosts()
                    this.messages.push('Topic successful created')
                } catch (error) {
                    console.error('Ошибка создания Поста:', error)
                    if (error.response?.status === 422) {
                        this.errors = error.response.data.errors
                    } else {
                        this.errors.push('Произошла ошибка при создании темы');
                    }
                } finally {
                    this.resetPost()
                }
            },
            async updateTopic(postData) {
                try {
                    await axiosInstance.put(`/posts/${this.route.params.id}`, postData)
                    await this.getPosts()
                    this.resetPost()
                    await router.push('/admin/posts')
                    this.messages.push('Post успешно обновлен');
                } catch (error) {
                    console.error('Update failed:', error);
                    if (error.response?.status === 404) {
                        this.error = 'Пост не найден';
                    } else if (error.response?.status === 422) {
                        this.errors = error.response.data.errors;
                    } else {
                        this.error = 'Произошла ошибка при обновлении Поста';
                    }
                }
            },
            async deletePost(id) {
                try {
                    await axiosInstance.delete(`/posts/${id}`)
                    await this.getPosts()
                    this.messages.push('POST успешно удалён');
                    this.errors = [];
                } catch (error) {
                    console.error('Ошибка удаления:', error)
                    this.errors.push('Ошибка при удалении Поста')
                }
            },
            resetPost() {
                Object.assign(this.post, {
                    id: null,
                    title: '',
                    body: '',
                    slug: '',
                    category: ''
                })
            }
        }
    }
)