import styles from "../styles/Chord.module.scss";
import { useEffect, useState } from "react";
import ChordDiagram from "./chordDiagram";

interface ChordProps {
  chordId?: number;
  chordName: string;
  isChordNameVisible: boolean;
  currentActiveChord: boolean;
  className?: string;
}

export default function Chord(props: ChordProps) {
  const [isDiagramShowing, setIsDiagramShowing] = useState<boolean>(false);

  return (
    <div className={styles.chordContainer}>
      <span
        onMouseEnter={() => setIsDiagramShowing(true)}
        onMouseLeave={() => setIsDiagramShowing(false)}
        className={`chord ${styles.chord} ${
          props.currentActiveChord ? styles.active : ""
        } ${props.className ?? ""}`}
        id={props.chordId ? `chord-${props.chordId}` : ""}
      >
        {props.isChordNameVisible ? props.chordName : "?"}
      </span>
      {(isDiagramShowing || props.currentActiveChord) && (
        <ChordDiagram chord={props.chordName} className={styles.chordTooltip} />
      )}
    </div>
  );
}
