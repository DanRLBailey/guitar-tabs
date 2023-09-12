import styles from "../styles/SongPage.module.scss";
import {
  Song,
  SongMetaDetails,
  SongSection,
  PartObj,
  Setting,
} from "../types/interfaces";
import { useEffect, useState } from "react";
import ChordDiagram from "./chordDiagram";
import Chord from "./chord";
import React from "react";
import VideoEmbed from "./videoEmbed";
import DraggableContainer from "./draggableContainer";
import { getSettingsFromStore } from "../lib/localStore";
import SettingToggle from "./settingToggle";

interface TabPageProp {
  Key: string;
  SongMeta: SongMetaDetails;
  Song: Song;
  onSongRefresh: () => void;
}

export default function SongPage(props: TabPageProp) {
  const uniqueSongChords = getAllParts(true, ["chord"]);
  const partList = getAllParts();

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [activeChord, setActiveChord] = useState<string>("");
  const [hoveredChord, setHoveredChord] = useState<string>("");
  const [settings, setSettings] = useState<Setting>({
    "hidden-mode": getSettingsFromStore("hidden-mode", false),
    "show-chord-popup": getSettingsFromStore("show-chord-popup", true),
    autoscroll: getSettingsFromStore("autoscroll", true),
    editing: false,
    recording: false,
    countdown: getSettingsFromStore("countdown", true),
  });

  useEffect(() => {
    if (currentTime == 0) return;

    const timings = props.Song.Timings;
    if (!timings) return;

    const index = timings.findLastIndex((time) => time < currentTime);
    setHighlightedIndex(index);
  }, [currentTime, props.Song.Timings]);

  useEffect(() => {
    const chordEl = document.getElementById(`chord-${highlightedIndex}`);

    if (chordEl && settings.autoscroll)
      chordEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedIndex]);

  const onSettingChange = (setting: Setting, saveToStorage: boolean = true) => {
    setSettings({ ...settings, ...setting });

    if (!saveToStorage) return;

    const key = Object.keys(setting)[0];
    localStorage.setItem(key, setting[key].toString());
  };

  return (
    <div className={styles.container}>
      <title>
        {props.SongMeta.Name} - {props.SongMeta.Artist}
      </title>
      <div className={styles.songContainer}>
        <h1>{props.SongMeta?.Name}</h1>
        <h2>{props.SongMeta?.Artist}</h2>
        {props.Song.Capo && props.Song.Capo > 0 && (
          <h3>Capo: {props.Song.Capo}</h3>
        )}
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
      <>
        <DraggableContainer
          containerId="video-player"
          width={15}
          minWidth={200}
          title={`${props.SongMeta?.Name} - ${props.SongMeta?.Artist}`}
        >
          <VideoEmbed
            embedId={props.Song.Link}
            onTimeChange={(val) => setCurrentTime(val)}
          />
        </DraggableContainer>
        {settings["show-chord-popup"] && activeChord && (
          <DraggableContainer
            containerId="chord-diagram-active"
            width={10}
            minWidth={130}
          >
            <ChordDiagram chord={activeChord} />
          </DraggableContainer>
        )}
        {hoveredChord && (
          <DraggableContainer
            containerId="chord-diagram-hover"
            width={10}
            minWidth={130}
          >
            <ChordDiagram chord={hoveredChord} />
          </DraggableContainer>
        )}
        <DraggableContainer
          containerId="settings"
          title="Settings"
          width={11}
          minWidth={200}
          collapsable
        >
          <div>
            <SettingToggle
              value={{ "hidden-mode": settings["hidden-mode"] }}
              onSettingChange={(setting) => onSettingChange(setting)}
              settingText="Hidden Mode"
              type="checkbox"
            />
            <SettingToggle
              value={{
                ["show-chord-popup"]: settings["show-chord-popup"],
              }}
              onSettingChange={(setting) => onSettingChange(setting)}
              settingText="Show Chord Popup"
              type="checkbox"
            />
            <SettingToggle
              value={{ ["autoscroll"]: settings["autoscroll"] }}
              onSettingChange={(setting) => onSettingChange(setting)}
              settingText="Autoscroll"
              type="checkbox"
            />
            <SettingToggle
              value={{ ["editing"]: settings["editing"] }}
              onSettingChange={(setting) => onSettingChange(setting, false)}
              settingText="TODO: Edit Mode"
              type="checkbox"
            />
            <SettingToggle
              value={{ ["recording"]: settings["recording"] }}
              onSettingChange={(setting) => onSettingChange(setting, false)}
              settingText="TODO: Recording Mode"
              type="checkbox"
            />
            <SettingToggle
              value={{ ["countdown"]: settings["countdown"] }}
              onSettingChange={(setting) => onSettingChange(setting)}
              settingText="Show Countdown"
              type="checkbox"
            />
            <button onClick={props.onSongRefresh}>Refresh</button>
            <button>TODO: Transpose</button>
          </div>
        </DraggableContainer>
        {settings.editing && (
          <DraggableContainer
            containerId="edit"
            title="Editing"
            width={10}
            minWidth={150}
            collapsable
          >
            <>
              <button>Save</button>
              <button onClick={() => onSettingChange({ ["editing"]: false })}>
                Cancel
              </button>
            </>
          </DraggableContainer>
        )}
        {settings.recording && (
          <DraggableContainer
            containerId="recording"
            title="Record"
            width={10}
            minWidth={150}
            collapsable
          >
            <>
              <button>Start</button>
              <button>Pause</button>
              <button>Stop</button>
            </>
          </DraggableContainer>
        )}
        {settings.countdown && showCountdown()}
      </>
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
                              !settings["hidden-mode"] ||
                              chord.chordId == highlightedIndex
                            }
                            currentActiveChord={
                              chord.chordId == highlightedIndex
                            }
                            className={styles.songChord}
                            chordId={chord.chordId ?? undefined}
                            onChordActive={(chord: string) =>
                              setActiveChord(chord)
                            }
                            onChordHighlight={(chord: string) =>
                              setHoveredChord(chord)
                            }
                          />
                        );
                      })}
                  </div>

                  {!settings["editing"] && word.text != "" && (
                    <span key={wordIndex} className={styles.songWord}>
                      {word.text}
                    </span>
                  )}
                  {!settings["editing"] && word.text == "" && (
                    <span
                      key={wordIndex}
                      className={`${styles.songWord} ${styles.hidden}`}
                    >
                      -
                    </span>
                  )}
                  {settings["editing"] && (
                    <button key={wordIndex} className={styles.songWord}>
                      {word.text}
                    </button>
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
              onChordHighlight={(chord: string) => setHoveredChord(chord)}
            />
          );
        })}
      </div>
    );
  }

  function showCountdown() {
    if (!props.Song.Timings || currentTime > props.Song.Timings[0])
      return <></>;

    let timeTillFirstChord = currentTime - props.Song.Timings[0];
    timeTillFirstChord = Math.abs(timeTillFirstChord);

    if (timeTillFirstChord > 5) return <></>;

    return (
      <DraggableContainer
        containerId="countdown"
        title="Countdown"
        width={1}
        minWidth={150}
      >
        <h1 style={{ textAlign: "center" }}>
          {timeTillFirstChord.toFixed(1)}s
        </h1>
      </DraggableContainer>
    );
  }
}
