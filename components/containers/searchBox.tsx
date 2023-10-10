import { useEffect, useState } from "react";
import styles from "../../styles/containers/SearchBox.module.scss";

interface SearchBoxProp {
  searchResults: string[];
  onSelectedResultsChange: (results: string[]) => void;
  noOfResults?: number;
  allowMultiSelect?: boolean;
  allowCustomResult?: boolean;
  allowDuplicates?: boolean;
  heading?: string;
}

export default function SearchBox(props: SearchBoxProp) {
  const [textVal, setTextVal] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);

  const onTextValChange = (newVal: string) => {
    setTextVal(newVal);

    const res = props.searchResults
      .filter((item) => item.toLowerCase().startsWith(newVal.toLowerCase()))
      .slice(0, props.noOfResults ?? 6);

    if (props.allowCustomResult) res.push(newVal);

    if (newVal != "") setSearchResults(res);
    else setSearchResults([]);
  };

  const onSearchResultPress = (item: string) => {
    if (
      !selectedResults.some((result) => result == item) ||
      props.allowDuplicates
    ) {
      if (props.allowMultiSelect)
        setSelectedResults([...selectedResults, item]);
      else setSelectedResults([item]);
    }

    setTextVal("");
    setSearchResults([]);
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && searchResults.length > 0) {
      onSearchResultPress(searchResults[0]);
    }
  };

  const onSearchSelectedPress = (index: number) => {
    const selected = [...selectedResults];
    selected.splice(index, 1);
    setSelectedResults(selected);
  };

  useEffect(() => {
    props.onSelectedResultsChange(selectedResults);
  }, [selectedResults]);

  return (
    <div className={styles.searchBoxContainer}>
      {props.heading && <h3>{props.heading}</h3>}
      <div
        className={`${styles.searchBox} ${
          searchResults.length > 0 ? styles.active : ""
        }`}
      >
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder={props.heading}
            value={textVal}
            onChange={(e) => onTextValChange(e.target.value)}
            onKeyDown={onEnterPress}
          ></input>
          {selectedResults.map((item, index) => {
            return (
              <button
                key={index}
                className={styles.selectedChord}
                onClick={() => onSearchSelectedPress(index)}
              >
                {item}
              </button>
            );
          })}
        </div>

        {searchResults.length > 0 && (
          <div className={styles.dropdown}>
            {searchResults.map((item, index) => {
              return (
                <button key={index} onClick={() => onSearchResultPress(item)}>
                  {item}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
