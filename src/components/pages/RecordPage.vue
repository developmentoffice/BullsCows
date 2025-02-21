<script lang="ts" setup>
import { useGameStore } from '@/store';

const gameStore = useGameStore();
</script>

<template>
    <table class="table">
        <thead>
            <tr>
                <th>Слово</th>
                <th>Попытки</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="record in gameStore.records">
                <td>{{ record.word }}</td>
                <td>{{ record.attempts }}</td>
            </tr>
        </tbody>
    </table>
</template>
