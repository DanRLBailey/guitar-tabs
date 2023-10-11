import styles from "../styles/SongPage.module.scss";
import draggableStyles from "../styles/containers/DraggableContainer.module.scss";
import {
  Song,
  SongMetaDetails,
  SongSection,
  PartObj,
  Setting,
} from "../types/interfaces";
import { useEffect, useState } from "react";
import ChordDiagram from "./chord/chordDiagram";
import Chord from "./chord/chord";
import React from "react";
import VideoEmbed from "./video/videoEmbed";
import DraggableContainer from "./containers/draggableContainer";
import { getSettingsFromStore, writeSettingToStore } from "../lib/localStore";
import SettingToggle from "./settingToggle";
import SettingsIcon from "@mui/icons-material/Settings";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import AlarmIcon from "@mui/icons-material/Alarm";
import Popup from "./containers/popup";
import { determineType } from "../lib/chords";
import Tab from "./containers/tab";
import { verifyUser } from "../lib/users";

interface TabPageProp {
  Key: string;
  SongMeta: SongMetaDetails;
  Song: Song;
  onSongRefresh: () => void;
  onSongUpdate: (updatedSong: Song) => void;
  onSongSave: () => void;
}

export default function SongPage(props: TabPageProp) {
  const uniqueSongChords = getAllParts(true, ["chord"]);
  const partList = getAllParts();
  const origSong = props.Song;

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [activeChord, setActiveChord] = useState<string>("");
  const [hoveredChord, setHoveredChord] = useState<string>("");
  const [settings, setSettings] = useState<Setting>({
    "hidden-mode": getSettingsFromStore("hidden-mode", false),
    "show-chord-popup": getSettingsFromStore("show-chord-popup", false),
    autoscroll: getSettingsFromStore("autoscroll", true),
    editing: false,
    recording: false,
    countdown: getSettingsFromStore("countdown", true),
    transpose: 0,
  });
  const [capo, setCapo] = useState(props.Song.Capo ?? 0);
  const [width, setWidth] = useState<number>(window.innerWidth);

  const [allowEdit, setAllowEdit] = useState<boolean>(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width < 769;

  useEffect(() => {
    if (currentTime == 0) return;

    const timings = props.Song.Timings;
    if (!timings) return;

    const index = [...timings]
      .reverse()
      .findIndex((time) => time < currentTime);

    setHighlightedIndex(timings.length - index - 1);
  }, [currentTime, props.Song.Timings]);

  useEffect(() => {
    const chordEl = document.getElementById(`chord-${highlightedIndex}`);

    if (chordEl && settings.autoscroll)
      chordEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedIndex]);

  useEffect(() => {
    if (!props.Song.Capo) return;

    const transpose = settings["transpose"] as number;

    setCapo(props.Song.Capo - transpose);
  }, [settings["transpose"]]);

  const onSettingChange = (
    setting?: Setting,
    saveToStorage: boolean = true
  ) => {
    if (!setting) return;

    setSettings({ ...settings, ...setting });

    if (!saveToStorage) return;

    const key = Object.keys(setting)[0];
    writeSettingToStore(key, setting[key].toString());
  };

  const getTabByName = (tabName: string) => {
    return props.Song.Tabs ? props.Song.Tabs[tabName] : [];
  };

  const getSongTimings = () => props.Song.Timings ?? [];

  const removeLatestSongTiming = () => {
    const timings = props.Song.Timings ? [...props.Song.Timings] : [];
    if (timings.length == 0) return [];

    timings.pop();
    return timings;
  };

  useEffect(() => {
    const localUser = verifyUser();
    if (!localUser) return;

    setAllowEdit(localUser.permissionLevel == "admin");
  });

  return (
    <div className={styles.container}>
      <title>
        {props.SongMeta.Name} - {props.SongMeta.Artist}
      </title>
      <div className={styles.songContainer}>
        <h1>{props.SongMeta?.Name}</h1>
        <h2>{props.SongMeta?.Artist}</h2>
        {capo > 0 && <h3>Capo: {capo}</h3>}
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
      {!isMobile && (
        <>
          {activeChord && determineType(activeChord) == "chord" && (
            <DraggableContainer
              containerId="chord-diagram-active"
              width={10}
              minWidth={130}
              icon={<LibraryMusicIcon />}
              minimisable
            >
              <ChordDiagram chord={activeChord} />
            </DraggableContainer>
          )}
          {activeChord && determineType(activeChord) == "tab" && (
            <DraggableContainer
              containerId="tab-diagram-active"
              width={30}
              minWidth={30}
            >
              <Tab
                tabSections={getTabByName(activeChord)}
                tabName={activeChord}
                refreshTabs
              />
            </DraggableContainer>
          )}
          {hoveredChord && determineType(hoveredChord) == "chord" && (
            <DraggableContainer
              containerId="chord-diagram-hover"
              width={10}
              minWidth={130}
            >
              <ChordDiagram chord={hoveredChord} />
            </DraggableContainer>
          )}
          {hoveredChord && determineType(hoveredChord) == "tab" && (
            <DraggableContainer
              containerId="tab-diagram-hover"
              width={30}
              minWidth={30}
            >
              <Tab
                tabSections={getTabByName(hoveredChord)}
                tabName={hoveredChord}
                refreshTabs
              />
            </DraggableContainer>
          )}
          <DraggableContainer
            containerId="settings"
            title="Settings"
            width={11}
            minWidth={200}
            icon={<SettingsIcon />}
            minimisable
          >
            <div>
              <SettingToggle
                value={{ "hidden-mode": settings["hidden-mode"] }}
                onSettingChange={(setting) => onSettingChange(setting)}
                settingText="Hidden Mode"
                type="checkbox"
              />
              <SettingToggle
                value={{ ["autoscroll"]: settings["autoscroll"] }}
                onSettingChange={(setting) => onSettingChange(setting)}
                settingText="Autoscroll"
                type="checkbox"
              />
              {allowEdit && (
                <SettingToggle
                  value={{ ["editing"]: settings["editing"] }}
                  onSettingChange={(setting) => onSettingChange(setting, false)}
                  settingText="TODO: Edit Mode"
                  type="checkbox"
                />
              )}
              {/* <SettingToggle
                value={{ ["recording"]: settings["recording"] }}
                onSettingChange={(setting) => onSettingChange(setting, false)}
                settingText="TODO: Recording Mode"
                type="checkbox"
              /> */}
              {/* <SettingToggle
                value={{ ["transpose"]: settings["transpose"] }}
                onSettingChange={(setting) => onSettingChange(setting)}
                settingText="TODO: Fix the Transpose"
                type="spinner"
                optionsValues={[-1, 1]}
              /> */}
              {settings["editing"] && (
                <SettingToggle
                  onSettingChange={props.onSongRefresh}
                  settingText="Refresh Song"
                  type="button"
                />
              )}
            </div>
          </DraggableContainer>
          {settings.editing && (
            <DraggableContainer
              containerClassName={styles.editContainer}
              containerId="edit"
              title="Editing"
              width={20}
              minWidth={20}
            >
              <>
                <div className={styles.editBody}>{writeChordsAndTimings()}</div>
                <div className={styles.editFooter}>
                  <button
                    onClick={() =>
                      props.onSongUpdate({
                        ...props.Song,
                        Timings: [...getSongTimings(), currentTime],
                      })
                    }
                  >
                    Add Current
                  </button>
                  <button
                    onClick={() =>
                      props.onSongUpdate({
                        ...props.Song,
                        Timings: [...removeLatestSongTiming()],
                      })
                    }
                  >
                    Remove Latest
                  </button>
                  <button onClick={props.onSongSave}>Save</button>
                  <button
                    onClick={() => {
                      onSettingChange({ ["editing"]: false });
                      props.onSongUpdate(origSong);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            </DraggableContainer>
          )}
          {settings.recording && (
            <DraggableContainer
              containerId="recording"
              title="Record"
              width={10}
              minWidth={150}
            >
              <>
                <button>Start</button>
                <button>Pause</button>
                <button>Stop</button>
              </>
            </DraggableContainer>
          )}
          {settings.countdown && showCountdown()}
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
        </>
      )}
      {isMobile && (
        <div className={styles.mobile}>
          {getCountdown() >= 0 && getCountdown() <= 5 && (
            <Popup className={styles.popup}>
              <h3> {getCountdown().toFixed(1)}s </h3>
            </Popup>
          )}
          {activeChord && settings["show-chord-popup"] && (
            <Popup className={styles.popup}>
              <ChordDiagram chord={activeChord} />
            </Popup>
          )}
          <VideoEmbed
            embedId={props.Song.Link}
            onTimeChange={(val) => setCurrentTime(val)}
            isMobile={true}
            className={styles.videoEmbed}
            extraSettings={
              <>
                <SettingToggle
                  value={{ "hidden-mode": settings["hidden-mode"] }}
                  onSettingChange={(setting) => onSettingChange(setting)}
                  settingText="Hidden Mode"
                  type="checkbox"
                />
                <SettingToggle
                  value={{ ["autoscroll"]: settings["autoscroll"] }}
                  onSettingChange={(setting) => onSettingChange(setting)}
                  settingText="Autoscroll"
                  type="checkbox"
                />
                <SettingToggle
                  value={{ ["show-chord-popup"]: settings["show-chord-popup"] }}
                  onSettingChange={(setting) => onSettingChange(setting)}
                  settingText="Show Chord Popup"
                  type="checkbox"
                />
                <SettingToggle
                  value={{ ["transpose"]: settings["transpose"] }}
                  onSettingChange={(setting) => onSettingChange(setting)}
                  settingText="Transpose"
                  type="spinner"
                  optionsValues={[-1, 1]}
                />
              </>
            }
          />
        </div>
      )}
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
                <div className={styles.wordGroup} key={wordIndex}>
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
                            transpose={settings["transpose"] as number}
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

  function writeChordsAndTimings() {
    let wordCount = -1;
    const timings = props.Song.Timings;
    const sections = partList.filter((part) => part.type == "section");

    return sections.map((section: PartObj, sectionIndex: number) => {
      const lines = partList.filter(
        (part) => part.type == "line" && part.sectionId == sectionIndex
      );

      return lines.map((line: PartObj, lineIndex: number) => {
        const words = partList.filter(
          (part) =>
            (part.type == "chord" || part.type == "tab") &&
            part.lineId == lineIndex &&
            part.sectionId == sectionIndex
        );
        return (
          <div key={lineIndex} className={styles.editLine}>
            {words.map((word: PartObj, wordIndex: number) => {
              wordCount++;
              return (
                <>
                  <Chord
                    key={wordCount}
                    chordName={word.text}
                    chordTiming={timings ? timings[wordCount] : undefined}
                    isChordNameVisible
                    currentActiveChord={word.chordId == highlightedIndex}
                    className={styles.songChord}
                    chordId={word.chordId ?? undefined}
                    // onChordActive={(chord: string) =>
                    //   setActiveChord(chord)
                    // }
                    // onChordHighlight={(chord: string) =>
                    //   setHoveredChord(chord)
                    // }
                    transpose={settings["transpose"] as number}
                  />
                </>
              );
            })}
          </div>
        );
      });
    });
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
              transpose={settings["transpose"] as number}
            />
          );
        })}
      </div>
    );
  }

  function getCountdown() {
    if (
      !props.Song.Timings ||
      props.Song.Timings.length == 0 ||
      currentTime > props.Song.Timings[0]
    )
      return -1;

    let timeTillFirstChord = currentTime - props.Song.Timings[0];
    timeTillFirstChord = Math.abs(timeTillFirstChord);

    if (timeTillFirstChord > 5) return -1;
    return timeTillFirstChord;
  }

  function showCountdown() {
    const timeTillFirstChord = getCountdown();
    if (timeTillFirstChord <= -1 || timeTillFirstChord > 5) return <></>;

    return (
      <DraggableContainer
        containerId="countdown"
        title="Countdown"
        width={1}
        minWidth={150}
        icon={<AlarmIcon />}
        minimisable
      >
        <h1 style={{ textAlign: "center" }}>
          {timeTillFirstChord.toFixed(1)}s
        </h1>
      </DraggableContainer>
    );
  }
}
