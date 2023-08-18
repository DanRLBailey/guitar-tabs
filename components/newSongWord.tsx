import styles from "../styles/NewSongWord.module.scss";
import { useEffect, useState } from "react";
import AddChordTooltip from "./addChordTooltip";

interface NewSongWordProp {
  word: string;
  index: number;
  onChordChange: (chords: string[]) => void;
  type: "Section" | "Lyric";
}

export default function NewSongWord(props: NewSongWordProp) {
  const [editing, setEditing] = useState(false);
  const [chords, setChords] = useState<string[]>([]);

  const handleChordAdded = (chord: string) => {
    const chordArr = chord.trim().split(",");

    setChords([...chords, ...chordArr]);
  };

  const handleChordRemoved = (index: number) => {
    const arr = [...chords];
    arr.splice(index, 1);
    setChords(arr);
  };

  useEffect(() => {
    props.onChordChange(chords);
  }, [chords]);

  return (
    <div className={styles.container}>
      {editing && <AddChordTooltip onChordAdded={(c) => handleChordAdded(c)} />}
      {props.type == "Lyric" && chords.length > 0 && (
        <div>
          {" "}
          {chords.map((chord, index) => {
            return (
              <button
                key={index}
                className={`${styles.button} ${styles.chordButton}`}
                onClick={() => handleChordRemoved(index)}
              >
                {chord}
              </button>
            );
          })}{" "}
        </div>
      )}
      <button
        onClick={() => setEditing(!editing)}
        className={`${styles.button} ${editing ? styles.active : ""}`}
      >
        {props.word}
      </button>
      {props.type == "Section" && chords.length > 0 && (
        <div>
          {" "}
          {chords.map((chord, index) => {
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
          })}{" "}
        </div>
      )}
    </div>
  );
}
