import { useState } from "react";
import styles from "../../styles/addSong/AddSongTabs.module.scss";
import { Tab as TabObj, TabItem } from "../../types/interfaces";
import DraggableContainer from "../containers/draggableContainer";
import Tab from "../containers/tab";

import ViewListIcon from "@mui/icons-material/ViewList";

interface AddSongTabsProp {
  tabNames: string[];
  onTabChanged: (newTab: TabObj) => void;
}

export default function AddSongTab(props: AddSongTabsProp) {
  const handleTabChange = (newTabs: TabItem[], tabName: string) => {
    const newTab = { [tabName]: newTabs } as TabObj;
    props.onTabChanged(newTab);
  };

  return (
    <DraggableContainer
      title="Add Tabs"
      containerId="addTabs"
      width={30}
      minWidth={30}
      maxHeight={50}
      ignoreLocal
      minimisable
      icon={<ViewListIcon />}
      bodyClassName={styles.addTabBody}
    >
      <>
        {props.tabNames.map((name, index) => {
          return (
            <div key={index}>
              <Tab
                tabSections={[]}
                tabName={name}
                onTabChanged={(newTabs) => handleTabChange(newTabs, name)}
                editable
              />
            </div>
          );
        })}
      </>
    </DraggableContainer>
  );
}
