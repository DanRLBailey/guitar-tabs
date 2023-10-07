import styles from "../../styles/containers/InputComponent.module.scss";

interface InputProp {
  type: string;
  value: string | number | undefined;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  heading?: string;
}

export default function InputComponent(props: InputProp) {
  return (
    <div className={styles.inputComponentContainer}>
      {props.heading && <h3>{props.heading}</h3>}
      <input
        type={props.type}
        placeholder={props.heading}
        value={props.value}
        onChange={props.onValueChange}
      />
    </div>
  );
}
