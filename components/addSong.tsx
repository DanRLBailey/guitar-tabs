import styles from "../styles/AddSong.module.scss";
import { useEffect, useState } from "react";
import Modal from "./modal";
import NewSongWord from "./newSongWord";
import { Song, SongSection } from "../types/interfaces";

export default function AddSong() {
  const [showModal, setShowModal] = useState(false);
  const [textAreaVal, setTextAreaVal] = useState("");
  const [stage, setStage] = useState(0);
  const [songName, setSongName] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songLink, setSongLink] = useState("");
  const [songCapo, setSongCapo] = useState("");
  const [songChords, setSongChords] = useState<string[]>([]);
  const [songTimings, setSongTimings] = useState("");
  const [chordList, setChordList] = useState<string[]>([]);
  const [parts, setParts] = useState<SongSection[]>([]);

  const toggleModal = (show?: boolean) => {
    setShowModal(show ?? !showModal);
    if (showModal) {
      setStage(0);
      setTextAreaVal("");
      setParts([]);
    }
  };

  const handleSongNameChange = (e: any) => {
    const val = e.target.value;
    setSongName(val);
  };

  const handleSongArtistChange = (e: any) => {
    const val = e.target.value;
    setSongArtist(val);
  };

  const handleSongLinkChange = (e: any) => {
    const val = e.target.value;
    setSongLink(val);
  };

  const handleSongCapoChange = (e: any) => {
    const val = e.target.value;
    setSongCapo(val);
  };

  const handleSongChordsChange = (e: any) => {
    const val = e.target.value;
    const arr = val.replaceAll(" ", "").split(",");

    setSongChords(val);
    setChordList(arr);
  };

  const handleSongTimingsChange = (e: any) => {
    const val = e.target.value;
    setSongTimings(val);
  };

  const handleTextAreaChange = (e: any) => {
    const val = e.target.value;
    setTextAreaVal(val);
  };

  const handleFirstStage = () => {
    const rows = textAreaVal.split("\n");
    let parts: SongSection[] = [];
    let part: SongSection = {
      Section: "",
      Lines: [[]],
    };

    rows.forEach((row, index) => {
      if (!row) return;
      if (row.includes("[")) {
        if (index != 0) {
          part.Lines.splice(0, 1);
          parts.push({ ...part });
        }

        part.Section = row;
        part.Lines = [[]];
      } else {
        let arr: string[] = [];
        const words = row.split(" ");

        words.forEach((word) => {
          if (word)
            arr.push(
              word.replaceAll(" ", "").replaceAll("'", "").replaceAll('"', "")
            );
        });

        part.Lines.push([...arr]);
      }

      if (index == rows.length - 1) {
        part.Lines.splice(0, 1);
        parts.push({ ...part });
      }
    });

    setParts([...parts]);
    setStage(stage + 1);
  };

  const handleChordChange = (
    partIndex: number,
    lineIndex: number,
    wordIndex: number,
    chords: string[]
  ) => {
    if (!parts) return;

    const song = [...parts];
    const part = song[partIndex];
    const line = part.Lines[lineIndex];
    let word = line[wordIndex];

    if (!word || chords.length == 0) return;

    word = word.split("*")[0];
    chords.forEach((item) => {
      word += `*${item.replaceAll(" ", "")}`;
    });

    line[wordIndex] = word;
    part.Lines[lineIndex] = line;
    song[partIndex] = part;
    setParts(song);
  };

  const handleSectionChordChange = (partIndex: number, chords: string[]) => {
    if (chords.length == 0) return;

    let song = [...parts];

    if (!parts[partIndex].Lines[0]) {
      const chord = `*${chords.join("*").replaceAll(" ", "")}`;
      song[partIndex].Lines.push([chord]);
    } else if (!parts[partIndex].Lines[0][0].startsWith("*")) {
      song[partIndex].Lines.unshift([
        `*${chords.join("*").replaceAll(" ", "")}`,
      ]);
    } else {
      song[partIndex].Lines[0] = [`*${chords.join("*").replaceAll(" ", "")}`];
    }

    setParts(song);
  };

  const handleSecondStage = () => {
    setStage(stage + 1);
  };

  const handleThirdStage = () => {
    const timings = songTimings.split(",").map((timing) => parseFloat(timing));

    fetch("/api/postSong", {
      method: "POST",
      body: JSON.stringify({
        userId: 1,
        songName: songName,
        songArtist: songArtist,
        parts: parts,
        timings: timings ?? [],
        tabs: null,
        capo: songCapo,
        link: songLink,
        slug: songName.toLowerCase().replaceAll(" ", "-"),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  };

  useEffect(() => {
    if (stage < 0) {
      setStage(0);
      toggleModal(false);
    }
  }, [stage]);

  return (
    <>
      <button onClick={() => toggleModal()}>Add</button>
      {showModal && (
        <Modal
          title="Add New Song"
          onExit={() => toggleModal(false)}
          body={
            <>
              {stage == 0 && (
                <div className={styles.addSongContainer}>
                  <div className={styles.songDetails}>
                    <div>
                      <h2>Name:</h2>
                      <input
                        type="text"
                        placeholder="E.g: Pulp"
                        value={songName}
                        onChange={handleSongNameChange}
                      ></input>
                    </div>
                    <div>
                      <h2>Artist:</h2>
                      <input
                        type="text"
                        placeholder="E.g: Winnetka Bowling League"
                        value={songArtist}
                        onChange={handleSongArtistChange}
                      ></input>
                    </div>
                    <div>
                      <h2>Link:</h2>
                      <input
                        type="text"
                        placeholder="E.g: g8BBtF5ctgg"
                        value={songLink}
                        onChange={handleSongLinkChange}
                      ></input>
                    </div>
                    <div>
                      <h2>Capo:</h2>
                      <input
                        type="text"
                        placeholder="E.g: 2"
                        value={songCapo}
                        onChange={handleSongCapoChange}
                      ></input>
                    </div>
                    <div>
                      <h2>Chords:</h2>
                      <input
                        type="text"
                        placeholder="E.g: A, Bm, C#dim/G"
                        value={songChords}
                        onChange={handleSongChordsChange}
                      ></input>
                    </div>
                  </div>
                  <h2>Lyrics:</h2>
                  <textarea
                    value={textAreaVal}
                    onChange={(e) => handleTextAreaChange(e)}
                    placeholder={`[Intro]\n\n[Verse 1]\nBlame it on my ESP or my sensitive teeth\nTo put my yellow Jansport and puffer on her empty seat\n...`}
                  ></textarea>
                </div>
              )}
              {stage == 1 && (
                <div className={styles.addSongContainer}>
                  {songName && songArtist && (
                    <div>{`${songName} - ${songArtist}`}</div>
                  )}
                  <div>{chordList.length > 0 && `${chordList.join(", ")}`}</div>
                  <h2>Chords:</h2>
                  <div className={styles.lyricsContainer}>
                    {parts.map((part, partIndex) => {
                      return (
                        <div key={partIndex} className={styles.songPart}>
                          <NewSongWord
                            key={partIndex}
                            word={part.Section}
                            index={partIndex}
                            onChordChange={(chords) =>
                              handleSectionChordChange(partIndex, chords)
                            }
                            type="Section"
                            songChords={chordList}
                            existingChords={[]}
                          />
                          {part.Lines.map((line, lineIndex) => {
                            return (
                              <div
                                key={lineIndex}
                                className={styles.songPartLyrics}
                              >
                                {line.map((word, wordIndex) => {
                                  return (
                                    <NewSongWord
                                      key={wordIndex}
                                      word={word.split("*")[0]}
                                      index={wordIndex}
                                      onChordChange={(chords) =>
                                        handleChordChange(
                                          partIndex,
                                          lineIndex,
                                          wordIndex,
                                          chords
                                        )
                                      }
                                      type="Lyric"
                                      songChords={chordList}
                                      existingChords={[]}
                                    />
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {stage == 2 && (
                <div className={styles.addSongContainer}>
                  <h2>Timings:</h2>
                  <textarea
                    value={songTimings}
                    onChange={(e) => handleSongTimingsChange(e)}
                  ></textarea>
                </div>
              )}
            </>
          }
          footer={
            <>
              <button onClick={() => setStage(stage - 1)}>Back</button>
              <button
                onClick={() => {
                  switch (stage) {
                    case 0:
                      handleFirstStage();
                      break;
                    case 1:
                      handleSecondStage();
                      break;
                    case 2:
                      handleThirdStage();
                      break;
                  }
                }}
              >
                Next
              </button>
            </>
          }
        />
      )}
    </>
  );
}
