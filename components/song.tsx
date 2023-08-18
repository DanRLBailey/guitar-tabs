import styles from "../styles/TabPage.module.scss";
import {
  Song,
  SongSection,
  Chords,
  Chord as ChordType,
  SongMetaDetails,
  TabItem,
  Tab as TabType,
} from "../types/interfaces";
import { useEffect, useState } from "react";
import Chord from "./chord";
import VideoEmbed from "./videoEmbed";
import Tab from "./tab";

interface TabPageProp {
  Key: string;
  SongMeta: SongMetaDetails;
  Chords: Chords;
}

export default function SongPage(props: TabPageProp) {
  const [currentChord, setCurrentChord] = useState<ChordType | null>(null);
  const [currentTab, setCurrentTab] = useState<TabItem[] | null>(null);
  const [showChordModal, setShowChordModal] = useState(false);
  const [showTabModal, setShowTabModal] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [highlightedChord, setHighlightedChord] = useState("");
  const [autoscroll, setAutoscroll] = useState(true);
  const [simpleChords, setSimpleChords] = useState(false);
  const [allChords, setAllChords] = useState<string[]>([]);

  const simplifyChords = () => {
    setSimpleChords(!simpleChords);
  };

  let chordList: string[] = [];
  const song: Song | null = props.Key
    ? require(`../public/songs/${props.Key}`)[0]
    : null;

  const [hasSimpleChords, setHasSimpleChords] = useState(
    song?.SimpleParts != null ?? null
  );

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

  const getChord = (chord: string) => {
    const key = chord[0];
    const suffix = chord.slice(1) != "" ? chord.slice(1) : "maj";

    const temp = props.Chords[key];
    if (temp) {
      const c = temp.find((x) => x.Suffix == suffix);
      return c;
    }

    return null;
  };

  const showChord = (chord: string) => {
    const key = chord[0];
    const suffix = chord.slice(1) != "" ? chord.slice(1) : "maj";

    const temp = props.Chords[key];
    if (temp) {
      const c = temp.find((x) => x.Suffix == suffix);

      if (c) {
        setShowChordModal(true);
        setCurrentChord(c);
        setCurrentTab(null);
        return;
      }
    }

    const t = song?.Tabs ? song.Tabs[chord] : null;

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

  useEffect(() => {
    if (!autoscroll) return;

    if (highlightedIndex) {
      document
        .getElementById(`chord-${highlightedIndex}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightedIndex]);

  return (
    <div className={styles.container}>
      <title>
        {props.SongMeta.Name} - {props.SongMeta.Artist}
      </title>
      <div className={styles.songContainer}>
        <h1>{props.SongMeta?.Name}</h1>
        <h2>{props.SongMeta?.Artist}</h2>
        <div className={styles.songDetails}>
          {song?.Capo && song.Capo > 0 && <div>{`Capo: ${song?.Capo}`}</div>}
          <div className={styles.songChordList}>
            {allChords?.sort().map((item: string, index: number) => {
              return (
                <div key={index}>
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
                </div>
              );
            })}
          </div>
        </div>
        {(!simpleChords || !hasSimpleChords) &&
          getSong(song?.Parts as SongSection[])}
        {hasSimpleChords &&
          simpleChords &&
          getSong(song?.SimpleParts as SongSection[])}
      </div>
      <div className={styles.sidebar}>
        {currentTab && showTabModal && (
          <div className={styles.popup}>
            <Tab tab={currentTab} />
          </div>
        )}
        {currentChord && showChordModal && (
          <div className={styles.popup}>
            <Chord chord={currentChord} />
          </div>
        )}
        {song && (
          <div className={styles.video}>
            <VideoEmbed
              embedId={song.Link}
              chords={props.Chords}
              tabs={song.Tabs as TabType}
              timings={song.Timings as number[]}
              hasSimpleChords={hasSimpleChords}
              simpleChords={simpleChords}
              onHighlightChord={(index) => highlightChord(index)}
              currentChord={highlightedChord}
              onToggleAutoscroll={(scroll) => setAutoscroll(scroll)}
              onSimplifyChords={simplifyChords}
            />
          </div>
        )}
      </div>
    </div>
  );

  function getSong(parts: SongSection[]) {
    return parts.map((item: SongSection, index: number) => {
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

                    if (c.length > 0) {
                      c.forEach((chord) => {
                        chord = chord.trim();
                        if (
                          !allChords.includes(chord) &&
                          !chord.toLowerCase().includes("tab")
                        )
                          setAllChords([chord, ...allChords]);
                      });
                    }

                    return (
                      <div key={wordIndex} className={styles.word}>
                        <div className={styles.chords}>
                          {c.map((chord: string, chordIndex: number) => {
                            const currentChordIndex =
                              chordList.length - c.length + chordIndex;
                            return (
                              <span
                                id={`chord-${currentChordIndex}`}
                                className={`${styles.chord} ${
                                  currentChordIndex == highlightedIndex
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
    });
  }
}
