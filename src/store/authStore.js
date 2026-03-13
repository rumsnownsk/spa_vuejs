import {defineStore} from "pinia";
import axiosInstance from "@/lib/axios.js";

export const useAuthStore = defineStore(
    'auth',
    {
        state: () => ({
            user: {
                id: '',
                name: '',
                email: '',
                role: ''
            },
            isLoggedIn: false,
            loading: false,
            errors: [],
            messages: [],
            token: '',
            loginForm: {
                email: '',
                password: '',
                errors: [],
                success: false
            },
            showAuthModal: false
        }),

        getters: {
            // Геттер для проверки авторизации
            isAuthenticated: (state) => state.isLoggedIn,

            // Геттер для получения данных пользователя
            getUser: (state) => state.user,

            // Геттер для проверки роли пользователя
            hasRole: (state) => (role) => state.user.role === role
        },
        actions: {
            async restoreAuth() {
                const savedToken = localStorage.getItem('auth_token')
                if (!savedToken) return false;
                try {
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
                    const userResponse = await axiosInstance.get(`user`)
                    this.user = userResponse.data
                    this.isLoggedIn = true

                    this.token = savedToken
                    return true
                } catch (error) {
                    console.error('Ошибка восстановления авторизации:', error);
                    await this.logout();
                    return false;
                }
            },
            async login() {

                await axiosInstance.get(`sanctum/csrf-cookie`, {
                    baseURL: import.meta.env.VITE_API_BASE_URL, // Исправлена опечатка
                    withCredentials: true,
                    // withXSRFToken: true,
                    xsrfCookieName: 'XSRF-TOKEN',
                    xsrfHeaderName: 'X-XSRF-TOKEN'
                })
                try {
                    // отправляем логин и пароль на сервер
                    const loginResponse = await axiosInstance.post(`/login`, {
                        email: this.loginForm.email,
                        password: this.loginForm.password
                    })

                    if (!loginResponse.data.token) {
                        throw new Error('Сервер не вернул токен авторизации')
                    }
                    this.loginForm.success = true

                    // Закрываем окно через 1,5 секунды
                    setTimeout(() => {
                        this.showAuthModal = false
                        // Очищаем состояние формы после закрытия
                        this.$patch({
                            loginForm: {
                                email: '',
                                password: '',
                                errors: [],
                                success: false
                            }
                        })
                    }, 1500)
                    // сохраняем токен в хранилище localStorage
                    const token = loginResponse.data.token
                    this.token = token
                    localStorage.setItem('auth_token', token)

                    // Настраиваем заголовок Authorization для всех последующих запросов
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

                    // запрашиваем Юзера по токену
                    const userResponse = await axiosInstance.get('user')
                    this.isLoggedIn = true
                    this.user = userResponse.data
                    this.messages.push('Успешный вход в систему');

                } catch (error) {
                    console.error('Ошибка авторизации:', error.messages);

                    const errorMessage = error.response?.data?.message ||
                        error.response?.statusText ||
                        'Ошибка авторизации';
                    this.errors.push(errorMessage);
                    throw error;
                }
            },
            async logout() {
                try {
                    await axiosInstance.post('/logout')
                    this.resetState()
                    localStorage.removeItem('auth_token')
                    delete axiosInstance.defaults.headers.common['Authorization'];
                } catch (error) {
                    console.error('ошибка выхода', error.messages)
                    this.errors.push('ошибка при logout')
                }

            },
            resetState() {
                this.user = {id: '', name: '', email: '', role: ''}
                this.isLoggedIn = false
                this.errors = [];
                this.messages = [];
                this.token = null;
            }
        }
    }
)