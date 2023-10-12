import { useEffect, useState } from "react";
import styles from "../../styles/containers/EditableSpan.module.scss";

interface EditableSpanProp {
  value: string;
  isEditing: boolean;
  className?: string;
  onSpanEdited?: (newValue: string) => void;
  onStartEditing: (index: number) => void;
  defaultSpan: string;
  spanIndex: number;
}

export default function EditableSpan(props: EditableSpanProp) {
  const [value, setValue] = useState<string>(props.value);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const onStartEditing = () => {
    setIsEditing(true);
    props.onStartEditing(props.spanIndex);
  };

  const onFinishedEditing = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      setIsEditing(false);
      if (value == "") setValue(props.defaultSpan);
      if (props.onSpanEdited) props.onSpanEdited(value);
    }
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setIsEditing(props.isEditing);
    if (value == "") setValue(props.defaultSpan);
    if (props.onSpanEdited) props.onSpanEdited(value);
  }, [props.isEditing]);

  useEffect(() => {
    if (isEditing && value == "-") setValue("");
  }, [isEditing]);

  if (isEditing)
    return (
      <div className={`${styles.editableSpanContainer} ${props.className}`}>
        <input
          type="text"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onFinishedEditing}
          value={value}
          autoFocus
        />
      </div>
    );

  return (
    <div className={`${styles.editableSpanContainer} ${props.className}`}>
      <span onClick={onStartEditing}>{value}</span>
    </div>
  );
}
