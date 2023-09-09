import styles from "../styles/SongPage.module.scss";
import {
  ChordObj,
  Song,
  SongMetaDetails,
  SongSection,
  PartObj,
} from "../types/interfaces";
import { useEffect, useState } from "react";
import SideBar from "./sideBar";
import ChordDiagram from "./chordDiagram";
import Chord from "./chord";
import React from "react";

interface TabPageProp {
  Key: string;
  SongMeta: SongMetaDetails;
  Song: Song;
}

export default function SongPage(props: TabPageProp) {
  const [uniqueSongChords, setUniqueSongChords] = useState<ChordObj[]>(
    getAllChordsAndTabs()
  );
  const [partList, setWordList] = useState<PartObj[]>(getAllParts());

  const [easyMode, setEasyMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (currentTime == 0) return;

    const timings = props.Song.Timings;
    if (!timings) return;

    const index = timings.findLastIndex((time) => time < currentTime);
    setHighlightedIndex(index);
  }, [currentTime, props.Song.Timings]);

  // return (
  //   <div className={styles.container}>
  //     <title>
  //       {props.SongMeta.Name} - {props.SongMeta.Artist}
  //     </title>
  //     <div className={styles.songContainer}>
  //       <h1>{props.SongMeta?.Name}</h1>
  //       <h2>{props.SongMeta?.Artist}</h2>
  //       <div className={styles.songDetails}>
  //         {listChords()}
  //         {props.Song.Parts.map((part: SongSection, partIndex: number) => {
  //           return (
  //             <section key={partIndex} className={styles.songSection}>
  //               <h4>{part.Section}</h4>
  //               {writeLines(part.Lines)}
  //             </section>
  //           );
  //         })}
  //       </div>
  //     </div>
  //     <SideBar
  //       song={props.Song}
  //       onChordsHidden={(hidden) => setHardMode(hidden)}
  //       onTimeChange={(val) => setCurrentTime(val)}
  //     >
  //       {showCountdown()}
  //     </SideBar>
  //   </div>
  // );

  return (
    <div className={styles.container}>
      <title>
        {props.SongMeta.Name} - {props.SongMeta.Artist}
      </title>
      <div className={styles.songContainer}>
        <h1>{props.SongMeta?.Name}</h1>
        <h2>{props.SongMeta?.Artist}</h2>
        <div className={styles.songDetails}>
          {listChords()}
          {partList &&
            partList
              .filter((part) => part.type == "section")
              .map((section: PartObj, sectionIndex: number) => {
                return (
                  <section key={sectionIndex} className={styles.songSection}>
                    <h4>{section.text}</h4>
                    {/* writelines */}
                    {partList
                      .filter(
                        (part) =>
                          part.type == "line" && part.sectionId == sectionIndex
                      )
                      .map((line: PartObj, lineIndex: number) => {
                        return (
                          <div key={lineIndex} className={styles.songLine}>
                            {/* writewords */}
                            {partList
                              .filter(
                                (part) =>
                                  (part.type == "word" ||
                                    part.type == "chord") &&
                                  part.sectionId == sectionIndex &&
                                  part.lineId == lineIndex
                              )
                              .map((word: PartObj, wordIndex: number) => {
                                if (word.type == "chord")
                                  return (
                                    <Chord
                                      key={wordIndex}
                                      chord={word.text}
                                      showChord={
                                        easyMode || word.id == highlightedIndex
                                      }
                                      active={word.id == highlightedIndex}
                                    />
                                  );

                                return <span key={wordIndex}>{word.text}</span>;
                              })}
                          </div>
                        );
                      })}
                  </section>
                );
                // if (part.type == "section")
                //   return <h4 key={partIndex}>{part.text}</h4>;

                // if (part.type == "chord")
                //   return (
                //     <Chord
                //       key={partIndex}
                //       chord={part.text}
                //       showChord={true}
                //       active={part.id == highlightedIndex}
                //     />
                //   );

                // return <span key={partIndex}>{part.text}</span>;
              })}
        </div>
      </div>
      <SideBar
        song={props.Song}
        onChordsHidden={(hidden) => setEasyMode(hidden)}
        onTimeChange={(val) => setCurrentTime(val)}
      >
        {showCountdown()}
      </SideBar>
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

    const chords = wordChordArr;

    return (
      <>
        <div className={styles.songChords}>
          {chords.map((item, index) => {
            return (
              <div key={index}>
                {
                  <Chord
                    chord={item}
                    showChord={easyMode}
                    active={highlightedIndex === index}
                  />
                }
              </div>
            );
          })}
        </div>
        <span className={styles.songLyric}>
          {words && <span>{words}</span>}
          {!words && <span className={styles.hidden}>-</span>}
        </span>
      </>
    );
  }

  function getAllParts() {
    let chords: PartObj[] = [];
    let count = 0;
    let sectionCount = 0;

    props.Song.Parts.forEach((part: SongSection) => {
      const partObj = {
        text: part.Section,
        id: null,
        sectionId: sectionCount,
        lineId: null,
        type: "section",
      } as PartObj;

      chords.push(partObj);

      let lineCount = 0;

      part.Lines.forEach((line: string[]) => {
        const lineObj = {
          text: part.Section,
          id: null,
          sectionId: sectionCount,
          lineId: lineCount,
          type: "line",
        } as PartObj;

        chords.push(lineObj);

        line.forEach((line: string) => {
          const wordChordArr = line.split(/[*^]/);
          if (wordChordArr.length == 0) return;

          wordChordArr
            .filter((word) => word != "")
            .forEach((word: string, index: number) => {
              const isWord = line[0] != "*" && line[0] != "^" && index == 0;

              const chordObj = {
                text: word,
                id: count,
                sectionId: sectionCount,
                lineId: lineCount,
                type: isWord ? "word" : "chord",
              } as PartObj;

              if (!isWord) count++;
              chords.push(chordObj);
            });

          return;
        });

        lineCount++;
      });

      sectionCount++;
    });

    return chords;
  }

  function getAllChordsAndTabs(unique: boolean = true) {
    let chords: ChordObj[] = [];
    let count = 0;

    props.Song.Parts.forEach((part: SongSection) => {
      part.Lines.forEach((line: string[]) => {
        line.forEach((word: string) => {
          const wordChordArr = word.split(/[*^]/);

          if (word[0] != "*" && word[0] != "^") wordChordArr.shift();
          if (wordChordArr.length == 0) return;

          wordChordArr
            .filter((chord) => chord != "")
            .forEach((chord: string) => {
              const chordObj = {
                chord: chord,
                id: count,
                isRendered: false,
              };

              count++;
              if (!unique) chords.push(chordObj);
              if (!chords.some((c) => c.chord == chord)) chords.push(chordObj);
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
            return (
              <Chord
                key={index}
                chord={item.chord}
                showChord={true}
                active={false}
              />
            );
          })}
        </div>
      </div>
    );
  }

  function showCountdown() {
    if (!props.Song.Timings || currentTime > props.Song.Timings[0] || !easyMode)
      return <></>;

    const timeTillFirstChord = currentTime - props.Song.Timings[0];
    return <h4>First Chord: {Math.abs(timeTillFirstChord).toFixed(1)}s</h4>;
  }
}
