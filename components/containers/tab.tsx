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
}

export default function Tab(props: TabProp) {
  const strings: string[] = ["e", "B", "G", "D", "A", "E"];
  const maxCols: number = props.maxCols ?? 16;

  const [tabCols, setTabCols] = useState<TabItem[]>(props.tabSections);

  const getDataFromTab = (tab: TabItem, tabIndex: number) => {
    let spans: React.ReactElement[] = [];

    spans.push(
      props.editable ? (
        <EditableSpan
          value={tab.Chord != "" ? tab.Chord : ""}
          isEditing={false}
          className={styles.heading}
          onSpanEdited={(val) => editTabHeading(val, tabIndex)}
          defaultSpan=""
        />
      ) : (
        <span className={styles.heading}>
          {tab.Chord != "" ? tab.Chord : ""}
        </span>
      )
    );

    strings.map((string, index) => {
      spans.push(
        props.editable ? (
          <EditableSpan
            value={
              tab.Notes.some((note) => note[0] == string)
                ? (tab.Notes.find((note) => note[0] == string)?.replace(
                    string,
                    ""
                  ) as string)
                : "-"
            }
            isEditing={false}
            onSpanEdited={(val) => editTabNotes(`${string}${val}`, tabIndex)}
            defaultSpan="-"
            key={index}
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
        )
      );
    });

    return spans;
  };

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
  };

  useEffect(() => {
    if (props.onTabChanged) props.onTabChanged(tabCols);
  }, [tabCols]);

  useEffect(() => {
    if (props.refreshTabs) setTabCols(props.tabSections);
  }, [props.tabSections]);

  return (
    <div className={styles.tabContainer}>
      <h3>{props.tabName}</h3>
      <div className={styles.tab}>
        <div>
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
        {tabCols.map((tab, tabIndex) => {
          return <div key={tabIndex}>{getDataFromTab(tab, tabIndex)}</div>;
        })}
        {props.editable && (
          <div className={styles.ending}>
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
              }}
            >
              <AddIcon />
            </span>
            <span onClick={removeLatestTabColumn}>
              <RemoveIcon />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
