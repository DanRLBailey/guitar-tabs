import styles from "../styles/addSong/AddSong.module.scss";
import { useEffect, useState } from "react";
import {
  Chords,
  PartObj,
  SongMetaDetails,
  SongSection,
  Song as SongType,
  TabItem,
  Tab as TabObj,
} from "../types/interfaces";
import AddSongLyrics from "../components/addSong/addSongLyrics";
import SearchBox from "../components/containers/searchBox";
import chordsJson from "../public/chords/chords.json";
import InputComponent from "../components/containers/inputComponent";
import AddSongTab from "../components/addSong/addSongTabs";
import { getAllChordVariations } from "../lib/chords";
import { useRouter } from "next/navigation";

export default function AddSong() {
  const router = useRouter();

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
  const [debugOnly, setDebugOnly] = useState<boolean>(true);

  const handleTabChange = (newTab: TabObj) => {
    setCurrentSong({
      ...currentSong,
      Tabs: { ...currentSong.Tabs, ...newTab },
    });
  };

  const handlePartsChange = (newParts: string[]) => {
    setParts(newParts);

    const sections: SongSection[] = [];
    const currentSection: SongSection = { Section: "", Lines: [[]] };

    newParts.forEach((part, partIndex) => {
      if (part.startsWith("[")) {
        if (currentSection.Section != "") sections.push({ ...currentSection });
        currentSection.Section = part.split("*")[0];
        const parts = part.split("*");
        parts.shift();

        let line = "";
        parts.forEach((part) => {
          line += getAllChordVariations().some((chord) => chord == part)
            ? `*${part}`
            : `^${part}`;
        });

        currentSection.Lines = [parts.length > 0 ? [line] : []];
      } else {
        const lines: string[] = [];
        const parts = part.split(" ");

        parts.forEach((p) => {
          let line = "";

          const words = p.split("*");
          const firstWord = words.shift();
          words.forEach((part) => {
            line += getAllChordVariations().some((chord) => chord == part)
              ? `*${part}`
              : `^${part}`;
          });

          lines.push(firstWord + line);
        });

        if (currentSection.Lines[0].length == 0) {
          currentSection.Lines[0] = lines;
        } else {
          currentSection.Lines.push(lines);
        }
      }
    });

    sections.push({ ...currentSection });
    console.log("asdasdasd", sections);

    setCurrentSong({ ...currentSong, Parts: sections });
  };

  const onNextButtonPress = () => {
    if (debugOnly) {
      return;
    }

    const slug = currentSongMeta.Name.toLowerCase().replace(" ", "-");

    fetch("/api/postSong", {
      method: "POST",
      body: JSON.stringify({
        userId: 1,
        songName: currentSongMeta.Name,
        songArtist: currentSongMeta.Artist,
        parts: JSON.parse(
          JSON.stringify(currentSong.Parts).replaceAll("'", "")
        ),
        timings: null,
        tabs: currentSong.Tabs,
        capo: currentSong.Capo,
        link: currentSong.Link,
        slug: slug,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error != undefined) {
          console.error(json.error);
          return;
        }
        router.push(`/songs/${slug}`);
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

  useEffect(() => {
    console.log(currentSong.Parts);
  }, [currentSong.Parts]);

  return (
    <div className={styles.addSongContainer}>
      <title>Guitar Tabs - Add Song</title>
      {getMetaDetails()}
      <AddSongLyrics
        parts={parts}
        currentLine={currentLine}
        onPartsChange={handlePartsChange}
        onCurrentLineChange={(newCurrentLine: string) =>
          setCurrentLine(newCurrentLine)
        }
        chords={chords}
        tabs={tabNames}
      />
      {tabNames.length > 0 && (
        <AddSongTab tabNames={tabNames} onTabChanged={handleTabChange} />
      )}
      {currentSongMeta.Name != "" &&
        currentSongMeta.Artist != "" &&
        currentSong.Link != "" &&
        currentSong.Parts.length > 0 && (
          <button onClick={onNextButtonPress}>Next</button>
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
