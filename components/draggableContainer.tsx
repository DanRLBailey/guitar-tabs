import { useEffect, useState } from "react";
import styles from "../styles/DraggableContainer.module.scss";

interface DraggableContainerProps {
  children?: React.ReactElement;
  containerName: string;
  pinned?: boolean;
}

interface Coordinate {
  x: number;
  y: number;
}

interface Size {
  x: number;
  y: number;
}

export default function DraggableContainer(props: DraggableContainerProps) {
  const [mousePos, setMousePos] = useState<Coordinate>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<Coordinate>({ x: 0, y: 0 });
  const [offset, setOffset] = useState<Coordinate>({ x: 0, y: 0 });
  const [oldOffset, setOldOffset] = useState<Coordinate>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<boolean>(false);

  const [resizing, setResizing] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mousePos = { x: event.clientX, y: event.clientY };
      setMousePos(mousePos);
    };

    setOffset({
      x: mousePos.x - currentPos.x,
      y: mousePos.y - currentPos.y,
    });

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dragging]);

  useEffect(() => {
    if (!dragging) {
      setOldOffset(offset);
      return;
    }

    if (oldOffset == offset) return;

    setCurrentPos({
      x: mousePos.x - offset.x,
      y: mousePos.y - offset.y,
    });
  }, [mousePos, dragging]);

  return (
    <>
      <div
        className={styles.draggableContainer}
        style={{
          top: currentPos.y,
          left: currentPos.x,
        }}
      >
        <div
          className={styles.header}
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => setDragging(false)}
        ></div>
        {props.children}
        <div className={styles.footer}>
          <div
            className={styles.resize}
            onMouseDown={() => setResizing(true)}
            onMouseUp={() => setResizing(false)}
          ></div>
        </div>
      </div>
    </>
  );
}
