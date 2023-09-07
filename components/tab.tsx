import styles from "../styles/Tab.module.scss";
import { TabItem, Tab as TabType } from "../types/interfaces";
import { useEffect, useState } from "react";

interface TabProp {
  tab?: TabItem[];
  title?: string;
  editing?: boolean;
  onTabEdited?: (tabs: TabType) => void;
  onTabDeleted?: () => void;
}

export default function Tab(props: TabProp) {
  const [tabColumns, setTabColumns] = useState<TabItem[]>(props.tab ?? []);
  const [tabTitle, setTabTitle] = useState<string>(props.title ?? "");

  const getStrings = (notes: string[], chord?: string) => {
    let elements: JSX.Element[] = [];
    const strings = ["e", "B", "G", "D", "A", "E"];

    if (chord) elements.push(<div className={styles.fret}>{chord}</div>);
    else elements.push(<div className={styles.chordEmpty}>.</div>);

    strings.forEach((str: string) => {
      if (notes.some((n) => n[0] == str)) {
        notes.forEach((note: string) => {
          if (note[0] == str)
            elements.push(<span className={styles.fret}>{note.slice(1)}</span>);
        });
      } else {
        elements.push(<div className={`${styles.empty} ${styles.fret}`}></div>);
      }
    });

    return <div>{elements}</div>;
  };

  const onTabEdited = (
    val: string,
    tabItemIndex: number,
    rowIndex?: number
  ) => {
    let cols = [...tabColumns];
    let col = cols[tabItemIndex];
    col.Beat = tabItemIndex + 1;

    if (!parseInt(val)) col.Chord = val;
    if (!col.Notes) col.Notes = [];

    switch (rowIndex) {
      case 0:
        col.Notes = addNoteToArray(col.Notes, "e", val);
        break;
      case 1:
        col.Notes = addNoteToArray(col.Notes, "B", val);
        break;
      case 2:
        col.Notes = addNoteToArray(col.Notes, "G", val);
        break;
      case 3:
        col.Notes = addNoteToArray(col.Notes, "D", val);
        break;
      case 4:
        col.Notes = addNoteToArray(col.Notes, "A", val);
        break;
      case 5:
        col.Notes = addNoteToArray(col.Notes, "E", val);
        break;
    }

    setTabColumns(cols);
  };

  const addNoteToArray = (arr: string[], string: string, val: string) => {
    if (arr.some((str) => str.includes(string))) {
      const index = arr.findIndex((str) => str.includes(string));
      arr[index] = `${string}${val}`;
      return arr;
    }

    return [...arr, `${string}${val}`];
  };

  useEffect(() => {
    if (!props.onTabEdited) return;

    props.onTabEdited({
      [tabTitle]: [...tabColumns],
    });
  }, [tabColumns, tabTitle]);

  return (
    <div className={styles.container}>
      {props.editing && (
        <div className={styles.tabTitle}>
          <input
            placeholder="Title"
            value={tabTitle}
            onChange={(v) => setTabTitle(v.target.value)}
          ></input>
          <button
            onClick={() => {
              tabColumns?.pop();
              setTabColumns([...tabColumns]);
            }}
          >
            &#60;
          </button>
          <button
            onClick={() => {
              if (tabColumns.length < 16)
                setTabColumns([...tabColumns, {} as TabItem]);
            }}
          >
            &#62;
          </button>
          <button onClick={props.onTabDeleted}>Delete</button>
        </div>
      )}
      <div className={styles.tabContainer}>
        <div className={styles.strings}>
          <span className={styles.chordEmpty}>.</span>
          <span>e</span>
          <span>B</span>
          <span>G</span>
          <span>D</span>
          <span>A</span>
          <span>E</span>
        </div>
        {!props.editing &&
          props.tab &&
          props.tab.map((item: TabItem, index: number) => {
            return getStrings(item.Notes, item.Chord);
          })}
        {props.editing && (
          <div className={styles.newTab}>
            {tabColumns.map((tabItem: TabItem, colIndex: number) => {
              return (
                <div key={colIndex} className={styles.tabItem}>
                  <input
                    onChange={(val) => onTabEdited(val.target.value, colIndex)}
                  ></input>
                  {["e", "B", "G", "D", "A", "E"].map(
                    (rowItem: string, rowIndex: number) => {
                      const x = () => {
                        const index = tabItem.Notes.findIndex((note) =>
                          note.includes(rowItem)
                        );
                        return tabItem.Notes[index][1];
                      };

                      return (
                        <input
                          key={rowIndex}
                          type="number"
                          placeholder={
                            tabItem.Notes &&
                            tabItem.Notes.some((note) => note.includes(rowItem))
                              ? x()
                              : "------"
                          }
                          onChange={(val) =>
                            onTabEdited(val.target.value, colIndex, rowIndex)
                          }
                        ></input>
                      );
                    }
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div className={styles.end} />
      </div>
    </div>
  );
}
