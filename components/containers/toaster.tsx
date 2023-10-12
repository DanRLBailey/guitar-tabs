import { useEffect, useState } from "react";
import styles from "../../styles/containers/Toaster.module.scss";

interface ToasterProp {
  newToast?: string;
  onNewToastAdded: () => void;
}

export default function Toaster(props: ToasterProp) {
  const [toasts, setToasts] = useState<string[]>(
    props.newToast ? [props.newToast] : []
  );

  useEffect(() => {
    if (props.newToast) {
      setToasts([...toasts, props.newToast]);
      props.onNewToastAdded();
    }
  }, [props.newToast]);

  const removeToast = (index: number) => {
    const tempToasts = [...toasts];
    tempToasts.splice(index, 1);
    setToasts(tempToasts);
  };

  return (
    <div className={styles.toasterContainer}>
      {toasts.map((toast, toastIndex) => {
        return (
          <div
            key={toastIndex}
            className={styles.toast}
            onClick={() => removeToast(toastIndex)}
          >
            {toast}
          </div>
        );
      })}
    </div>
  );
}
