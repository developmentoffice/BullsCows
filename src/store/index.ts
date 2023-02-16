import { defineStore } from 'pinia';
import words from '@/config/dict';

import type { GameStore, Record } from '@/config/types';

const LOCAL_STORAGE_VAR = '_bullscows_settings';

export const useGameStore = defineStore('gameStore', {
    state: (): GameStore => ({
        isReady: false,
        availableLevels: Object.keys(words).map(el => parseInt(el)),
        wordsToNextLevel: 5,
        level: 5,
        records: []
    }),
    actions: {
        init()
        {
            if (window.localStorage)
            {
                if (window.localStorage.getItem(LOCAL_STORAGE_VAR))
                {
                    let settings = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_VAR) || '');
                    this.level = settings.level;
                    this.records = settings.records;
                    this.sortRecords();
                }
                else
                {
                    this.updateStorage();
                }
            }
            this.isReady = true;
        },
        sortRecords()
        {
            this.records = this.records.sort((a: Record, b: Record): number => a.attempts - b.attempts);
        },
        updateStorage()
        {
            if (window.localStorage)
            {
                let settings = {
                    level: this.level,
                    records: this.records
                }
                window.localStorage.setItem(LOCAL_STORAGE_VAR, JSON.stringify(settings));
            }
        },
        getWord(): string
        {
            let passedWords: string[] = this.records.map(el => el.word);
            let excludedWords = words[this.level].filter((word: string) => passedWords.indexOf(word) === -1);
            let max: number = excludedWords.length;
            let i: number = Math.floor(Math.random() * max) - 1;
            return excludedWords[i];
        },
        save(word: string, attempts: number)
        {
            this.records.push({
                word,
                attempts
            });
            this.sortRecords();
            this.updateStorage();
        },
        setLevel(level: number)
        {
            this.level = level;
            this.updateStorage();
        }
    }
});
