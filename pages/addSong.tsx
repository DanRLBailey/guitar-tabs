import styles from "../styles/addSong/AddSong.module.scss";
import { useEffect, useState } from "react";
import {
  Chords,
  PartObj,
  SongMetaDetails,
  Song as SongType,
  TabItem,
  Tab as TabObj,
} from "../types/interfaces";
import AddSongLyrics from "../components/addSong/addSongLyrics";
import SearchBox from "../components/containers/searchBox";
import chordsJson from "../public/chords/chords.json";
import InputComponent from "../components/containers/inputComponent";
import AddSongTab from "../components/addSong/addSongTabs";

export default function AddSong() {
  const [currentSongMeta, setCurrentSongMeta] = useState<SongMetaDetails>({
    Name: "",
    Artist: "",
  });
  const [currentSong, setCurrentSong] = useState<SongType>({
    Link: "",
    Capo: 0,
    Parts: [],
    Timings: [],
    Tabs: {},
  });
  const [chords, setChords] = useState<string[]>([]);
  const [tabNames, setTabNames] = useState<string[]>([]);
  const [parts, setParts] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<string>("");

  const getAllChordVariations = () => {
    let allChords: string[] = [];
    const keys = Object.keys(chordsJson);
    const chordObjArr = chordsJson as Chords;

    keys.forEach((key, index) => {
      allChords.push(key);

      chordObjArr[key].forEach((chord, chordIndex) => {
        if (chord.Suffix == "major") return;

        allChords.push(`${chord.Key}${chord.Suffix}`);
      });
    });

    return allChords;
  };

  const handleTabChange = (newTab: TabObj) => {
    setCurrentSong({
      ...currentSong,
      Tabs: { ...currentSong.Tabs, ...newTab },
    });
  };

  useEffect(() => {
    if (!currentSong.Tabs) return;

    Object.keys(currentSong.Tabs).forEach((tab) => {
      if (!tabNames.some((tabName) => tabName == tab)) {
        if (currentSong.Tabs) delete currentSong.Tabs[tab];
      }
    });
  }, [tabNames]);

  return (
    <div className={styles.addSongContainer}>
      <title>Guitar Tabs - Add Song</title>
      {getMetaDetails()}
      <AddSongLyrics
        parts={parts}
        currentLine={currentLine}
        onPartsChange={(newParts: string[]) => setParts(newParts)}
        onCurrentLineChange={(newCurrentLine: string) =>
          setCurrentLine(newCurrentLine)
        }
        chords={chords}
        tabs={tabNames}
      />
      {tabNames.length > 0 && (
        <AddSongTab tabNames={tabNames} onTabChanged={handleTabChange} />
      )}
    </div>
  );

  function getMetaDetails() {
    return (
      <div className={styles.metaDetails}>
        <h1>Details</h1>
        <div className={styles.inputs}>
          <InputComponent
            type="text"
            heading="Song Name"
            value={currentSongMeta.Name}
            onValueChange={(e) =>
              setCurrentSongMeta({ ...currentSongMeta, Name: e.target.value })
            }
          />
          <InputComponent
            type="text"
            heading="Artist"
            value={currentSongMeta.Artist}
            onValueChange={(e) =>
              setCurrentSongMeta({ ...currentSongMeta, Artist: e.target.value })
            }
          />
          <InputComponent
            type="text"
            heading="Youtube Link"
            value={currentSong.Link}
            onValueChange={(e) =>
              setCurrentSong({ ...currentSong, Link: e.target.value })
            }
          />
          <InputComponent
            type="number"
            heading="Capo"
            value={currentSong.Capo}
            onValueChange={(e) =>
              setCurrentSong({ ...currentSong, Capo: parseInt(e.target.value) })
            }
          />
          <SearchBox
            heading="Chords"
            searchResults={getAllChordVariations()}
            onSelectedResultsChange={(res) => setChords(res)}
            allowMultiSelect
          />
          <SearchBox
            heading="Tabs"
            searchResults={[]}
            onSelectedResultsChange={(res) => setTabNames(res)}
            allowMultiSelect
            allowCustomResult
          />
        </div>
      </div>
    );
  }
}
