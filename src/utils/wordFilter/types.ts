export interface CharVariations {
  [key: string]: string[]
}

export interface ResultItem {
  count: number
  score: number
  verses: {
    [verse: string]: VerseEntry
  }
}

export interface VerseEntry {
  suraName: any
  count: number
  verseId: number
  fileName: string
  verseIndex: number
  verseNumberToQuran: number
  verseText: string
}

export interface Results {
  [word: string]: ResultItem
}

export type GroupType = 'exact' | 'attached' | 'root' | 'phonetic' | 'other'

export interface SortedResultItem {
  word: string
  count: number
  score: number
  verses: Record<string, any>
  group: GroupType
}

export interface FormattedResult {
  word: string
  count: number
  verses: {
    fileName: string
    verseIndex: number
    verseNumberToQuran: number
    verseText: string
  }[]
}

export interface FilterResult {
  results: FormattedResult[]
  suggestions?: string[]
}

export interface VerseObject {
  fileName: string
  verseIndex: number
  verseNumberToQuran: number
  verseText: string
} 

export interface FilterOptions {
  removeTashkeel?: boolean
}