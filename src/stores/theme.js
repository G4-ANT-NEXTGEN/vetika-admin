import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const isDarkMode = ref(localStorage.getItem('theme') === 'dark')

    const setTheme = (dark) => {
        isDarkMode.value = dark
        localStorage.setItem('theme', dark ? 'dark' : 'light')
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    }

    const toggleTheme = () => {
        setTheme(!isDarkMode.value)
    }

    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (savedTheme) {
            setTheme(savedTheme === 'dark')
        } else if (prefersDark) {
            setTheme(true)
        } else {
            setTheme(false)
        }
    }

    return {
        isDarkMode,
        setTheme,
        toggleTheme,
        initTheme
    }
})
