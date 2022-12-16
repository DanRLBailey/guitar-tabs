import styles from "../styles/Tab.module.scss";
import { TabItem } from "../types/interfaces";
import { useEffect, useState } from "react";

interface TabProp {
  tab: TabItem[];
}

export default function Tab(props: TabProp) {
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

  return (
    <div className={styles.container}>
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
        {props.tab.map((item: TabItem, index: number) => {
          return getStrings(item.Notes, item.Chord);
        })}
        <div className={styles.end} />
      </div>
    </div>
  );
}
