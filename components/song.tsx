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
import NewSongWord from "./newSongWord";
import PencilIcon from "@mui/icons-material/Create";

interface TabPageProp {
  Key: string;
  SongMeta: SongMetaDetails;
  Chords: Chords;
  Song: Song;
}

export default function SongPage(props: TabPageProp) {
  const [currentChord, setCurrentChord] = useState<ChordType | null>(null);
  const [currentTab, setCurrentTab] = useState<TabItem[] | null>(null);
  const [showChordModal, setShowChordModal] = useState(false);
  const [showTabModal, setShowTabModal] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [highlightedChord, setHighlightedChord] = useState("");
  const [autoscroll, setAutoscroll] = useState(true);

  const [allChords, setAllChords] = useState<string[]>([]);
  const [song, setSong] = useState<Song | null>(props.Song);
  const [isEditing, setIsEditing] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  let chordList: string[] = [];

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
    const suffix = chord.slice(1) != "" ? chord.slice(1) : "major";

    const temp = props.Chords[key];
    if (temp) {
      const c = temp.find((x) => x.Suffix == suffix);
      return c;
    }

    return null;
  };

  const getKeyFromChord = (chord: string) => {
    return chord[1] == "#" ? `${chord[0].toUpperCase()}sharp` : chord[0];
  };

  const getSuffixFromChord = (chord: string) => {
    if (chord.length == 1) return "major";
    if (chord.length == 2 && chord.includes("#")) return "major";
    if (chord.length == 2 && chord[1] == "m") return "minor";

    return chord.slice(1);
  };

  const showChord = (chord: string) => {
    const key = getKeyFromChord(chord);
    const suffix = getSuffixFromChord(chord);

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

  const handleChordChange = (
    partIndex: number,
    lineIndex: number,
    wordIndex: number,
    chords: string[]
  ) => {
    if (!props.Song.Parts) return;

    const parts = [...props.Song.Parts];
    const part = parts[partIndex];
    const line = part.Lines[lineIndex];
    let word = line[wordIndex];

    if (!word) return;

    word = word.split("*")[0];
    chords.forEach((item) => {
      word += `*${item.replaceAll(" ", "")}`;
    });

    line[wordIndex] = word;
    part.Lines[lineIndex] = line;
    parts[partIndex] = part;
    setSong({ ...(song as Song), Parts: parts });
  };

  const saveEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleAddedTiming = () => {
    let timings = song?.Timings ?? [];
    timings?.push(currentTime);
    timings?.sort((a, b) => a - b);

    setSong({
      ...song,
      Timings: timings,
    } as Song);
  };

  const handleRemovedTiming = () => {
    let timings = song?.Timings;
    timings?.sort((a, b) => a - b);
    timings?.pop();

    setSong({
      ...song,
      Timings: timings,
    } as Song);
  };

  useEffect(() => {
    if (!autoscroll) return;

    if (highlightedIndex) {
      document
        .getElementById(`chord-${highlightedIndex}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    if (isEditing) return;

    fetch("/api/updateSong", {
      method: "POST",
      body: JSON.stringify({
        userId: 1,
        songName: props.SongMeta.Name,
        songArtist: props.SongMeta.Artist,
        parts: song?.Parts,
        timings: song?.Timings,
        tabs: song?.Tabs,
        capo: song?.Capo,
        link: song?.Link,
        slug: props.SongMeta.Name.toLowerCase().replaceAll(" ", "-"),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  }, [isEditing]);

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
        {getSong(props.Song.Parts)}
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
              onHighlightChord={(index) => highlightChord(index)}
              currentChord={highlightedChord}
              onToggleAutoscroll={(scroll) => setAutoscroll(scroll)}
              currentTime={currentTime}
              onTimeChange={(t) => setCurrentTime(t)}
              getKeyFromChord={(c) => getKeyFromChord(c)}
              getSuffixFromChord={(c) => getSuffixFromChord(c)}
            />
          </div>
        )}
      </div>
      <div
        className={`${styles.timingContainer} ${
          isEditing ? styles.isEditing : ""
        }`}
      >
        {isEditing && (
          <>
            {" "}
            <span>{song?.Timings?.map((t) => t.toFixed(2)).join(", ")}</span>
            <button onClick={handleRemovedTiming}>Delete</button>
            <button onClick={handleAddedTiming}>Add</button>
            <button onClick={saveEditing}>Save</button>
          </>
        )}
        {!isEditing && <button onClick={saveEditing}>Edit Song</button>}
      </div>
    </div>
  );

  function getSong(parts: SongSection[]) {
    return parts?.map((item: SongSection, partIndex: number) => {
      return (
        <div className={styles.section} key={partIndex}>
          <h4>{item.Section}</h4>
          <div>
            {item.Lines.map((lineItem, lineIndex) => {
              return (
                <div key={lineIndex} className={styles.line}>
                  {lineItem.map((word: string, wordIndex) => {
                    const c = getChords(word);
                    const w = getWord(word);

                    if (c.length > 0) {
                      c.forEach((chord) => {
                        chord = chord.replaceAll(" ", "");
                        if (
                          !allChords.includes(chord) &&
                          !chord.toLowerCase().includes("tab")
                        )
                          setAllChords([chord, ...allChords]);
                      });
                    }

                    return (
                      <div key={wordIndex} className={styles.word}>
                        {!isEditing && (
                          <>
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
                          </>
                        )}
                        {isEditing && (
                          <NewSongWord
                            key={wordIndex}
                            word={w}
                            index={wordIndex}
                            onChordChange={(chords) =>
                              handleChordChange(
                                partIndex,
                                lineIndex,
                                wordIndex,
                                chords
                              )
                            }
                            type="Lyric"
                            songChords={allChords}
                            existingChords={c}
                          />
                        )}
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
