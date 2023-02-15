<script lang="ts" setup>
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue'
import { useGameStore } from '@/store';

const route = useRoute();
const gameStore = useGameStore();
gameStore.init();
</script>

<template>
    <main v-if="gameStore.isReady">
        <NavBar :key="route.path" />
        <section class="section">
            <div class="container">
                <router-view :key="$route.path" />
            </div>
        </section>
    </main>
</template>
