import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import SongPage from "../../components/song";
import { useEffect, useState } from "react";
import { SongMeta, SongMetaDetails } from "../../types/interfaces";
import Songs from "../../public/songs.json";
import chords from "../../public/chords/chords.json";

const Song = () => {
  const router = useRouter();
  const { song } = router.query;
  const [currentSongMeta, setCurrentSongDetails] =
    useState<SongMetaDetails | null>(null);
  const s: SongMeta = Songs;

  useEffect(() => {
    if (typeof song === "object" || !song) return;

    const currentSongDetails = s[song];

    if (currentSongDetails) setCurrentSongDetails(currentSongDetails);
  }, [song]);

  return currentSongMeta !== null ? (
    <SongPage Key={song as string} SongMeta={currentSongMeta} Chords={chords} />
  ) : (
    <p>No song found.</p>
  );
};

export default Song;
