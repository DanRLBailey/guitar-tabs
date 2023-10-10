import styles from "../styles/Home.module.scss";
import Link from "next/link";
import { SongDB } from "../types/interfaces";
import { useEffect, useState } from "react";
import { writeSettingToStore } from "../lib/localStore";
import { logoutUser, verifyUser } from "../lib/users";

export default function Home() {
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [songList, setSongList] = useState<SongDB[]>([]);

  const [allowEdit, setAllowEdit] = useState<boolean>(false);

  const getSongsFromDb = () => {
    console.log("getting songs");
    fetch("/api/getSongs")
      .then((res) => res.json())
      .then((json) => {
        setSongList(json);
        setLoading(false);
        writeSettingToStore("songs", JSON.stringify(json));

        (json as SongDB[]).forEach((song) => {
          const slug = song.song_name.toLowerCase().replaceAll(" ", "-");
          writeSettingToStore(slug, JSON.stringify(song));
        });
      });
  };

  const getTimesFromDb = async () => {
    let data = await fetch("/api/getSongUpdatedTimes");
    const json = await data.json();
    return json;
  };

  useEffect(() => {
    if (songList.length != 0) return;

    const localSongs = localStorage.getItem("songs");
    const songs = localSongs ? (JSON.parse(localSongs) as SongDB[]) : null;
    if (!songs) {
      getSongsFromDb();
      return;
    }

    getTimesFromDb().then((times) => {
      if (times.length != songs.length) {
        getSongsFromDb();
        return;
      }

      songs?.forEach((song, index) => {
        if (song.last_updated < times[index].last_updated) {
          getSongsFromDb();
          return;
        }
      });

      setSongList(songs);
      setLoading(false);
    });
  }, [songList]);

  useEffect(() => {
    setFilter(filter);
  }, [filter]);

  useEffect(() => {
    const localUser = verifyUser();
    if (!localUser) return;

    setAllowEdit(localUser.permissionLevel == "admin");
  });

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
        {allowEdit && (
          <Link href={`addSong`} className={`${styles.button} button`}>
            Add Song
          </Link>
        )}
        <button onClick={logoutUser}>Logout</button>
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
