import styles from "../styles/Chord.module.scss";
import {
  Song,
  SongSection,
  Chords,
  Chord as ChordType,
} from "../public/Types/interfaces";
import { useEffect, useState } from "react";

interface ChordProp {
  chord: ChordType;
}

export default function Chord(props: ChordProp) {
  const noOfFrets = [1, 2, 3, 4];
  const [maxIndex, setMaxIndex] = useState(props.chord.Positions.length);
  const [chordIndex, setChordIndex] = useState(0);

  const incrementIndex = (increment: number) => {
    if (chordIndex + increment < 0 || chordIndex + increment >= maxIndex)
      return;

    setChordIndex(chordIndex + increment);
  };

  useEffect(() => {
    setChordIndex(0);
    setMaxIndex(props.chord.Positions.length);
  }, [props.chord]);

  return (
    <div className={styles.container}>
      <table className={styles.chordContainer}>
        <thead>
          <tr>
            {props.chord.Key}
            {props.chord.Suffix}
          </tr>
          <tr>
            {props.chord.Positions[chordIndex] &&
              props.chord.Positions[chordIndex].Frets.map(
                (fret: number, index: number) => {
                  return (
                    <td key={index}>
                      {fret == -1 && <span className={styles.muted}></span>}
                      {fret == 0 && <span className={styles.open}></span>}
                      {fret > 0 && (
                        <span className={styles.hidden}>{fret}</span>
                      )}
                    </td>
                  );
                }
              )}
          </tr>
        </thead>
        <tbody>
          {noOfFrets.map((index: number) => {
            if (
              props.chord.Positions[chordIndex] &&
              props.chord.Positions[chordIndex].Barres[0] == index
            )
              return (
                <tr key={index}>
                  {props.chord.Positions[chordIndex].Frets.map(
                    (fret: number, fretIndex: number) => {
                      return (
                        <td key={fretIndex}>
                          <span className={styles.barre}></span>
                        </td>
                      );
                    }
                  )}
                  <td>
                    {index == 1 &&
                      props.chord.Positions[chordIndex].BaseFret != 1 && (
                        <span>
                          {props.chord.Positions[chordIndex].BaseFret}fr
                        </span>
                      )}
                  </td>
                </tr>
              );
            if (
              props.chord.Positions[chordIndex] &&
              props.chord.Positions[chordIndex].Barres[0] != index
            )
              return (
                <tr key={index}>
                  {props.chord.Positions[chordIndex].Frets.map(
                    (fret: number, fretIndex: number) => {
                      return (
                        <td key={fretIndex}>
                          {fret == index && (
                            <span className={styles.dot}></span>
                          )}
                          {fret != index && (
                            <span className={styles.hidden}>{fret}</span>
                          )}
                        </td>
                      );
                    }
                  )}
                  <td>
                    {index == 1 &&
                      props.chord.Positions[chordIndex].BaseFret != 1 && (
                        <span>
                          {props.chord.Positions[chordIndex].BaseFret}fr
                        </span>
                      )}
                  </td>
                </tr>
              );
          })}
        </tbody>
      </table>
      <button onClick={() => incrementIndex(-1)}>prev</button>
      <button onClick={() => incrementIndex(1)}>next</button>
    </div>
  );
}
