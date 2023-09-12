import styles from "../styles/Chord.module.scss";
import { useEffect, useState } from "react";
import ChordDiagram from "./chordDiagram";

interface ChordProps {
  chordId?: number;
  chordName: string;
  isChordNameVisible: boolean;
  currentActiveChord: boolean;
  className?: string;
  onChordActive?: (chord: string) => void;
  onChordHighlight?: (chord: string) => void;
}

export default function Chord(props: ChordProps) {
  const [isDiagramShowing, setIsDiagramShowing] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);

  useEffect(() => {
    if (!props.currentActiveChord || !props.onChordActive) return;

    props.onChordActive(props.chordName);
  }, [props.currentActiveChord]);

  useEffect(() => {
    if (!props.onChordHighlight) return;

    if (isPinned || isDiagramShowing) props.onChordHighlight(props.chordName);
    else props.onChordHighlight("");

    //props.onChordHighlight(isDiagramShowing ? props.chordName : "");
  }, [isDiagramShowing]);

  return (
    <div
      className={styles.chordContainer}
      onClick={() => setIsPinned(!isPinned)}
    >
      <span
        onMouseEnter={() => setIsDiagramShowing(true)}
        onMouseLeave={() => {
          setIsDiagramShowing(false);
        }}
        className={`chord ${styles.chord} ${
          props.currentActiveChord || isPinned ? styles.active : ""
        } ${props.className ?? ""}`}
        id={props.chordId ? `chord-${props.chordId}` : ""}
      >
        {props.isChordNameVisible ? props.chordName : "?"}
      </span>
    </div>
  );
}
