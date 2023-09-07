import styles from "../styles/NewSongWord.module.scss";
import { useEffect, useState } from "react";
import AddChordTooltip from "./addChordTooltip";

interface NewSongWordProp {
  word: string;
  index: number;
  onChordChange: (chords: string[]) => void;
  onTabChange: (chords: string[]) => void;
  type: "Section" | "Lyric";
  songChords: string[];
  songTabs: string[];
  showChord?: boolean;
  existingChords: string[];
}

export default function NewSongWord(props: NewSongWordProp) {
  const [editing, setEditing] = useState(false);
  const [chords, setChords] = useState<string[]>(props.existingChords);
  const [tabs, setTabs] = useState<string[]>([]);

  const handleChordAdded = (chord: string) => {
    const chordArr = chord.replaceAll(" ", "").split(",");
    setChords([...chords, ...chordArr]);
  };

  const handleTabAdded = (tab: string) => {
    const tabArr = tab.replaceAll(" ", "").split(",");
    setTabs([...tabs, ...tabArr]);
  };

  const handleChordRemoved = (index: number) => {
    const arr = [...chords];
    arr.splice(index, 1);
    setChords(arr);
  };

  const handleTabRemoved = (index: number) => {
    const arr = [...tabs];
    arr.splice(index, 1);
    setTabs(arr);
  };

  useEffect(() => {
    props.onChordChange(chords);
  }, [chords]);

  useEffect(() => {
    props.onTabChange(tabs);
  }, [tabs]);

  return (
    <div className={styles.container}>
      {editing && (
        <AddChordTooltip
          onChordAdded={(c) => handleChordAdded(c)}
          onTabAdded={(t) => handleTabAdded(t)}
          songChords={props.songChords}
          songTabs={props.songTabs}
        />
      )}
      {props.type == "Lyric" && (
        <div>
          {chords.length > 0 &&
            chords.map((chord, index) => {
              return (
                <button
                  key={index}
                  className={`${styles.button} ${styles.chordButton}`}
                  onClick={() => handleChordRemoved(index)}
                >
                  {chord}
                </button>
              );
            })}
          {tabs.length > 0 &&
            tabs.map((chord, index) => {
              return (
                <button
                  key={index}
                  className={`${styles.button} ${styles.chordButton}`}
                  onClick={() => handleTabRemoved(index)}
                >
                  {chord}
                </button>
              );
            })}
        </div>
      )}
      <button
        onClick={() => setEditing(!editing)}
        className={`${styles.button} ${editing ? styles.active : ""}`}
      >
        {props.word}
      </button>
      {props.type == "Section" && (
        <div>
          {chords.length > 0 &&
            chords.map((chord, index) => {
              return (
                <button
                  key={index}
                  className={`${styles.button} ${styles.chordButton} ${
                    props.type == "Section" ? styles.sectionButton : ""
                  }`}
                  onClick={() => handleChordRemoved(index)}
                >
                  {chord}
                </button>
              );
            })}
          {tabs.length > 0 &&
            tabs.map((chord, index) => {
              return (
                <button
                  key={index}
                  className={`${styles.button} ${styles.chordButton} ${
                    props.type == "Section" ? styles.sectionButton : ""
                  }`}
                  onClick={() => handleTabRemoved(index)}
                >
                  {chord}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
