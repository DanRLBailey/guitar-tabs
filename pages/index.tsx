import styles from "../styles/Home.module.scss";
import Link from "next/link";
import { SongDB } from "../types/interfaces";
import { useEffect, useState } from "react";

export default function Home() {
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [songList, setSongList] = useState<SongDB[]>([]);

  const getSongs = () => {
    fetch("/api/getSongs")
      .then((res) => res.json())
      .then((json) => {
        setSongList(json);
        setLoading(false);
        localStorage.setItem("songs", JSON.stringify(json));
      });
  };

  useEffect(() => {
    if (songList.length != 0) return;

    const localSongs = localStorage.getItem("songs");
    const songs = localSongs ? JSON.parse(localSongs) : null;

    if (!songs || songs.length == 0) getSongs();
    else {
      setSongList(songs);
      setLoading(false);
    }
  }, [songList]);

  useEffect(() => {
    setFilter(filter);
  }, [filter]);

  return (
    <div className={styles.container}>
      <title>Guitar Tabs - Home</title>
      <div className={styles.filterContainer}>
        <input
          type="text"
          onChange={(v) => {
            setFilter(v.target.value);
          }}
          placeholder="Filter"
        />
        <button
          onClick={() => {
            getSongs();
            setLoading(true);
          }}
        >
          Refresh
        </button>
      </div>

      <div className={styles.songList}>
        {loading && <span>Loading...</span>}
        {!loading &&
          songList.length != 0 &&
          songList
            .filter(
              (key, index) =>
                songList[index].song_name
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ||
                songList[index].song_artist
                  .toLowerCase()
                  .includes(filter.toLowerCase())
            )
            .sort((a, b) => a.song_name.localeCompare(b.song_name))
            .map((song, index) => {
              return (
                <Link
                  href={`songs/${song.song_name
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                  className={styles.song}
                  key={index}
                >
                  <div className={styles.details}>
                    <span>{song.song_name}</span>
                    <span>{song.song_artist}</span>
                    {(song.timings == "null" || song.timings == "[null]") && (
                      <span className={styles.details}>Timings Missing</span>
                    )}
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
}
