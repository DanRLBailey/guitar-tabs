import { ForwardRefRenderFunction, RefObject, forwardRef } from "react";
import styles from "../../styles/containers/Popup.module.scss";

interface PopupProps {
  className?: string;
  style?: {};
  children: React.ReactElement;
}
export type Ref = HTMLDivElement;

export default forwardRef<Ref, PopupProps>(function Popup(
  props: PopupProps,
  ref
) {
  return (
    <div
      className={`${styles.popupContainer ?? ""} ${props.className ?? ""}`}
      style={props.style}
      ref={ref}
    >
      {props.children && props.children}
    </div>
  );
});
