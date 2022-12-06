import styles from "../styles/Home.module.scss";
import Link from "next/link";
import Songs from "../public/songs.json";
import { SongMetaDetails } from "../public/Types/interfaces";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.songList}>
        {Object.keys(Songs).map((item: string, index: number) => {
          const song: SongMetaDetails = Songs[item];
          return (
            <Link href={`songs/${item}`} className={styles.song}>
              <span>{song.Name}</span>
              <span>{song.Artist}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
