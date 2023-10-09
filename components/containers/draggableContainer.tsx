import { useEffect, useRef, useState } from "react";
import styles from "../../styles/containers/DraggableContainer.module.scss";
import popupStyles from "../../styles/containers/Popup.module.scss";
import { Dimension } from "../../types/interfaces";

import DragHandleIcon from "@mui/icons-material/DragHandle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { writeSettingToStore } from "../../lib/localStore";

interface DraggableContainerProps {
  containerClassName?: string;
  bodyClassName?: string;
  containerId: string;
  pinned?: boolean;
  allowResize?: boolean;
  minimisable?: boolean;
  width: number;
  minWidth: number;
  maxHeight?: number;
  title?: string;
  children?: React.ReactElement;
  icon?: React.ReactElement;
  taskbarIndex?: number;
  ignoreLocal?: boolean;
}

export default function DraggableContainer(props: DraggableContainerProps) {
  const localPos = !props.ignoreLocal
    ? localStorage.getItem(`pos-${props.containerId}`)
    : "";
  const localMinimised = !props.ignoreLocal
    ? localStorage.getItem(`minimised-${props.containerId}`)
    : "";
  const ref = useRef<HTMLDivElement>(null);
  const padding = { x: 1.09, y: 1.7 };

  const [mousePos, setMousePos] = useState<Dimension>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<Dimension>({
    x: localPos ? JSON.parse(localPos).x : padding.x,
    y: localPos ? JSON.parse(localPos).y : padding.y,
  });
  const [offset, setOffset] = useState<Dimension>({ x: 0, y: 0 });
  const [prevOffset, setPrevOffset] = useState<Dimension>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<boolean>(false);

  const [minimised, setMinimised] = useState<boolean>(
    localMinimised ? localMinimised == "true" : false
  );

  const getTaskbarIndex = (containerId: string) => {
    if (!props.minimisable) return;

    const taskbarEls = document.getElementsByClassName(styles.taskbarIcon);
    const elArr = Array.from(taskbarEls);
    if (!elArr || elArr.length == 0) return;

    const containerIdName = `draggable-${containerId}-taskbar`;
    const index = elArr.findIndex((el) => el.id == containerIdName);

    return index;
  };

  const taskbarIndex = getTaskbarIndex(props.containerId);
  const taskbarPos = taskbarIndex ? taskbarIndex * 65 : 0;

  const taskbarIcon = (
    <div
      className={`${styles.draggableContainer} ${popupStyles.popupContainer} ${
        styles.taskbarIcon
      } ${!minimised ? styles.maximised : ""}`}
      id={`draggable-${props.containerId}-taskbar`}
      style={{
        bottom: `${16}px`,
        right: `${16 + taskbarPos}px`,
      }}
      onClick={() => setMinimised(!minimised)}
    >
      {props.icon}
    </div>
  );

  useEffect(() => {
    const percentagePosition = percentConvert(currentPos, true);

    setOffset({
      x: mousePos.x - percentagePosition.x,
      y: mousePos.y - percentagePosition.y,
    });

    const handleMouseMove = (event: MouseEvent) => {
      const mousePos = { x: event.clientX, y: event.clientY };
      setMousePos(mousePos);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", (e) => handleMouseMove);
    };
  }, [dragging]);

  useEffect(() => {
    if (!dragging) {
      setPrevOffset(offset);
      return;
    }
    if (prevOffset == offset) return;

    const absolutePosition = {
      x: mousePos.x - offset.x,
      y: mousePos.y - offset.y,
    };

    const percentPosition = percentConvert(absolutePosition);
    setCurrentPos(percentPosition);

    writeSettingToStore(
      `pos-${props.containerId}`,
      `{"x": ${percentPosition.x}, "y": ${percentPosition.y}}`
    );
  }, [mousePos, dragging]);

  useEffect(() => {
    writeSettingToStore(`minimised-${props.containerId}`, minimised.toString());
  }, [minimised]);

  const percentConvert = (pos: Dimension, reverse?: boolean) => {
    const win = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let dimensions: Dimension = {
      width: 0,
      height: 0,
    };

    if (ref.current)
      dimensions = {
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      };

    var padding = 16; //1rem

    const clampedPos = {
      x:
        pos.x < padding
          ? padding
          : pos.x + dimensions.width > win.width - padding
          ? win.width - dimensions.width - padding
          : pos.x,
      y:
        pos.y < padding
          ? padding
          : pos.y + dimensions.height > win.height - padding
          ? win.height - dimensions.height - padding
          : pos.y,
    };

    const percentPos = {
      x: !reverse
        ? (clampedPos.x / win.width) * 100
        : (currentPos.x / 100) * win.width,
      y: !reverse
        ? (clampedPos.y / win.height) * 100
        : (currentPos.y / 100) * win.height,
    };

    return percentPos;
  };

  return (
    <>
      {!minimised && (
        <div
          className={`${styles.draggableContainer} ${popupStyles.popupContainer} ${props.containerClassName}`}
          id={`draggable-${props.containerId}`}
          style={{
            top: `${currentPos.y}%`,
            left: `${currentPos.x}%`,
            width: `${props.width}%`,
            minWidth: props.minWidth,
            maxHeight: `${props.maxHeight ?? 96.5}%`,
            userSelect: dragging ? "none" : "auto",
          }}
          onMouseUp={() => {
            setDragging(false);
          }}
          onMouseLeave={() => {
            setDragging(false);
          }}
          ref={ref}
        >
          <div className={styles.header}>
            {props.minimisable && (
              <div
                className={styles.minimise}
                onClick={() => setMinimised(!minimised)}
              >
                <ExpandMoreIcon />
              </div>
            )}
            <div className={styles.drag} onMouseDown={() => setDragging(true)}>
              <DragHandleIcon />
              {props.title && <h4>{props.title}</h4>}
            </div>
          </div>
          <div className={`${styles.body} ${props.bodyClassName}`}>
            {props.children}
          </div>
        </div>
      )}
      <div>{props.minimisable && taskbarIcon}</div>
    </>
  );
}
