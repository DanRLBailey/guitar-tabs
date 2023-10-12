import { useEffect, useState } from "react";
import styles from "../../styles/containers/Toaster.module.scss";
import Toast from "./toast";

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
          <Toast
            key={toastIndex}
            toastIndex={toastIndex}
            toast={toast}
            onToastClick={() => removeToast(toastIndex)}
          />
        );
      })}
    </div>
  );
}
