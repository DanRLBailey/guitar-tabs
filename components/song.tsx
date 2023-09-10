import styles from "../styles/SongPage.module.scss";
import {
  ChordObj,
  Song,
  SongMetaDetails,
  SongSection,
  PartObj,
} from "../types/interfaces";
import { useEffect, useState } from "react";
import Overlay from "./overlay";
import ChordDiagram from "./chordDiagram";
import Chord from "./chord";
import React from "react";
import VideoEmbed from "./videoEmbed";
import DraggableContainer from "./draggableContainer";

interface TabPageProp {
  Key: string;
  SongMeta: SongMetaDetails;
  Song: Song;
}

export default function SongPage(props: TabPageProp) {
  const [uniqueSongChords, setUniqueSongChords] = useState<PartObj[]>(
    getAllParts(true, ["chord"])
  );
  const [partList, setPartList] = useState<PartObj[]>(getAllParts());

  const [easyMode, setEasyMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  useEffect(() => {
    if (currentTime == 0) return;

    const timings = props.Song.Timings;
    if (!timings) return;

    const index = timings.findLastIndex((time) => time < currentTime);
    setHighlightedIndex(index);
  }, [currentTime, props.Song.Timings]);

  useEffect(() => {
    console.log(highlightedIndex);
    const chordEl = document.getElementById(`chord-${highlightedIndex}`);

    if (chordEl)
      chordEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedIndex]);

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
                    {writeLinesInSection(sectionIndex)}
                  </section>
                );
              })}
        </div>
      </div>
      <Overlay>
        <DraggableContainer containerName="test">
          <VideoEmbed
            embedId={props.Song.Link}
            onChordsHidden={(hidden) => setEasyMode(hidden)}
            onTimeChange={(val) => setCurrentTime(val)}
          />
        </DraggableContainer>
      </Overlay>
    </div>
  );

  function writeLinesInSection(sectionIndex: number) {
    return partList
      .filter((part) => part.type == "line" && part.sectionId == sectionIndex)
      .map((line: PartObj, linesIndex: number) => {
        return (
          <div key={linesIndex} className={styles.songLines}>
            {writeLine(sectionIndex, linesIndex)}
          </div>
        );
      });
  }

  function writeLine(sectionIndex: number, linesIndex: number) {
    return partList
      .filter(
        (part) =>
          part.sectionId == sectionIndex &&
          part.lineId == linesIndex &&
          part.type == "line"
      )
      .map((part: PartObj, lineIndex: number) => {
        return (
          <div key={lineIndex} className={styles.songLine}>
            {writeWords(sectionIndex, linesIndex)}
          </div>
        );
      });
  }

  function writeWords(sectionIndex: number, lineIndex: number) {
    return (
      <>
        {partList
          .filter(
            (part) =>
              part.type == "word" &&
              part.sectionId == sectionIndex &&
              part.lineId == lineIndex
          )
          .map((word: PartObj, wordIndex: number) => {
            if (word.type == "word")
              return (
                <div className={styles.wordGroup}>
                  <div className={styles.chordGroup}>
                    {partList
                      .filter(
                        (part: PartObj) =>
                          (part.type == "chord" || part.type == "tab") &&
                          part.sectionId == sectionIndex &&
                          part.lineId == lineIndex &&
                          part.wordId == word.wordId
                      )
                      .map((chord: PartObj, chordIndex: number) => {
                        return (
                          <Chord
                            key={chordIndex}
                            chordName={chord.text}
                            isChordNameVisible={
                              easyMode || chord.chordId == highlightedIndex
                            }
                            currentActiveChord={
                              chord.chordId == highlightedIndex
                            }
                            className={styles.songChord}
                            chordId={chord.chordId ?? undefined}
                          />
                        );
                      })}
                  </div>

                  {word.text != "" && (
                    <span key={wordIndex} className={styles.songWord}>
                      {word.text}
                    </span>
                  )}
                  {word.text == "" && (
                    <span
                      key={wordIndex}
                      className={`${styles.songWord} ${styles.hidden}`}
                    >
                      -
                    </span>
                  )}
                </div>
              );
            return <></>;
          })}
      </>
    );
  }

  function getAllParts(unique?: boolean, types?: string[]) {
    let parts: PartObj[] = [];
    let sectionCount = 0;
    let chordCount = 0;
    let wordCount = 0;

    props.Song.Parts.forEach((part: SongSection) => {
      const partObj = {
        text: part.Section,
        sectionId: sectionCount,
        lineId: null,
        chordId: null,
        wordId: null,
        type: "section",
      } as PartObj;

      parts.push(partObj);

      let lineCount = 0;

      part.Lines.forEach((line: string[]) => {
        const lineObj = {
          text: part.Lines[lineCount][0],
          sectionId: sectionCount,
          lineId: lineCount,
          chordId: null,
          wordId: null,
          type: "line",
        } as PartObj;

        parts.push(lineObj);

        line.forEach((line: string) => {
          const wordChordArr = line.split(/[*^]/);

          if (wordChordArr.length == 0) return;

          wordChordArr.forEach((word: string, index: number) => {
            const isWord = line[0] != "*" && line[0] != "^" && index == 0;
            if (index == 0) wordCount++;

            const chordObj = {
              text: word,
              sectionId: sectionCount,
              lineId: lineCount,
              chordId: chordCount,
              wordId: wordCount,
              type:
                isWord || word == ""
                  ? "word"
                  : line[0] == "*"
                  ? "chord"
                  : "tab",
            } as PartObj;

            if (!isWord && word != "") chordCount++;

            parts.push(chordObj);
          });

          return;
        });

        lineCount++;
      });

      sectionCount++;
    });

    if (!types) return parts;

    const filteredArr = parts.filter((part) =>
      types.some((t) => t == part.type)
    );

    if (!unique) return filteredArr;

    const uniqueArr = filteredArr.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.text === value.text)
    );

    return uniqueArr;
  }

  function listChords() {
    return (
      <div className={`${styles.songChords} ${styles.header}`}>
        {uniqueSongChords.sort().map((item, index) => {
          return (
            <Chord
              key={index}
              chordName={item.text}
              isChordNameVisible={true}
              currentActiveChord={false}
            />
          );
        })}
      </div>
    );
  }

  function showCountdown() {
    if (!props.Song.Timings || currentTime > props.Song.Timings[0]) return;

    const timeTillFirstChord = currentTime - props.Song.Timings[0];
    // return <h4>First Chord: {Math.abs(timeTillFirstChord).toFixed(1)}s</h4>;
    return Math.abs(timeTillFirstChord).toFixed(1) + "s";
  }
}
