import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import SongPage from "../../components/song";
import { useEffect, useState } from "react";
import {
  SongDB,
  SongMetaDetails,
  Song as SongType,
} from "../../types/interfaces";
import { writeSettingToStore } from "../../lib/localStore";
import NavBar from "../../components/navBar";
import Toaster from "../../components/containers/toaster";

const Song = () => {
  const router = useRouter();
  const { song } = router.query;
  const [currentSongMeta, setCurrentSongMeta] =
    useState<SongMetaDetails | null>(null);
  const [currentSong, setCurrentSong] = useState<SongType | null>(null);
  const [loading, setLoading] = useState(true);
  const [songDb, setSongDb] = useState<SongDB>();
  const [newToast, setNewToast] = useState<string | null>(null);

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
    let localSong = store ? (JSON.parse(store)[0] as SongDB) : null;

    if (!localSong) {
      getSongFromDb();
      return;
    }

    getTimeFromDb().then((time) => {
      if (!localSong) return;
      if (localSong.last_updated < time.last_updated) {
        getSongFromDb();
        return;
      }

      setSongDb(localSong);
      setLoading(false);
    });
  }, [song]);

  const getSongFromDb = () => {
    fetch("/api/getSong", {
      method: "POST",
      body: JSON.stringify({ songName: song }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (song) writeSettingToStore(song.toString(), JSON.stringify(json));
        setSongDb(json[0]);
      });
  };

  const getTimeFromDb = async () => {
    let data = await fetch("/api/getSongUpdatedTime", {
      method: "POST",
      body: JSON.stringify({ songName: song }),
    });
    const json = await data.json();
    return json[0];
  };

  const updateSong = () => {
    if (!currentSong || !currentSongMeta) return;

    const slug = currentSongMeta.Name.toLowerCase().replaceAll(" ", "-");

    fetch("/api/updateSong", {
      method: "POST",
      body: JSON.stringify({
        userId: 1,
        songName: currentSongMeta.Name,
        songArtist: currentSongMeta.Artist,
        parts: JSON.parse(
          JSON.stringify(currentSong.Parts).replaceAll("'", "")
        ),
        timings:
          currentSong.Timings && currentSong.Timings.length > 0
            ? currentSong.Timings
            : null,
        tabs: currentSong.Tabs,
        capo: currentSong.Capo,
        link: currentSong.Link,
        slug: slug,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setNewToast("Song Updated!");
      })
      .catch((err) => {
        setNewToast(err);
      });
  };

  if (loading)
    return (
      <>
        <NavBar />
        <p>Loading...</p>
      </>
    );

  if (currentSongMeta !== null && currentSong !== null)
    return (
      <>
        <NavBar />
        <Toaster
          newToast={newToast ?? ""}
          onNewToastAdded={() => setNewToast(null)}
        />
        <SongPage
          Key={song as string}
          SongMeta={currentSongMeta}
          Song={currentSong}
          onSongRefresh={getSongFromDb}
          onSongUpdate={(updatedSong) => setCurrentSong(updatedSong)}
          onSongSave={updateSong}
        />
      </>
    );

  return <p>No song found.</p>;
};

export default Song;
