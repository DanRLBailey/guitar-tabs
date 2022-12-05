export interface Song {
  Link: string;
  Chords: string[];
  StrummingPattern: StrummingPattern;
  Capo: number;
  Parts: SongSection[];
}

export interface StrummingPattern {
  Bpm: number;
  Beats: number;
  Pattern: string;
}

export interface SongSection {
  Section: string;
  Lines: [];
}

export interface Chords {
  [key: string]: Chord[]
}

export interface Chord {
  Key: string,
  Suffix: string,
  Positions: Position[]
}

export interface Position {
  Frets: number[]
  Fingers: number[]
  BaseFret: number
  Barres: number[]
}