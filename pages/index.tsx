import styles from "../styles/Home.module.scss";
import Link from "next/link";
import Songs from "../public/songs.json";
import { SongMeta, SongMetaDetails } from "../public/Types/interfaces";

export default function Home() {
  const s: SongMeta = Songs;
  return (
    <div className={styles.container}>
      <div className={styles.songList}>
        {Object.keys(s).map((item: string, index: number) => {
          const song: SongMetaDetails = s[item];
          return (
            <Link href={`songs/${item}`} className={styles.song} key={index}>
              <span>{song.Name}</span>
              <span>{song.Artist}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
