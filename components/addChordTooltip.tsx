import { useState } from "react";
import styles from "../styles/AddChordTooltip.module.scss";

interface AddChordProp {
  onChordAdded: (chord: string) => void;
}

export default function AddChordTooltip(props: AddChordProp) {
  const [chord, setChord] = useState("");

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setChord(val);
  };

  const onButtonClicked = () => {
    props.onChordAdded(chord);
    setChord("");
  };

  return (
    <div className={styles.container}>
      <input type="text" value={chord} onChange={handleValueChange}></input>
      <button onClick={onButtonClicked}>Add</button>
    </div>
  );
}
