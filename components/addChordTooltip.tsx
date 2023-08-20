import { useState } from "react";
import styles from "../styles/AddChordTooltip.module.scss";

interface AddChordProp {
  onChordAdded: (chord: string) => void;
  songChords: string[]
}

export default function AddChordTooltip(props: AddChordProp) {
  return (
    <div className={styles.container}>
      {props.songChords.map((chord, index) => {
        return(<button key={index} onClick={() => props.onChordAdded(chord)}>{chord}</button>)
      })}
    </div>
  );
}
