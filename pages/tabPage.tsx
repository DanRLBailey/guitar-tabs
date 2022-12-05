import styles from "../styles/TabPage.module.scss";
import {
  Song,
  SongSection,
  Chords,
  Chord as ChordType,
} from "../public/Types/interfaces";
import { useState } from "react";
import Chord from "./chord";
import VideoEmbed from "./videoEmbed";

interface TabPageProp {
  SongName: string;
}

export default function TabPage(props: TabPageProp) {
  const [currentChord, setCurrentChord] = useState<ChordType | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [highlightedChord, setHighlightedChord] = useState("");
  let chordEls: JSX.Element[] = [];
  let chordList: string[] = [];

  const chords: Chords = require("../public/chords/chords.json");
  const song: Song = require(`../public/songs/${props.SongName}`)[0];
  // const timings: number[] = require(`../public/timings/${props.SongName}.json`);
  const timings: number[] = require(`../public/timings/Have You Ever Seen The Rain - Creedence Clearwater Revival.json`);

  const getWord = (word: string) => {
    const words = word.split("*");

    return words[0].length == 0 ? "_" : words[0];
  };

  const getChords = (word: string) => {
    const chords = word.split("*");
    chords.shift();

    if (chords.length > 0) {
      chordList.push(...chords);
    }

    return chords;
  };

  const showChord = (chord: string) => {
    const key = chord[0];
    const suffix = chord.slice(1) != "" ? chord.slice(1) : "maj";
    const c = chords[key].find((x) => x.Suffix == suffix);

    if (c) {
      setCurrentChord(c);
    }
  };

  const highlightChord = (index: number) => {
    if (index < 0) return;
    setHighlightedIndex(index);
    setHighlightedChord(chordList[index]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.songContainer}>
        <h1>{props.SongName.split("-")[0]}</h1>
        <h2>{props.SongName.split("-")[1]}</h2>
        {song.Chords.map((item: string, index: number) => {
          return (
            <span
              className={styles.chord}
              key={index}
              onMouseEnter={() => showChord(item)}
            >
              {item}
            </span>
          );
        })}
        {song.Parts.map((item: SongSection, index: number) => {
          return (
            <div className={styles.section} key={index}>
              <h4>{item.Section}</h4>
              <div>
                {item.Lines.map((lineItem: [], lineIndex) => {
                  return (
                    <div key={lineIndex} className={styles.line}>
                      {lineItem.map((word: string, wordIndex) => {
                        const c = getChords(word);
                        const w = getWord(word);
                        return (
                          <div key={wordIndex} className={styles.word}>
                            <div className={styles.chords}>
                              {c.map((chord: string, chordIndex: number) => {
                                const el = (
                                  <span
                                    className={`${styles.chord} ${
                                      chordList.length -
                                        c.length +
                                        chordIndex ==
                                      highlightedIndex
                                        ? styles.highlight
                                        : ""
                                    }`}
                                    key={chordIndex}
                                    onMouseEnter={() => showChord(chord)}
                                  >
                                    {chord}
                                  </span>
                                );

                                chordEls.push(el);
                                return el;
                              })}
                            </div>
                            <span
                              className={
                                w.includes("_") ? styles.hidden : styles.word
                              }
                            >
                              {w}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {currentChord && (
        <div className={styles.popup}>
          <Chord chord={currentChord} />
        </div>
      )}
      <div className={styles.video}>
        <VideoEmbed
          embedId={song.Link}
          chords={chords}
          timings={timings}
          onHighlightChord={(index) => highlightChord(index)}
          currentChord={highlightedChord}
        />
      </div>
    </div>
  );
}
