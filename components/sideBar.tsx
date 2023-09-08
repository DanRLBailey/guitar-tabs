import styles from "../styles/SideBar.module.scss";
import { Song } from "../types/interfaces";
import VideoEmbed from "./videoEmbed";

interface SideBarProps {
  song: Song;
  onChordsHidden: (hidden: boolean) => void;
  children?: React.ReactElement;
  onTimeChange: (time: number) => void;
}
export default function SideBar(props: SideBarProps) {
  return (
    <div className={styles.sideBarContainer}>
      {props.children && props.children}
      <VideoEmbed
        embedId={props.song.Link}
        onChordsHidden={props.onChordsHidden}
        onTimeChange={props.onTimeChange}
      />
    </div>
  );
}
