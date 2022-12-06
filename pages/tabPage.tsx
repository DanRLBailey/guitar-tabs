import styles from "../styles/TabPage.module.scss";
import {
  Song,
  SongSection,
  Chords,
  Chord as ChordType,
  SongMetaDetails,
  TabItem,
} from "../public/Types/interfaces";
import { useState } from "react";
import Chord from "./chord";
import VideoEmbed from "./videoEmbed";
import Tab from "./tab";

interface TabPageProp {
  Key: string;
  SongMeta: SongMetaDetails;
  Chords: Chords;
}

export default function TabPage(props: TabPageProp) {
  const [currentChord, setCurrentChord] = useState<ChordType | null>(null);
  const [currentTab, setCurrentTab] = useState<TabItem[] | null>(null);
  const [showChordModal, setShowChordModal] = useState(false);
  const [showTabModal, setShowTabModal] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [highlightedChord, setHighlightedChord] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });

  let chordList: string[] = [];
  const song: Song = require(`../public/songs/${props.Key}`)[0];

  const getWord = (word: string) => {
    const words = word.split(/\*|\^/);

    return words[0].length == 0 ? "_" : words[0];
  };

  const getChords = (word: string) => {
    const chords = word.split(/\*|\^/);
    chords.shift();

    if (chords.length > 0) {
      chordList.push(...chords);
    }

    return chords;
  };

  const showChord = (chord: string) => {
    const key = chord[0];
    const suffix = chord.slice(1) != "" ? chord.slice(1) : "maj";
    const c = props.Chords[key].find((x) => x.Suffix == suffix);

    if (c) {
      setShowChordModal(true);
      setCurrentChord(c);
      setCurrentTab(null);
      return;
    }

    const t = song.Tabs[chord];

    if (t) {
      setShowTabModal(true);
      setCurrentTab(t);
      setCurrentChord(null);
    }
  };

  const highlightChord = (index: number) => {
    if (index < 0) return;
    setHighlightedIndex(index);
    setHighlightedChord(chordList[index]);
  };

  const onMouseMove = (e) => {
    setPosition({ x: e.screenX - 100, y: e.screenY - 75 });
  };

  return (
    <div className={styles.container}>
      <div className={styles.songContainer}>
        <h1>{props.SongMeta.Name}</h1>
        <h2>{props.SongMeta.Artist}</h2>
        <div className={styles.songDetails}>
          {song.Capo > 0 && <div>{`Capo: ${song.Capo}`}</div>}
          <div>
            {song.Chords.map((item: string, index: number) => {
              return (
                <span
                  className={styles.chord}
                  key={index}
                  onMouseEnter={() => showChord(item)}
                  onMouseLeave={() => {
                    setShowChordModal(false);
                    setShowTabModal(false);
                  }}
                >
                  {item}
                </span>
              );
            })}
          </div>
        </div>
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
                                return (
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
                                    onMouseLeave={() => {
                                      setShowChordModal(false);
                                      setShowTabModal(false);
                                    }}
                                  >
                                    {chord}
                                  </span>
                                );
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
      <div className={styles.sidebar}>
        {currentTab && showTabModal && (
          <div className={styles.popup}>
            <Tab tab={currentTab} />
          </div>
        )}
        {currentChord && showChordModal && (
          <div
            className={styles.popup}
            style={{ top: `${position.y}px`, left: `${position.x}px` }}
          >
            <Chord chord={currentChord} />
          </div>
        )}
        <div className={styles.video}>
          <VideoEmbed
            embedId={song.Link}
            chords={props.Chords}
            tabs={song.Tabs}
            timings={song.Timings}
            onHighlightChord={(index) => highlightChord(index)}
            currentChord={highlightedChord}
          />
        </div>
      </div>
    </div>
  );
}
