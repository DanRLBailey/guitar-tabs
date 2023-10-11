import { useEffect, useState } from "react";
import styles from "../../styles/addSong/AddSongTabs.module.scss";
import { Tab as TabObj, TabItem } from "../../types/interfaces";
import DraggableContainer from "../containers/draggableContainer";
import Tab from "../containers/tab";

import ViewListIcon from "@mui/icons-material/ViewList";

interface AddSongTabsProp {
  tabs: TabObj | null;
  onTabChanged: (newTab: TabObj) => void;
}

export default function AddSongTab(props: AddSongTabsProp) {
  const [tabs, setTabs] = useState<TabObj | null>(props.tabs);

  const handleTabChange = (newTabs: TabItem[], tabName: string) => {
    const newTab = { [tabName]: newTabs } as TabObj;
    props.onTabChanged(newTab);
  };

  useEffect(() => {
    setTabs(props.tabs);
  }, [props.tabs]);

  return (
    <DraggableContainer
      title="Add Tabs"
      containerId="addTabs"
      width={45}
      minWidth={45}
      maxHeight={50}
      minimisable
      icon={<ViewListIcon />}
      bodyClassName={styles.addTabBody}
    >
      <>
        {tabs &&
          Object.keys(tabs).map((name, index) => {
            return (
              <div key={index}>
                <Tab
                  tabSections={tabs[name]}
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
