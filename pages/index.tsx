import styles from "../styles/Home.module.scss";
import Link from "next/link";
import Songs from "../public/songs.json";
import { SongMeta, SongMetaDetails } from "../types/interfaces";
import { useEffect, useState } from "react";

export default function Home() {
  const [filter, setFilter] = useState("");

  const songList: SongMeta = Songs;

  useEffect(() => {
    setFilter(filter);
  }, [filter]);

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <input
          type="text"
          onChange={(v) => {
            setFilter(v.target.value);
          }}
          placeholder="Filter"
        />
      </div>

      <div className={styles.songList}>
        {Object.keys(songList)
          .filter(
            (key) =>
              songList[key].Name.toLowerCase().includes(filter.toLowerCase()) ||
              songList[key].Artist.toLowerCase().includes(filter.toLowerCase())
          )
          .map((item: string, index: number) => {
            const song: SongMetaDetails = songList[item];
            return (
              <Link
                href={`songs/${item}`}
                className={`${styles.song} ${
                  song.NeedsTiming ? styles.incomplete : ""
                }`}
                key={index}
              >
                <span>{song.Name}</span>
                <span>{song.Artist}</span>
                {song.NeedsTiming && (
                  <span className={styles.details}>Timings Missing</span>
                )}
              </Link>
            );
          })}
      </div>
    </div>
  );
}
