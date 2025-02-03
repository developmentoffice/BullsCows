import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, Router } from 'vue-router'

import GamePage from '@/components/pages/GamePage.vue'
import LevelPage from '@/components/pages/LevelPage.vue'
import RecordPage from '@/components/pages/RecordPage.vue'
import NotFoundPage from '@/components/pages/NotFoundPage.vue'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'game',
        component: GamePage,
        meta: {
            title: 'Игра'
        }
    },
    {
        path: '/level',
        name: 'level',
        component: LevelPage,
        meta: {
            title: 'Уровень'
        }
    },
    {
        path: '/record',
        name: 'record',
        component: RecordPage,
        meta: {
            title: 'Рекорды'
        }
    },
    {
        path: '/:pathMatch(.*)',
        component: NotFoundPage
    }
]

const router: Router = createRouter({
    history: createWebHistory(process.env.NODE_ENV === 'production' ? '/BC/' : '/'),
    linkExactActiveClass: 'is-active',
    routes
})

router.beforeEach((to, from) => {
    if (to.meta.title && typeof to.meta.title === 'string') {
        document.title = to.meta.title
    } else  {
        document.title = 'Быки и Коровы'
    }
})

export default router
