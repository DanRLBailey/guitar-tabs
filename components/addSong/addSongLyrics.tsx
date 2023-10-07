import { useEffect, useRef, useState } from "react";
import styles from "../../styles/addSong/AddSongLyrics.module.scss";
import Popup from "../containers/popup";
import { Dimension, PartObj } from "../../types/interfaces";
import DraggableContainer from "../containers/draggableContainer";
import ReorderList from "../containers/reorderList";

interface AddSongLyricsProp {
  parts: string[];
  onPartsChange: (newParts: string[]) => void;
  currentLine: string;
  onCurrentLineChange: (newCurrentLine: string) => void;
  chords: string[];
  tabs: string[];
}

export default function AddSongLyrics(props: AddSongLyricsProp) {
  const popupOffset = { top: -60 };
  const popupRef = useRef<HTMLDivElement>(null);
  const newSections = [
    "Intro",
    "Verse",
    "Chorus",
    "Bridge",
    "Instrumental",
    "Solo",
    "Outro",
  ];

  const [popupPos, setPopupPos] = useState<Dimension>({
    top: -100,
    left: -100,
  });
  const [currentWord, setCurrentWord] = useState<number[]>([-1, -1]);
  const [currentWordType, setCurrentWordType] = useState<string>("");
  const [parts, setParts] = useState<string[]>(props.parts);
  const [listItems, setListItems] = useState<React.ReactElement[]>(
    getListItems()
  );

  const addNewSection = (text: string) => {
    props.onPartsChange([...parts, `[${text}]`]);
  };

  const addNewLines = () => {
    if (props.currentLine == "") return; //TODO: send error message?: "Text box empty"

    const newLines: string[] = props.currentLine.split("\n");

    props.onPartsChange([...parts, ...newLines]);
    props.onCurrentLineChange("");
  };

  const onWordPress = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    indeces: number[]
  ) => {
    const handleWord = () => {
      if (currentWord[0] == indeces[0] && currentWord[1] == indeces[1]) {
        resetPopup();
        return;
      }

      setCurrentWord([indeces[0], indeces[1]]);
      movePopup();
    };

    const movePopup = () => {
      const popup = {
        width: popupRef.current ? popupRef.current?.offsetWidth : 0,
        height: popupRef.current ? popupRef.current?.offsetHeight : 0,
      };

      const target = {
        top: event.currentTarget.offsetTop,
        left: event.currentTarget.offsetLeft,
        width: event.currentTarget.offsetWidth,
      };

      setPopupPos({
        top: target.top - popup.height * 1.1,
        left: Math.max(target.left + target.width / 2 - popup.width / 2, 0),
      });
    };

    const resetPopup = () => {
      setCurrentWord([-1, -1]);
      setPopupPos({
        top: -100,
        left: -100,
      });
    };

    handleWord();
  };

  const onPopupButtonPress = (chord: string) => {
    const partList = [...parts];
    const line = partList[currentWord[0]].split(" ");
    const word = line[currentWord[1]];

    line.splice(currentWord[1], 1, `${word}*${chord}`);
    partList.splice(currentWord[0], 1, line.join(" "));

    props.onPartsChange(partList);
  };

  const onChordPress = (lineId: number, wordId: number, chordId: number) => {
    const partList = [...parts];

    const line = partList[lineId].split(" ");
    let word = line[wordId];
    if (!word.startsWith("*")) {
      chordId++;
    }
    const wordParts = word.split("*");
    wordParts.splice(chordId, 1);

    word = wordParts.join("*");
    line[wordId] = word;
    partList[lineId] = line.join(" ");

    props.onPartsChange(partList);
  };

  const onListReorder = (elements: React.ReactElement[]) => {
    const list = elements.map((el) => {
      return getTextOfSongLine(el);
    });

    setParts(list);
  };

  const getTextOfSongLine = (songLine: React.ReactElement) => {
    const wordGroup: React.ReactElement[] = songLine.props.children;
    let words: string[] = [];

    wordGroup.forEach((group) => {
      const wordButton = group.props.children[1];
      words.push(wordButton.props.children);
    });

    return words.join(" ");
  };

  useEffect(() => {
    setParts(props.parts);
    setListItems(getListItems());
  }, [props.parts]);

  useEffect(() => {
    setListItems(getListItems());
  }, [parts, popupPos]);

  return (
    <div className={styles.addSongLyricsContainer}>
      <h1>Lyrics</h1>
      <div className={styles.lyrics}>
        <ReorderList
          listItems={listItems}
          onReorder={(els) => onListReorder(els)}
        />
      </div>
      <DraggableContainer
        bodyClassName={styles.addSectionContainer}
        title="New Lyrics"
        containerId="addLyrics"
        width={20}
        minWidth={20}
        ignoreLocal
      >
        <>
          <textarea
            placeholder="New Lyrics"
            onChange={(e) => props.onCurrentLineChange(e.target.value)}
            value={props.currentLine}
          ></textarea>
          <div className={styles.buttonContainer}>
            <button onClick={addNewLines}>Add</button>
            {newSections.map((section, index) => {
              return (
                <button key={index} onClick={() => addNewSection(section)}>
                  {section}
                </button>
              );
            })}
          </div>
        </>
      </DraggableContainer>
      {[...props.chords, ...props.tabs].length > 0 && (
        <Popup
          style={{
            position: "absolute",
            top: popupPos.top,
            left: popupPos.left,
          }}
          ref={popupRef}
        >
          <>
            {props.chords.map((chord, chordIndex) => {
              return (
                <button
                  key={chordIndex}
                  onClick={() => onPopupButtonPress(chord)}
                >
                  {chord}
                </button>
              );
            })}
            {props.tabs.map((tab, tabIndex) => {
              return (
                <button key={tabIndex} onClick={() => onPopupButtonPress(tab)}>
                  {tab}
                </button>
              );
            })}
          </>
        </Popup>
      )}
    </div>
  );

  function getListItems() {
    return parts.map((line: string, lineIndex: number) => {
      return (
        <div key={lineIndex} className={styles.songLine}>
          {line.split(" ").map((word, wordIndex) => {
            let wordString: string = "";
            const wordParts = word.split("*");

            if (!word.startsWith("*")) {
              wordString = wordParts[0];
              wordParts.shift();
            }

            return (
              <div key={wordIndex} className={styles.wordGroup}>
                <div className={styles.chordGroup}>
                  {wordParts.map((chord, chordIndex) => {
                    return (
                      <button
                        key={chordIndex}
                        onClick={() =>
                          onChordPress(lineIndex, wordIndex, chordIndex)
                        }
                      >
                        {chord}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={(e) => onWordPress(e, [lineIndex, wordIndex])}
                  className={`${
                    currentWord.length == 2 &&
                    currentWord[0] == lineIndex &&
                    currentWord[1] == wordIndex
                      ? styles.active
                      : ""
                  }`}
                >
                  {wordString}
                </button>
              </div>
            );
          })}
        </div>
      );
    });
  }
}
