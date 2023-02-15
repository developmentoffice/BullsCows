<script lang="ts" setup>
import { useGameStore } from '@/store';

const gameStore = useGameStore();
</script>

<template>
    <table class="table">
        <thead>
            <th>Слово</th>
            <th>Попытки</th>
        </thead>
        <tbody>
            <tr v-for="record in gameStore.records">
                <td>{{ record.word }}</td>
                <td>{{ record.attempts }}</td>
            </tr>
        </tbody>
    </table>
</template>
