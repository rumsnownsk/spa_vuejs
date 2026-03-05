import {defineStore} from "pinia";
import {useRoute} from "vue-router";
import axiosInstance from "@/lib/axios.js";
import router from "@/router/router.js";

export const useTagStore = defineStore(
    'tag',
    {
        state: () => ({
            route: useRoute(),
            tag: {
                id: null,
                name: ''
            },
            tags: [],
            tagTags: {},  // TODO нужно ли?
            selectedTags: [],
            errors: [],
            loading: false,
            messages: []
        }),
        actions: {
            async getTags() {
                try {
                    const {data} = await axiosInstance.get(`/tags`)
                    this.tags = await data.data
                } catch (e) {
                    console.error('Ошибка загрузки постов:', e);
                    this.errors.push('Не удалось загрузить посты')
                }
            },
            async getTag() {
                try {
                    const {data} = await axiosInstance.get(`/tags/${this.route.params.id}`)
                    Object.assign(this.tag, data.data)
                } catch (e) {
                    console.error('Ошибка загрузки Тега: ', e.message);
                    this.errors.push('Тег не найден');
                }
            },
            async storeTag() {
                try {
                    await axiosInstance.post(`/tags`, this.tag)
                    await this.getTags()
                    this.messages.push('Tag successful created')
                } catch (error) {
                    console.error('Ошибка создания Тега:', error)
                    if (error.response?.status === 422) {
                        this.errors = error.response.data.errors
                    } else {
                        this.errors.push('Произошла ошибка при создании Тега');
                    }
                } finally {
                    this.resetTag()
                }

            },
            async updateTag() {
                try {
                    await axiosInstance.put(`/tags/${this.route.params.id}`, this.tag)
                    await this.getTags()
                    this.messages.push('Тег был успешно обновлён')

                } catch (error) {
                    console.error('Ошибка создания темы:', error);
                    if (error.response?.status === 422) {
                        this.errors = error.response.data.errors;
                    } else {
                        this.errors.push('Произошла ошибка при создании темы');
                    }
                } finally {
                    this.resetTag()
                    await router.push('/admin/tags')
                }
            },
            async deleteTag(id) {
                try {
                    await axiosInstance.delete(`/tags/${id}`)
                    await this.getTags()
                    this.messages.push('Тег успешно удален');
                    this.errors = [];
                } catch (error) {
                    console.error('Ошибка удаления:', error)
                    this.errors.push('Ошибка при удалении Тега')
                }

            },

            // TODO надо ли это??
            async loadTagsByTopic(tagId) {
                this.loading = true
                this.errors = null
                try {
                    await axiosInstance.get(`/tags/${tagId}/tags`)
                        .then((res) => {
                            this.tags = res.data.tags
                            // console.log(res.data)
                            // this.tags = res.data
                            // console.log('array tags: '+this.tags)
                        })
                } catch (e) {
                    this.errors = 'Ошибка загрузки тегов'
                    console.error('API error:', e)
                    throw e
                } finally {
                    this.loading = false
                }
            },
            resetTag() {
                Object.assign(this.tag, {id: null, name: ''})
            }
        },
        getters: {
            // TODO надо ли это??
            // getTagsForTopic: (state) => (tagId) => state.tags[tagId] || []
        }
    }
)