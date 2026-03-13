import {defineStore} from "pinia";
import {useRouter} from "vue-router";
import axiosInstance from "@/lib/axios.js";
import router from "@/router/router.js";

export const useTopicStore = defineStore(
    'topic',
    {
        state: () => ({
            route: null,
            topic: {
                id: null,
                name: '',
                slug: '',
                description: ''
            },
            topics: [],
            // selectedTopic: {},
            errors: [],
            messages: []
        }),
        getters: {
            countTopics: (state) => state.topics?.length ?? 0,
            hasErrors: (state) => state.errors.length > 0
        },
        actions: {
            async init() {
                const router = useRouter() // Получаем роутер
                this.route = router.currentRoute // Устанавливаем текущий маршрут
            },
            async getTopic() {
                try {
                    const {data} = await axiosInstance.get(`/topics/${this.route.params.id}`)
                    Object.assign(this.topic, data.data)
                } catch (e) {
                    console.error('Ошибка загрузки темЫ', e);
                    this.errors.push('Тема не найдена');
                }

            },
            async getTopics() {
                try {
                    const {data} = await axiosInstance.get(`/topics`)
                    // Полностью заменяем массив topics
                    this.topics = [...data.data];
                    this.errors = []; // Очищаем ошибки при успешной загрузке
                } catch (e) {
                    console.error('Ошибка загрузки тем:', e);
                    this.errors.push('Не удалось загрузить темы')
                }
            },
            async storeTopic() {
                try {
                    await axiosInstance.post(`/topics`, this.topic)
                    await this.getTopics()
                    this.messages.push('Тема успешно создана')
                } catch (error) {
                    console.error('Ошибка создания темы:', error);
                    if (error.response?.status === 422) {
                        this.errors = error.response.data.errors;
                    } else {
                    }
                } finally {
                    this.resetTopic()
                }
            },
            async updateTopic() {
                // console.log('this.route.params.slug', this.route.params.id)
                // console.log('this.topic', this.topic)
                try {
                    await axiosInstance.put(`/topics/${this.route.params.id}`, this.topic)
                    await this.getTopics()
                    this.resetTopic()
                    await router.push('/admin')
                    this.messages.push('Тема успешно обновлена');
                } catch (error) {
                    console.error('Update failed:', error);
                    if (error.response?.status === 404) {
                        this.error = 'Тема не найдена';
                    } else if (error.response?.status === 422) {
                        this.errors = error.response.data.errors;
                    } else {
                        this.error = 'Произошла ошибка при обновлении темы';
                    }
                }
            },
            async deleteTopic(id) {
                try {
                    await axiosInstance.delete(`/topics/${id}`)
                    await this.getTopics()
                    this.messages.push('Тема успешно удалена');
                    this.errors = [];
                } catch (error) {
                    console.error('Ошибка удаления:', error)
                    this.errors.push('Ошибка при удалении темы')
                }
            },
            setSelectedTopic(topic) {
                if (!topic) {
                    console.warn('Attempt to set null/undefined topic')
                    this.topic = {id: null, name: '', description: ''}
                    return
                }

                this.topic = {
                    id: topic.id ?? this.topic.id,
                    name: topic.name ?? this.topic.name,
                    description: topic.description ?? this.topic.description
                }
                // console.log(this.topic)
                // this.selectedTopicId = topic.id // ✅ Изменяем состояние внутри хранилища
            },
            resetTopic() {
                Object.assign(this.topic, {
                    id: null,
                    name: '',
                    slug: '',
                    description: ''
                })
            }
        }
    }
)