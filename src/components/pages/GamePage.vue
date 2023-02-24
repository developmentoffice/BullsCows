<script lang="ts" setup>
import { ref, onMounted, onBeforeUpdate, nextTick } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useGameStore } from '@/store';

import type { Ref } from 'vue';
import type { Letters } from '@/config/types';

const gameStore = useGameStore();
const router = useRouter();

const letterRefs: Ref<HTMLInputElement[]> = ref([]);
const skipUnwrap = { letterRefs }
const input: Ref<string[]> = ref([]);
const letters: Ref<Letters[]> = ref([]);
const isFull: Ref<boolean> = ref(false);
const isEnd: Ref<boolean> = ref(false);
const leaveTo: Ref<string> = ref('');
const forceRedirect: Ref<boolean> = ref(false);
const word: Ref<string> = ref('');
const warningModal: Ref<boolean> = ref(false);
const usedLetters: Ref<string[]> = ref([]);

fillLetters();
word.value = gameStore.getWord();

onMounted(() => {
    letterRefs.value[0].focus();
});
onBeforeUpdate(() => {
    letterRefs.value = [];
});
onBeforeRouteLeave((to, from) => {
    if (forceRedirect.value || isEnd.value)
    {
        return true;
    }
    else
    {
        leaveTo.value = to.path;
        warningModal.value = true;
        return false;
    }
});

function range(n: number)
{
    let arr = [];
    for (let i = 0; i < n; i++)
    {
        arr.push(i);
    }
    return arr;
}
function fillLetters()
{
    for (let i = 0; i < gameStore.level; i++) {
        input.value[i] = '';
    }
}
function setLetterRef(el: HTMLInputElement)
{
    if (letterRefs.value.length >= gameStore.level) return undefined;
    if (el)
    {
        letterRefs.value.push(el);
        return ref(el);
    }
}
function setLetter(event: Event, i: number)
{
    input.value[i] = (event.target as HTMLInputElement).value;
}
function nextLetter()
{
    let i: number = input.value.indexOf('');

    if (i !== -1)
    {
        letterRefs.value[i].focus();
        isFull.value = false;
    }
    else
    {
        isFull.value = true;
    }
}
function submit()
{
    if (!isFull.value) return;
    const i = letters.value.length;
    let check: number[] = [];
    let wordArr: string[] = word.value.split('');

    isEnd.value = true;
    input.value.forEach((inp, j) => {
        inp = inp.toLowerCase();
        if (inp === wordArr[j] || (wordArr[j] === 'ё' && inp.charCodeAt(0) === 235))
        {
            check.push(2);
        }
        else if (wordArr.indexOf(inp) !== -1 || (wordArr.indexOf('ё') !== -1 && inp.charCodeAt(0) === 235))
        {
            check.push(1);
        }
        else
        {
            appendUsedLetters(inp)
            check.push(0);
        }
        if (inp !== word.value[j])
        {
            isEnd.value = false;
        }
    });
    letters.value[i] = {
        check,
        val: [...input.value]
    };
    if (isEnd.value)
    {
        let word: string = input.value.join('');
        let attempts: number = letters.value.length;
        input.value = [];
        gameStore.save(word, attempts);
    }
    else
    {
        fillLetters();
        isFull.value = false;
        letterRefs.value[0].focus();
    }
}
async function newWord()
{
    letters.value = [];
    word.value = gameStore.getWord();
    fillLetters();
    isFull.value = false;
    isEnd.value = false;
    await nextTick();
    letterRefs.value[0].focus();
}
function warningModalOk()
{
    forceRedirect.value = true;
    router.push(leaveTo.value);
}
function warningModalCancel()
{
    forceRedirect.value = false;
    leaveTo.value = '';
    warningModal.value = false;
}
function appendUsedLetters(letter: string)
{
    const collator = new Intl.Collator();
    letter = letter.toUpperCase();
    if (usedLetters.value.indexOf(letter) === -1)
    {
        usedLetters.value.push(letter);
        usedLetters.value.sort((a, b) => collator.compare(a, b));
    }
}
</script>

<template>
    <section class="content has-text-centered" v-if="isEnd">
        <button class="button is-large is-link" type="button" @click="newWord">Новое слово</button>
    </section>
    <nav class="panel" v-if="usedLetters.length > 0">
        <p class="panel-heading">Отсутствующие буквы</p>
        <div class="panel-block">
            <div class="is-flex is-flex-wrap-wrap">
                <div class="mr-2 mb-2 is-size-4 has-text-weight-bold" v-for="letter in usedLetters">{{ letter }}</div>
            </div>
        </div>
    </nav>
    <div class="table-container">
        <form @submit.prevent="submit">
            <table class="table is-bordered is-fullwidth game-table">
                <tr v-for="(row, n) in letters">
                    <td>{{ n + 1 }}</td>
                    <td
                        class="letter"
                        :class="{
                            'letter--bulls':  row.check[i] === 2,
                            'letter--cows': row.check[i] === 1
                        }"
                        v-for="(letter, i) in row.val"
                    >
                        {{ letter }}
                    </td>
                    <td></td>
                </tr>
                <tr v-if="!isEnd">
                    <td></td>
                    <td v-for="i in range(gameStore.level)">
                        <input
                            class="input is-large"
                            type="text"
                            maxlength="1"
                            :ref="skipUnwrap.letterRefs"
                            v-model="input[i]"
                            @keyup="nextLetter"
                            @input="setLetter($event, i)"
                        >
                    </td>
                    <td>
                        <button
                            type="submit"
                            class="button is-link"
                            :class="{ 'is-active': isFull }"
                        >👉</button>
                    </td>
                </tr>
            </table>
        </form>
    </div>
    <div
        class="modal"
        :class="{ 'is-active': warningModal }"
    >
        <div class="modal-background" @click="warningModalCancel"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Завершить игру досрочно?</p>
                <button class="delete" aria-label="close" @click="warningModalCancel"></button>
            </header>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="warningModalOk">Да</button>
                <button class="button" @click="warningModalCancel">Нет</button>
            </footer>
        </div>
    </div>
</template>
