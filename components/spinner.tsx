import styles from "../styles/Spinner.module.scss";

interface SpinnerProp {
  className?: string;
  value: number;
  optionsValues: number[];
  onSpinnerChange: (value: number) => void;
}

export default function Spinner(props: SpinnerProp) {
  return (
    <div className={styles.spinnerContainer}>
      <span
        className={props.className}
        onClick={() => props.onSpinnerChange(props.optionsValues[0])}
      >
        {props.optionsValues[0]}
      </span>
      <span>{props.value}</span>
      <span
        className={props.className}
        onClick={() => props.onSpinnerChange(props.optionsValues[1])}
      >
        +{props.optionsValues[1]}
      </span>
    </div>
  );
}
