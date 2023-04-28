export interface Song {
  Link: string
  Chords: string[]
  StrummingPattern?: StrummingPattern
  Capo?: number
  Parts: SongSection[]
  SimpleParts: SongSection[]
  Timings?: number[]
  Tabs?: Tab
}

export interface StrummingPattern {
  Bpm: number
  Beats: number
  Pattern: string
}

export interface SongSection {
  Section: string
  Lines: []
}

export interface Tab {
  [key: string]: TabItem[]
}

export interface TabItem {
  Beat: number
  Notes: string[]
  Chord: string
}

export interface Chords {
  [key: string]: Chord[]
}

export interface Chord {
  Key: string
  Suffix: string
  Positions: Position[]
}

export interface Position {
  Frets: number[]
  Fingers: number[]
  BaseFret: number
  Barres: number[]
}

export interface SongMeta {
  [key: string]: SongMetaDetails
}

export interface SongMetaDetails {
  Name: string
  Artist: string
}