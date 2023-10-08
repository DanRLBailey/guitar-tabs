import chords from "../public/chords/chords.json";
import { Chords } from "../types/interfaces";

export function determineType(chord: string) {
  const keys = Object.keys(chords);
  const matching = keys.filter((key) => chord.startsWith(key));

  if (!matching || matching.length == 0) return "tab";
  return "chord";
}

export function separateChordParts(chord: string) {
  const keys = Object.keys(chords);
  const matching = keys.filter((key) => chord.startsWith(key));

  if (!matching || matching.length == 0) return [];

  const prefix = matching[matching.length - 1];
  const suffix = chord.slice(prefix.length);

  return [prefix, suffix];
}

export function getChordFromParts(parts: string[]) {
  const chordList = (chords as Chords)[parts[0]];

  if (parts.length == 1 || parts[1] == "")
    return chordList.filter((c) => c.Suffix == "major")[0];

  if (parts[1] == "m") return chordList.filter((c) => c.Suffix == "minor")[0];

  return chordList.filter((c) => c.Suffix == parts[1])[0];
}

export function getChordBases() {
  return Object.keys(chords);
}

export function getAllChordVariations() {
  let allChords: string[] = [];
  const keys = Object.keys(chords);
  const chordObjArr = chords as Chords;

  keys.forEach((key, index) => {
    chordObjArr[key].forEach((chord, chordIndex) => {
      const suffix = chord.Suffix.replace("major", "").replace("minor", "m");
      allChords.push(`${chord.Key}${suffix}`);
    });
  });

  return allChords;
};