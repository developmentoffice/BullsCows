<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/store';
import { plural } from '@/helpers';

import type { Ref } from 'vue';

const gameStore = useGameStore();
const router = useRouter();

function wordsCount(n: number): number
{
    return n * gameStore.wordsToNextLevel - gameStore.records.length;
}
function setLevel(n: number)
{
    if (gameStore.records.length < n * gameStore.wordsToNextLevel) return;
    const level = gameStore.availableLevels[n];
    gameStore.setLevel(level);
    router.push('/');
}
</script>

<template>
    <ul class="menu-list records-list">
        <li v-for="(level, i) in gameStore.availableLevels">
            <a
                :class="{
                    'is-active': level === gameStore.level,
                    'is-disabled': wordsCount(i) > 0
                }"
                @click.prevent="setLevel(i)"
                href="#"
            >
                Уровень <strong>{{ level }}</strong>
                <template v-if="wordsCount(i) > 0">
                    <br>
                    <small>Ещё {{ wordsCount(i) }} {{ plural(wordsCount(i), ['слово', 'слова', 'слов']) }}</small>
                </template>
            </a>
        </li>
    </ul>
</template>

<style>
.records-list
{
    li
    {
        & > a
        {
            &.is-active
            {
                pointer-events: none;
            }
            &.is-disabled
            {
                opacity: 0.7;
                pointer-events: none;
            }
        }
    }
}
</style>
