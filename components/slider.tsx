import styles from "../styles/Slider.module.scss";

interface SliderProps {
  currentValue: number;
  maxValue: number;
  onSliderChange: (value: number) => void;
  icon?: React.ReactNode;
}

export default function Slider(props: SliderProps) {
  return (
    <>
      {props.icon && props.icon}
      <input
        className={styles.slider}
        type="range"
        min={0}
        max={props.maxValue}
        value={props.currentValue}
        onChange={(e) => props.onSliderChange(parseInt(e.target.value))}
      />
    </>
  );
}
