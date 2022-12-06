import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <ul>
        <li>
          <Link href="songs/hotel-california">Hotel California</Link>
        </li>
        <li>
          <Link href="songs/have-you-ever-seen-the-rain">
            Have You Ever Seen The Rain
          </Link>
        </li>
        <li>
          <Link href="songs/talking-to-the-moon">Talking To The Moon</Link>
        </li>
        <li>
          <Link href="songs/dancing-in-the-moonlight">
            Dancing In The Moonlight
          </Link>
        </li>
      </ul>
    </div>
  );
}
