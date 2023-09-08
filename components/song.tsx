import styles from "../styles/SongPage.module.scss";
import { Song, SongMetaDetails, SongSection } from "../types/interfaces";
import { useEffect, useState } from "react";
import SideBar from "./sideBar";
import ChordDiagram from "./chordDiagram";

interface TabPageProp {
  Key: string;
  SongMeta: SongMetaDetails;
  Song: Song;
}

export default function SongPage(props: TabPageProp) {
  const [uniqueSongChords, setUniqueSongChords] = useState<string[]>(
    getAllUniqueChordsAndTabs()
  );
  const [songChordsShown, setSongChordsShown] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [allSongChords, setAllSongChords] = useState<JSX.Element[]>([]);

  return (
    <div className={styles.container}>
      <title>
        {props.SongMeta.Name} - {props.SongMeta.Artist}
      </title>
      <SideBar
        song={props.Song}
        onChordsHidden={(hidden) => setSongChordsShown(hidden)}
        onTimeChange={(val) => setCurrentTime(val)}
      >
        {showCountdown()}
      </SideBar>
      <div className={styles.songContainer}>
        <h1>{props.SongMeta?.Name}</h1>
        <h2>{props.SongMeta?.Artist}</h2>
        <div className={styles.songDetails}>
          {listChords()}
          {props.Song.Parts.map((part: SongSection, partIndex: number) => {
            return (
              <section key={partIndex} className={styles.songSection}>
                <h4>{part.Section}</h4>
                {writeLines(part.Lines)}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );

  function writeLines(lines: [string[]]) {
    return lines.map((line, lineIndex) => {
      return (
        <div key={lineIndex} className={styles.songLine}>
          {writeWords(line)}
        </div>
      );
    });
  }

  function writeWords(line: string[]) {
    return line.map((word, wordIndex) => {
      if (!word || word == "" || word == undefined) return;
      return (
        <div key={wordIndex} className={styles.songWord}>
          {separateWordsFromChords(word)}
        </div>
      );
    });
  }

  function separateWordsFromChords(word: string) {
    if (!word || word == "" || word == undefined) return;

    const wordChordArr = word.split(/[*^]/);
    const words = wordChordArr.shift();

    const chords = wordChordArr.filter(
      (item) => uniqueSongChords.includes(item) && item != ""
    );

    return (
      <>
        <div className={styles.songChords}>
          {songChordsShown &&
            chords.map((item, index) => {
              return <div key={index}>{renderChord(item)}</div>;
            })}
        </div>
        <span className={styles.songLyric}>
          {words && words != "" && words != undefined && <span>{words}</span>}
          {(!words || words == "" || words == undefined) && (
            <span className={styles.hidden}>-</span>
          )}
        </span>
      </>
    );
  }

  function renderChord(chord: string) {
    return (
      <>
        <span>{chord}</span>
        {false && (
          <ChordDiagram chord={chord} className={styles.chordTooltip} />
        )}
      </>
    );
  }

  function getAllUniqueChordsAndTabs() {
    let chords: string[] = [];

    props.Song.Parts.forEach((part: SongSection) => {
      part.Lines.forEach((line: string[]) => {
        line.forEach((word: string) => {
          const wordChordArr = word.split(/[*^]/);

          if (word[0] != "*" && word[0] != "^") wordChordArr.shift();
          if (wordChordArr.length == 0) return;

          wordChordArr.forEach((chord: string) => {
            if (chord != "" && !chords.some((c) => c == chord))
              chords.push(chord);
          });

          return;
        });
      });
    });

    return chords;
  }

  function listChords() {
    return (
      <div className={`${styles.songChords} ${styles.header}`}>
        <div>
          {uniqueSongChords.sort().map((item, index) => {
            return <span key={index}>{item}</span>;
          })}
        </div>
      </div>
    );
  }

  function showCountdown() {
    if (
      !props.Song.Timings ||
      currentTime > props.Song.Timings[0] ||
      !songChordsShown
    )
      return <></>;

    const timeTillFirstChord = currentTime - props.Song.Timings[0];
    return <h4>First Chord: {Math.abs(timeTillFirstChord).toFixed(2)}s</h4>;
  }
}
