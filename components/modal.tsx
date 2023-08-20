import styles from "../styles/Modal.module.scss";
import { useEffect, useState } from "react";

interface ModalProp {
  title: String;
  onExit: () => void;
  body?: JSX.Element;
  footer?: JSX.Element;
}

export default function Modal(props: ModalProp) {
  return (
    <div className={styles.container}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h1>{props.title}</h1>
          <span onClick={props.onExit}>X</span>
        </div>
        <div className={styles.modalBody}>{props.body}</div>
        <div className={styles.modalFooter}>{props.footer}</div>
      </div>
    </div>
  );
}
