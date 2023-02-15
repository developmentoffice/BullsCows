<script lang="ts" setup>
import { ref } from 'vue';

import type { Ref } from 'vue';

const toggleMobileNav: Ref<boolean> = ref(false);
</script>

<template>
    <nav class="navbar is-fixed-top is-link">
        <div class="navbar-brand">
            <router-link class="navbar-item" exact-active-class="" to="/">
                <img src="~@/images/logo.svg" alt="">
            </router-link>
            <a
                class="navbar-burger"
                :class="{ 'is-active': toggleMobileNav }"
                @click.prevent="toggleMobileNav = !toggleMobileNav"
                href="#"
            >
                <span></span>
                <span></span>
                <span></span>
            </a>
        </div>
        <div
            class="navbar-menu"
            :class="{ 'is-active': toggleMobileNav }"
        >
            <div class="navbar-start">
                <router-link class="navbar-item" to="/">
                    Игра
                </router-link>
                <router-link class="navbar-item" to="/level">
                    Уровень
                </router-link>
                <router-link class="navbar-item" to="/record">
                    Рекорды
                </router-link>
            </div>
        </div>
    </nav>
</template>
