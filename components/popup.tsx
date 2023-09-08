import styles from "../styles/Popup.module.scss";

interface PopupProps {
  className?: string;
  children: React.ReactElement;
}

export default function Popup(props: PopupProps) {
  return (
    <div className={`${styles.popupContainer ?? ""} ${props.className ?? ""}`}>
      {props.children && props.children}
    </div>
  );
}
