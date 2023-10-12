import { useEffect, useState } from "react";
import styles from "../../styles/containers/Toast.module.scss";

interface ToastProp {
  toastIndex: number;
  toast: string;
  onToastClick: () => void;
}

export default function Toast(props: ToastProp) {
  const [toast, setToast] = useState<string>(props.toast);

  useEffect(() => {
    const timer = setTimeout(() => {
      props.onToastClick();
    }, 5000);
    return () => clearTimeout(timer);
  });

  return (
    <div className={styles.toastContainer} onClick={props.onToastClick}>
      {toast}
    </div>
  );
}
