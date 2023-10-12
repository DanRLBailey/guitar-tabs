import { useEffect, useState } from "react";
import styles from "../../styles/containers/Tab.module.scss";
import { TabItem } from "../../types/interfaces";
import EditableSpan from "./editableSpan";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface TabProp {
  tabSections: TabItem[];
  tabName: string;
  editable?: boolean;
  maxCols?: number;
  onTabChanged?: (newTab: TabItem[]) => void;
  refreshTabs?: boolean;
  beatsToBar?: number;
}

export default function Tab(props: TabProp) {
  const strings: string[] = ["e", "B", "G", "D", "A", "E"];
  const maxCols: number = props.maxCols ?? 32;
  const beatsToBar: number = props.beatsToBar ?? 8;

  const [tabCols, setTabCols] = useState<TabItem[]>(props.tabSections);
  const [resetSpans, setResetSpans] = useState<boolean>(true);
  const [currentSpan, setCurrentSpan] = useState<number>(-1);

  const editTabHeading = (newHeading: string, tabIndex: number) => {
    const tabs = [...tabCols];
    tabs[tabIndex].Chord = newHeading;
    setTabCols(tabs);
  };

  const editTabNotes = (newNote: string, tabIndex: number) => {
    const tabs = [...tabCols];
    const tab = tabs[tabIndex];

    if (tab.Notes.some((note) => note[0] == newNote[0])) {
      const index = tab.Notes.findIndex((note) => note[0] == newNote[0]);

      if (newNote.length == 1) {
        tab.Notes.splice(index, 1);
      } else {
        tab.Notes[index] = newNote;
      }
    } else if (newNote.length > 1) {
      tab.Notes.push(newNote);
    }

    setTabCols(tabs);
  };

  const removeLatestTabColumn = () => {
    const cols = [...tabCols];
    if (cols.length == 0) return [];
    console.log(cols);

    cols.pop();
    setTabCols(cols);

    setCurrentSpan(-1);
  };

  useEffect(() => {
    if (props.onTabChanged) props.onTabChanged(tabCols);
  }, [tabCols]);

  useEffect(() => {
    if (props.refreshTabs) setTabCols(props.tabSections);
  }, [props.tabSections]);

  useEffect(() => {
    if (!resetSpans) return;
    setResetSpans(false);
  }, [resetSpans]);

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabHeading}>
        <h3>{props.tabName}</h3>
        {props.editable && (
          <>
            <span onClick={removeLatestTabColumn}>
              <RemoveIcon />
            </span>
            <span
              onClick={() => {
                if (tabCols.length < maxCols)
                  setTabCols([
                    ...tabCols,
                    {
                      Beat: tabCols.length + 1,
                      Notes: [],
                      Chord: "",
                    },
                  ]);
                setCurrentSpan(-1);
              }}
            >
              <AddIcon />
            </span>
          </>
        )}
      </div>
      <div className={styles.tab}>
        <div className={styles.tabColumn}>
          {["", ...strings].map((item, index) => {
            if (index == 0)
              return (
                <span key={index} className={styles.heading}>
                  {item}
                </span>
              );
            return <span key={index}>{item}</span>;
          })}
        </div>
        {tabCols.map((tab, colIndex) => {
          return (
            <div
              key={colIndex}
              className={styles.tabColumn}
              style={
                colIndex % beatsToBar == 0
                  ? { borderLeft: "1px solid white" }
                  : {}
              }
            >
              {props.editable && (
                <EditableSpan
                  value={tab.Chord != "" ? tab.Chord : ""}
                  isEditing={currentSpan == colIndex + 1}
                  className={styles.heading}
                  onSpanEdited={(val) => editTabHeading(val, colIndex)}
                  defaultSpan=""
                  spanIndex={colIndex + 1}
                  onStartEditing={(index) => setCurrentSpan(index)}
                />
              )}
              {!props.editable && (
                <span className={styles.heading}>
                  {tab.Chord != "" ? tab.Chord : ""}
                </span>
              )}
              {strings.map((string, strIndex) => {
                return props.editable ? (
                  <EditableSpan
                    key={strIndex}
                    value={
                      tab.Notes.some((note) => note[0] == string)
                        ? (tab.Notes.find((note) => note[0] == string)?.replace(
                            string,
                            ""
                          ) as string)
                        : "-"
                    }
                    isEditing={
                      currentSpan ==
                      parseInt(`${colIndex + 1}${strIndex + 1}${strIndex + 1}`)
                    }
                    onSpanEdited={(val) =>
                      editTabNotes(`${string}${val}`, colIndex)
                    }
                    defaultSpan="-"
                    spanIndex={parseInt(
                      `${colIndex + 1}${strIndex + 1}${strIndex + 1}`
                    )}
                    onStartEditing={(index) => setCurrentSpan(index)}
                  />
                ) : (
                  <span>
                    {tab.Notes.some((note) => note[0] == string)
                      ? (tab.Notes.find((note) => note[0] == string)?.replace(
                          string,
                          ""
                        ) as string)
                      : "-"}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
