import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import SongPage from "../../components/song";
import { useEffect, useState } from "react";
import {
  SongDB,
  SongMetaDetails,
  Song as SongType,
} from "../../types/interfaces";
import chords from "../../public/chords/chords.json";

const Song = () => {
  const router = useRouter();
  const { song } = router.query;
  const [currentSongMeta, setCurrentSongDetails] =
    useState<SongMetaDetails | null>(null);
  const [currentSong, setCurrentSong] = useState<SongType | null>(null);
  //const s: SongMeta = Songs;

  const [loading, setLoading] = useState(true);
  const [songList, setSongList] = useState<SongDB[]>([]);

  const getSong = () => {
    fetch("/api/getSong", {
      method: "POST",
      body: JSON.stringify({ songName: song }),
    })
      .then((res) => res.json())
      .then((json) => {
        setSongList(json);
      });
  };

  useEffect(() => {
    if (songList.length != 0) {
      if (!loading) return;

      if (typeof song === "object" || !song) return;

      const meta: SongMetaDetails = {
        Name: songList[0].song_name,
        Artist: songList[0].song_artist,
      };

      const s: SongType = {
        Link: songList[0].link,
        Capo: songList[0].capo,
        Parts: songList[0].parts ? JSON.parse(songList[0].parts) : [],
        Timings: songList[0].timings ? JSON.parse(songList[0].timings) : [],
        Tabs: songList[0].tabs ? JSON.parse(songList[0].tabs) : {},
      };

      setCurrentSongDetails(meta);
      setCurrentSong(s);
      setLoading(false);
    }

    getSong();
  }, [songList]);

  if (loading) return <p>Loading...</p>;

  if (currentSongMeta !== null && currentSong !== null)
    return (
      <SongPage
        Key={song as string}
        SongMeta={currentSongMeta}
        Chords={chords}
        Song={currentSong}
      />
    );

  return <p>No song found.</p>;
};

export default Song;
