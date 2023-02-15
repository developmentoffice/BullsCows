export interface Dict
{
    [key: number]: string[]
}
export interface GameStore
{
    isReady: boolean,
    availableLevels: number[],
    wordsToNextLevel: number,
    level: number,
    records: Record[]
}
export interface Letters
{
    check: number[],
    val: string[]
}
export interface Record
{
    word: string,
    attempts: number
}
