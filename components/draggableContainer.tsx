import { useEffect, useRef, useState } from "react";
import styles from "../styles/DraggableContainer.module.scss";
import popupStyles from "../styles/Popup.module.scss";
import { Dimension } from "../types/interfaces";

import DragHandleIcon from "@mui/icons-material/DragHandle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface DraggableContainerProps {
  containerId: string;
  pinned?: boolean;
  allowResize?: boolean;
  collapsable?: boolean;
  width: number;
  minWidth: number;
  title?: string;
  children?: React.ReactElement;
}

export default function DraggableContainer(props: DraggableContainerProps) {
  const localPos = localStorage.getItem(`pos-${props.containerId}`);
  const localExpand = localStorage.getItem(`expand-${props.containerId}`);
  const ref = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState<Dimension>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<Dimension>({
    x: localPos ? JSON.parse(localPos).x : 0,
    y: localPos ? JSON.parse(localPos).y : 0,
  });
  const [offset, setOffset] = useState<Dimension>({ x: 0, y: 0 });
  const [prevOffset, setPrevOffset] = useState<Dimension>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<boolean>(false);

  const [expanded, setExpanded] = useState<boolean>(
    localExpand ? localExpand == "true" : true
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

    localStorage.setItem(
      `pos-${props.containerId}`,
      `{"x": ${percentPosition.x}, "y": ${percentPosition.y}}`
    );
  }, [mousePos, dragging]);

  useEffect(() => {
    localStorage.setItem(`expand-${props.containerId}`, expanded.toString());
  }, [expanded]);

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
      <div
        className={`${styles.draggableContainer} ${popupStyles.popupContainer}`}
        id={`draggable-${props.containerId}`}
        style={{
          top: `${currentPos.y}%`,
          left: `${currentPos.x}%`,
          width: `${props.width}%`,
          minWidth: props.minWidth,
        }}
        onMouseUp={() => {
          setDragging(false);
        }}
        ref={ref}
      >
        <div className={styles.header}>
          <div className={styles.drag} onMouseDown={() => setDragging(true)}>
            <DragHandleIcon />
            {props.title && <h4>{props.title}</h4>}
          </div>
          {props.collapsable && (
            <div onClick={() => setExpanded(!expanded)}>
              {expanded && <ExpandLessIcon />}
              {!expanded && <ExpandMoreIcon />}
            </div>
          )}
        </div>
        {expanded && <div className={styles.body}>{props.children}</div>}
      </div>
    </>
  );
}
