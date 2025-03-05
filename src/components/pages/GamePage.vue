<script lang="ts" setup>
import Keyboard from 'simple-keyboard';
import { ref, onMounted, onBeforeUpdate, nextTick } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useGameStore } from '@/store';

import type { Ref } from 'vue';
import type { Letters } from '@/config/types';
import type { SimpleKeyboard }  from 'simple-keyboard';

let keyboard: SimpleKeyboard;
const gameStore = useGameStore();
const router = useRouter();

const letterRefs: Ref<HTMLInputElement[]> = ref([]);
const skipUnwrap = { letterRefs }
const input: Ref<string[]> = ref([]);
const letters: Ref<Letters[]> = ref([]);
const pos: Ref<number> = ref(0);
const isFull: Ref<boolean> = ref(false);
const isEnd: Ref<boolean> = ref(false);
const leaveTo: Ref<string> = ref('');
const forceRedirect: Ref<boolean> = ref(false);
const word: Ref<string> = ref('');
const warningModal: Ref<boolean> = ref(false);
const usedLetters: Ref<string[]> = ref([]);
const isKeyboardVisible: Ref<boolean> = ref(true);

fillLetters();
word.value = gameStore.getWord();

onMounted(() => {
    letterRefs.value[0].focus();
    keyboard = new Keyboard({
        theme: 'hg-theme-default is-active',
        layout: {
            default: [
                'Й Ц У К Е Н Г Ш Щ З Х',
                'Ф Ы В А П Р О Л Д Ж Э',
                'Я Ч С М И Т Ь Ъ Б Ю Ё',
                '{enter} {bksp}'
            ]
        },
        display: {
            '{enter}': 'Проверить',
            '{bksp}': '⇦'
        },
        onInit: () => {
            updateEnter(true);
        },
        onChange: (str: string) => {
            let char = str;
            if (str.length > 1)
            {
                char = str.substring(str.length - 1);
            }
            letterRefs.value[pos.value].value = char;
            input.value[pos.value] = char;
            keyboard.setInput('');
            letterRefs.value[pos.value].dispatchEvent(new Event('input'));
        },
        onKeyPress: (button: string) => {
            switch (button)
            {
                case '{enter}':
                    submit();
                break;
                case '{bksp}':
                    backspace();
                break;
            }
        }
    });
});
onBeforeUpdate(() => {
    letterRefs.value = [];
});
onBeforeRouteLeave((to) => {
    if (forceRedirect.value || isEnd.value || letters.value.length === 0)
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
function fillLetters(check: number[] = [])
{
    for (let i = 0; i < gameStore.level; i++) {
        if (check[i] && check[i] === 2) {
            input.value[i] = word.value[i];
        } else {
            input.value[i] = '';
        }
    }
}
function setLetter(event: Event, i: number)
{
    input.value[i] = (event.target as HTMLInputElement).value;
    nextLetter();
}
function nextLetter()
{
    let i: number = input.value.indexOf('');

    if (i !== -1)
    {
        setTimeout(() => {
            letterRefs.value[i].focus();
        });
        isFull.value = false;
    }
    else
    {
        isFull.value = true;
        updateEnter(false);
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
        usedLetters.value = [];
        gameStore.save(word.toLowerCase(), attempts);
        hideKeyboard();
    }
    else
    {
        fillLetters(check);
        isFull.value = false;
        nextLetter();
        setTimeout(() => {
            window.scrollTo({
                behavior: 'smooth',
                top: document.body.scrollHeight,
                left: 0
            });
        }, 10);
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
function showKeyboard(n: number)
{
    pos.value = n;
    keyboard?.setOptions({
        theme: 'hg-theme-default is-active'
    });
    usedLetters.value.forEach(letter => {
        const char: HTMLElement | null = document.querySelector('.hg-button[data-skbtn="' + letter.toUpperCase() + '"]');
        if (char) {
            char.classList.add('is-no-letter');
        }
    });
    letters.value.forEach(item => {
        item.val.forEach((letter, i) => {
            const char: HTMLElement | null = document.querySelector('.hg-button[data-skbtn="' + letter.toUpperCase() + '"]');
            let className = null;
            if (item.check[i] === 1) {
                className = 'is-wrong-pos';
            } else if (item.check[i] === 2) {
                className = 'is-right-pos';
            }
            if (char && className) {
                char.classList.add(className);
            }
        });
    });
    updateEnter(true);
    isKeyboardVisible.value = true;
}
function hideKeyboard()
{
    keyboard?.setOptions({
        theme: 'hg-theme-default'
    });
    isKeyboardVisible.value = false;
}
function updateEnter(setClass: boolean)
{
    const enter: HTMLElement | null = document.querySelector('.hg-button[data-skbtn="{enter}"]');
    if (enter) {
        if (setClass) {
            enter.classList.add('is-disabled');
        } else {
            enter.classList.remove('is-disabled');
        }
    }
}
function backspace()
{
    input.value[pos.value] = '';
    if (pos.value > 0) {
        pos.value--;
        setTimeout(() => {
            letterRefs.value[pos.value].focus();
        });
    }
    updateEnter(true);
}
function toggleKeyboard()
{
    hideKeyboard();
}
</script>

<template>
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
                            :class="{ 'is-active': i === pos }"
                            type="text"
                            inputmode="none"
                            maxlength="1"
                            :ref="skipUnwrap.letterRefs"
                            v-model="input[i]"
                            @focus="showKeyboard(i)"
                            @input="setLetter($event, i)"
                            @keyup.delete="backspace"
                        >
                    </td>
                    <td>
                        <button
                            type="submit"
                            class="button is-link is-clickable"
                            :class="{ 'is-active': isFull }"
                        >👉</button>
                    </td>
                </tr>
            </table>
        </form>
    </div>
    <section class="content has-text-centered" v-if="isEnd">
        <button class="button is-large is-link" type="button" @click="newWord">Новое слово</button>
    </section>
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
    <div class="simple-keyboard">
        <div class="simple-keyboard__toggle" @click="hideKeyboard"></div>
    </div>
    <div class="simple-keyboard__toggle simple-keyboard__toggle--open" @click="showKeyboard" v-if="!isKeyboardVisible"></div>
</template>
