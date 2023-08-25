import styles from "../styles/AddSong.module.scss";
import { useEffect, useState } from "react";
import Modal from "./modal";
import { SongDB } from "../types/interfaces";

interface EditSongProp {
  isOpen: boolean;
  onExit: () => void;
  song: SongDB;
}

export default function EditSong(props: EditSongProp) {
  const [stage, setStage] = useState(0);
  const [songTimings, setSongTimings] = useState(props.song.timings);

  const onExit = () => {
    props.onExit();
  };

  const handleSongTimingsChange = (e: any) => {
    const val = e.target.value;
    setSongTimings(val);
  };

  const handleSubmit = () => {
    fetch("/api/updateSong", {
      method: "POST",
      body: JSON.stringify({
        userId: 1,
        songName: props.song.song_name,
        songArtist: props.song.song_artist,
        parts: JSON.parse(props.song.parts),
        timings: JSON.parse(songTimings),
        tabs: JSON.parse(props.song.tabs),
        capo: props.song.capo,
        link: props.song.link,
        slug: props.song.slug,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  };

  return (
    <>
      <Modal
        title="Edit Song"
        onExit={onExit}
        body={
          <>
            <div className={styles.editSongContainer}>
              <div className={styles.songDetails}>
                <h2>Timings:</h2>
                <textarea
                  value={songTimings}
                  onChange={(e) => handleSongTimingsChange(e)}
                  wrap="hard"
                ></textarea>
              </div>
            </div>
          </>
        }
        footer={
          <>
            <button onClick={handleSubmit}>Next</button>
          </>
        }
      ></Modal>
    </>
  );
}
