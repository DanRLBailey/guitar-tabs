import styles from "../styles/SettingToggle.module.scss";
import { useState } from "react";
import { Setting } from "../types/interfaces";
import CheckBox from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";

interface SettingToggleProp {
  initialValue: Setting;
  onSettingChange: (setting: Setting) => void;
  settingText: string;
  optionsValues?: string[] | number[];
  type: "checkbox" | "radio";
}

export default function SettingToggle(props: SettingToggleProp) {
  const key = Object.keys(props.initialValue)[0];
  const [setting, setSetting] = useState<Setting>(props.initialValue);

  const handleSettingChange = (value?: string | number) => {
    const newValue = { ...setting };
    newValue[key] = value ? value : !newValue[key];

    setSetting(newValue);
    props.onSettingChange(newValue);
  };

  return (
    <>
      <button
        className={styles.settingToggle}
        onClick={() => (props.type == "checkbox" ? handleSettingChange() : "")}
      >
        <span>{props.settingText}:</span>
        {props.type == "checkbox" && (
          <>
            {setting[key] && <CheckBox />}
            {!setting[key] && <CheckBoxOutlineBlank />}
          </>
        )}
        {props.type == "radio" && (
          <>
            {props.optionsValues &&
              props.optionsValues.map(
                (item: string | number, index: number) => {
                  return (
                    <span
                      key={index}
                      className={`${styles.radioItem} ${
                        setting[key] == item ? styles.active : ""
                      }`}
                      onClick={() => handleSettingChange(item)}
                    >
                      {item}x
                    </span>
                  );
                }
              )}
          </>
        )}
      </button>
    </>
  );
}
