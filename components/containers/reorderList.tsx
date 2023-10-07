import { useEffect, useState } from "react";
import styles from "../../styles/containers/ReorderList.module.scss";
import { Dimension } from "../../types/interfaces";

import DragHandleIcon from "@mui/icons-material/DragHandle";
import ClearIcon from "@mui/icons-material/Clear";

interface ReorderListProp {
  listItems: React.ReactElement[];
  className?: string;
  onReorder?: (elements: React.ReactElement[]) => void;
}

export default function ReorderList(props: ReorderListProp) {
  const [listItems, setListItems] = useState<React.ReactElement[]>(
    props.listItems
  );
  const [mousePos, setMousePos] = useState<Dimension>({ x: 0, y: 0 });
  const [currentDragItem, setCurrentDragItem] = useState<number>(-1);
  const [hovered, setHovered] = useState<number>(-1);
  const [hoveredType, setHoveredType] = useState<string>("");

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mousePos = { x: event.clientX, y: event.clientY };
      setMousePos(mousePos);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", (e) => handleMouseMove);
    };
  }, []);

  const orderItem = () => {
    if (currentDragItem == -1) return;

    const newIndex = document
      .elementFromPoint(mousePos.x, mousePos.y)
      ?.closest(`div.${styles.listItem}`)
      ?.getAttribute("data-listOrder");

    const tempParts = [...listItems];
    const line = tempParts[currentDragItem];

    if (!newIndex) return;
    tempParts.splice(currentDragItem, 1);
    tempParts.splice(parseInt(newIndex), 0, line);
    setListItems(tempParts);

    if (props.onReorder) props.onReorder(tempParts);

    setCurrentDragItem(-1);
  };

  const removeItemFromList = (index: number) => {
    const tempParts = [...listItems];
    tempParts.splice(index, 1);
    setListItems(tempParts);
    if (props.onReorder) props.onReorder(tempParts);
  };

  useEffect(() => {
    setListItems(props.listItems);
  }, [props.listItems]);

  return (
    <div className={styles.reorderListContainer}>
      {listItems.map((item, index) => {
        return (
          <>
            <div
              key={index}
              className={`${styles.listItem} ${props.className} ${
                currentDragItem == index ? styles.active : ""
              } ${
                hovered == index
                  ? hoveredType == "delete"
                    ? styles.delete
                    : styles.reorder
                  : ""
              }`}
              style={{ top: mousePos.y - 10 }}
              onMouseUp={() => orderItem()}
              onMouseEnter={() => {
                setHovered(index);
                setHoveredType("reorder");
              }}
              onMouseLeave={() => {
                setHovered(-1);
                setHoveredType("");
              }}
              data-listOrder={index}
            >
              <div
                onMouseDown={() => setCurrentDragItem(index)}
                className={styles.beginning}
              >
                <DragHandleIcon fontSize="small" />
              </div>
              {item}
              {currentDragItem != index && (
                <div
                  className={styles.ending}
                  onClick={() => removeItemFromList(index)}
                  onMouseEnter={() => {
                    setHovered(index);
                    setHoveredType("delete");
                  }}
                  onMouseLeave={() => {
                    setHovered(-1);
                    setHoveredType("");
                  }}
                >
                  <ClearIcon fontSize="small" />
                </div>
              )}
            </div>
            {currentDragItem == index && (
              <div
                key={index}
                className={`${styles.listItem} ${styles.ghost}`}
                onMouseUp={() => orderItem()}
                data-listOrder={index}
              >
                <div className={styles.beginning}>
                  <DragHandleIcon fontSize="small" />
                </div>
                {item}
                <div className={styles.ending}>
                  <ClearIcon fontSize="small" />
                </div>
              </div>
            )}
          </>
        );
      })}
    </div>
  );
}
