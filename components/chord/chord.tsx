import {
  determineType,
  getChordBases as getChordRoots,
  separateChordParts,
} from "../../lib/chords";
import { mod, toMinutesSecondsAndMilliseconds } from "../../lib/numbers";
import styles from "../../styles/chord/Chord.module.scss";
import { useEffect, useState } from "react";

interface ChordProps {
  className?: string;
  chordId?: number;
  chordName: string;
  chordTiming?: number;
  isChordNameVisible: boolean;
  currentActiveChord?: boolean;
  onChordActive?: (chord: string) => void;
  onChordHighlight?: (chord: string) => void;
  onChordPress?: (chordId: number) => void;
  transpose: number;
}

export default function Chord(props: ChordProps) {
  const type = determineType(props.chordName);
  const [isDiagramShowing, setIsDiagramShowing] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [transposedChord, setTransposedChord] = useState<string>(
    props.chordName
  );

  useEffect(() => {
    if (!props.currentActiveChord || !props.onChordActive) return;

    props.onChordActive(transposedChord);
  }, [props.currentActiveChord]);

  useEffect(() => {
    if (!props.onChordHighlight) return;

    if (isPinned || isDiagramShowing) props.onChordHighlight(transposedChord);
    else props.onChordHighlight("");
  }, [isDiagramShowing]);

  useEffect(() => {
    if (type != "chord") return;
    transposeOriginalChord(props.transpose);
  }, [props.transpose]);

  return (
    <div
      className={styles.chordContainer}
      onClick={() => {
        props.onChordPress
          ? props.onChordPress(props.chordId as number)
          : setIsPinned(!isPinned);
      }}
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
        {props.isChordNameVisible ? transposedChord : "?"}
        {props.chordTiming && (
          <> | {toMinutesSecondsAndMilliseconds(props.chordTiming)}</>
        )}
      </span>
    </div>
  );

  function transposeOriginalChord(amount: number) {
    const chordParts = separateChordParts(props.chordName);
    const roots = getChordRoots().filter((root) => !root.includes("b"));

    const prefixIndex = roots.indexOf(chordParts[0]);
    let prefixIncrement = mod(prefixIndex + amount, roots.length);

    if (!chordParts[1].includes("/"))
      setTransposedChord(`${roots[prefixIncrement]}${chordParts[1]}`);
    else {
      const suffix = chordParts[1].split("/")[1];
      const suffixIndex = roots.indexOf(suffix);
      let suffixIncrement = mod(suffixIndex + amount, roots.length);
      setTransposedChord(`${roots[prefixIncrement]}/${roots[suffixIncrement]}`);
    }
  }
}
