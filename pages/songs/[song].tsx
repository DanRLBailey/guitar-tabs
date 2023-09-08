import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import SongPage from "../../components/song";
import { useEffect, useState } from "react";
import {
  SongDB,
  SongMetaDetails,
  Song as SongType,
} from "../../types/interfaces";

const Song = () => {
  const router = useRouter();
  const { song } = router.query;
  const [currentSongMeta, setCurrentSongMeta] =
    useState<SongMetaDetails | null>(null);
  const [currentSong, setCurrentSong] = useState<SongType | null>(null);
  const [loading, setLoading] = useState(true);
  const [songDb, setSongDb] = useState<SongDB>();

  useEffect(() => {
    if (!songDb) return;

    const songMeta: SongMetaDetails = {
      Name: songDb.song_name,
      Artist: songDb.song_artist,
    };

    const currentSong: SongType = {
      Link: songDb.link,
      Capo: songDb.capo,
      Parts: songDb.parts ? JSON.parse(songDb.parts) : [],
      Timings: songDb.timings ? JSON.parse(songDb.timings) : [],
      Tabs: songDb.tabs ? JSON.parse(songDb.tabs) : {},
    };

    setCurrentSongMeta(songMeta);
    setCurrentSong(currentSong);
    setLoading(false);
  }, [songDb]);

  useEffect(() => {
    if (!song) return;

    const slug = song.toString();

    let store = localStorage.getItem(slug);
    if (store) setSongDb(JSON.parse(store)[0]);
    else getSong();
  }, [song]);

  const getSong = () => {
    console.log("getting");
    fetch("/api/getSong", {
      method: "POST",
      body: JSON.stringify({ songName: song }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (song) localStorage.setItem(song.toString(), JSON.stringify(json));
        setSongDb(json[0]);
      });
  };

  if (loading) return <p>Loading...</p>;

  if (currentSongMeta !== null && currentSong !== null)
    return (
      <SongPage
        Key={song as string}
        SongMeta={currentSongMeta}
        Song={currentSong}
      />
    );

  return <p>No song found.</p>;
};

export default Song;
