import styles from "../styles/ChordDiagram.module.scss";
import chords from "../public/chords/chords.json";
import Popup from "./popup";
import { Chords, Position } from "../types/interfaces";
import { useEffect } from "react";

interface ChordDiagramProps {
  chord: string | null;
  className?: string;
}

export default function ChordDiagram(props: ChordDiagramProps) {
  if (props.chord) {
    const chord = getChordFromParts(separateChordParts(props.chord));
    const maxFret = 3;

    let frets: number[] = [];
    for (let i = 0; i <= maxFret; i++) {
      frets.push(i);
    }

    const positions = chord.Positions[0]; //position 0 until you can loop through them

    return (
      <Popup
        className={`${styles.chordDiagramContainer} ${
          props.className && props.className
        }`}
      >
        <>
          <h4>{props.chord}</h4>
          <div className={styles.chordContainer}>
            <div className={styles.chordRow}>
              {writeFretIndicators(positions.Frets)}
            </div>
            {writeStringIndicators(frets, positions.Frets, positions)}
            <div className={styles.chordRow}>
              {writeFingerIndicators(positions.Fingers)}
            </div>
          </div>
        </>
      </Popup>
    );
  }

  return <></>;

  function separateChordParts(chord: string) {
    const keys = Object.keys(chords);
    const matching = keys.filter((key) => chord.startsWith(key));
    const prefix = matching[matching.length - 1];
    const suffix = chord.slice(prefix.length);

    return [prefix, suffix];
  }

  function getChordFromParts(parts: string[]) {
    const chordList = (chords as Chords)[parts[0]];

    if (parts.length == 1 || parts[1] == "")
      return chordList.filter((c) => c.Suffix == "major")[0];

    if (parts[1] == "m") return chordList.filter((c) => c.Suffix == "minor")[0];

    return chordList.filter((c) => c.Suffix == parts[1])[0];
  }

  function writeFretIndicators(fretPositions: number[]) {
    return fretPositions.map((item, index) => {
      return (
        <div
          key={index}
          className={`${styles.chordCell} ${styles.fretIndicator}`}
        >
          {item <= 0 && <span>{item < 0 ? "X" : item == 0 ? "O" : "-"}</span>}
        </div>
      );
    });
  }

  function writeStringIndicators(
    frets: number[],
    fretPositions: number[],
    positions: Position
  ) {
    return frets.map((item, rowIndex) => {
      return (
        <div key={rowIndex} className={styles.chordRow}>
          {fretPositions.map((item, fretIndex) => {
            return (
              <>
                <span
                  key={fretIndex}
                  className={`${styles.chordCell} ${
                    positions.Barres.some((barre) => barre - 1 == rowIndex)
                      ? styles.withBarre
                      : item == rowIndex + 1
                      ? styles.withFinger
                      : ""
                  }`}
                >
                  {item == rowIndex + 1 ? item : "-"}
                </span>
                {fretIndex == fretPositions.length - 1 &&
                  rowIndex == 0 &&
                  positions.BaseFret != 1 && (
                    <span className={styles.baseFret}>
                      {positions.BaseFret}fr
                    </span>
                  )}
              </>
            );
          })}
        </div>
      );
    });
  }

  function writeFingerIndicators(fingerPositions: number[]) {
    return fingerPositions.map((item, index) => {
      return (
        <div
          key={index}
          className={`${styles.chordCell} ${styles.fretIndicator}`}
        >
          {item > 0 && <span>{item}</span>}
        </div>
      );
    });
  }
}
