import styles from "../styles/Chord.module.scss";
import { useState } from "react";
import ChordDiagram from "./chordDiagram";

interface ChordProps {
  chord: string;
  showChord: boolean;
  active: boolean;
}

export default function Chord(props: ChordProps) {
  const [isShowing, setIsShowing] = useState<boolean>(false);

  return (
    <>
      <span
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
        className={`chord ${styles.chord} ${props.active ? styles.active : ""}`}
      >
        {props.showChord ? props.chord : "?"}
      </span>
      {isShowing && (
        <ChordDiagram chord={props.chord} className={styles.chordTooltip} />
      )}
    </>
  );
}
