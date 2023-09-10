import styles from "../styles/Overlay.module.scss";
import { Song } from "../types/interfaces";
import VideoEmbed from "./videoEmbed";

interface OverlayProps {
  children?: React.ReactElement | React.ReactElement[];
}
export default function Overlay(props: OverlayProps) {
  return (
    <div className={styles.overlayContainer}>
      {props.children && props.children}
    </div>
  );
}
