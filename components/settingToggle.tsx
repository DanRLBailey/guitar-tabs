import styles from "../styles/SettingToggle.module.scss";
import { useEffect, useState } from "react";
import { Setting } from "../types/interfaces";
import CheckBox from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";
import Spinner from "./spinner";

interface SettingToggleProp {
  value?: Setting;
  onSettingChange: (setting?: Setting) => void;
  settingText: string;
  optionsValues?: string[] | number[];
  type: "checkbox" | "radio" | "spinner" | "button";
}

export default function SettingToggle(props: SettingToggleProp) {
  const key = props.value ? Object.keys(props.value)[0] : "";
  const [setting, setSetting] = useState<Setting | null>(props.value ?? null);

  const handleSettingChange = (value?: string | number, addition?: boolean) => {
    if (!setting) return;

    const newValue = { ...setting };

    if (addition && typeof value == "number")
      newValue[key] = (newValue[key] as number) + value;
    else newValue[key] = value ? value : !newValue[key];

    setSetting(newValue);
    props.onSettingChange(newValue);
  };

  useEffect(() => {
    setSetting(props.value as Setting);
  }, [props.value]);

  return (
    <>
      <button
        className={`${styles.settingToggle} ${
          props.type == "checkbox" ? styles.toggle : ""
        } ${props.type == "button" ? `${styles.toggle} ${styles.button}` : ""}`}
        onClick={() =>
          props.type == "checkbox"
            ? handleSettingChange()
            : props.type == "button"
            ? props.onSettingChange()
            : ""
        }
      >
        <span>{props.settingText}</span>
        {props.type == "checkbox" && setting && (
          <>
            {setting[key] != "0" && <CheckBox />}
            {!setting[key] && <CheckBoxOutlineBlank />}
          </>
        )}
        {props.type == "radio" && setting && (
          <>
            {props.optionsValues &&
              props.optionsValues.map(
                (item: string | number, index: number) => {
                  return (
                    <span
                      key={index}
                      className={`${styles.radioItem} ${
                        setting[key] == item ? styles.active : ""
                      } ${styles.button}`}
                      onClick={() => handleSettingChange(item)}
                    >
                      {item}x
                    </span>
                  );
                }
              )}
          </>
        )}
        {props.type == "spinner" && props.optionsValues && setting && (
          <Spinner
            className={styles.button}
            value={setting[key] as number}
            optionsValues={props.optionsValues as number[]}
            onSpinnerChange={(value) => handleSettingChange(value, true)}
          />
        )}
      </button>
    </>
  );
}
