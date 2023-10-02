import styles from "../styles/ChordDiagram.module.scss";
import { Chords, Position } from "../types/interfaces";
import {
  determineType,
  getChordFromParts,
  separateChordParts,
} from "../lib/chords";

interface ChordDiagramProps {
  chord: string | null;
  className?: string;
}

export default function ChordDiagram(props: ChordDiagramProps) {
  if (props.chord) {
    const type = determineType(props.chord);

    if (type == "chord") {
      const chordParts = separateChordParts(props.chord);
      if (chordParts.length == 0) return <></>;

      const chord = getChordFromParts(chordParts);
      if (!chord) return <></>;

      const maxFret = 3;

      let frets: number[] = [];
      for (let i = 0; i <= maxFret; i++) {
        frets.push(i);
      }

      const positions = chord.Positions[0]; //position 0 until you can loop through them

      return (
        <div className={styles.chordDiagramContainer}>
          <h3>{props.chord}</h3>
          <div className={styles.chordContainer}>
            <div className={styles.chordRow}>
              {writeFretIndicators(positions.Frets)}
            </div>
            {writeStringIndicators(frets, positions.Frets, positions)}
            <div className={styles.chordRow}>
              {writeFingerIndicators(positions.Fingers)}
            </div>
          </div>
        </div>
      );
    } else if (type == "tab") {
      return <>tab</>;
    }
  }

  return <></>;

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
