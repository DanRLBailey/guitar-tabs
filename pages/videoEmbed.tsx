import { useEffect, useRef, useState } from "react";
import styles from "../styles/VideoEmbed.module.scss";
import ReactPlayer from "react-player/youtube";
import Chord from "./chord";
import { Chords, Chord as ChordType } from "../public/Types/interfaces";

interface VideoEmbedProps {
  embedId: string;
  chords: Chords;
  timings: number[];
  currentChord: string;
  onHighlightChord: (index: number) => void;
}

export default function VideoEmbed(props: VideoEmbedProps) {
  //#region hydration error hack
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);
  //#endregion

  const [maxTime, setMaxTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [currentChord, setCurrentChord] = useState<ChordType | null>(null);
  const [latest, setLatest] = useState(0);
  const [count, setCount] = useState(-1);

  const url = `https://www.youtube.com/watch?v=${props.embedId}`;
  const player = useRef<any>();

  const setupPlayer = () => {
    setMaxTime(player.current.getDuration());
  };

  const togglePlay = () => {
    setPlaying(!playing);
    setCurrentTime(player.current.getCurrentTime());
  };

  const seek = (time: number, type: string = "seconds") => {
    player.current.seekTo(time, type);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!playing) return;

      setCurrentTime(player.current.getCurrentTime());
      const l =
        props.timings.find((t) => t <= currentTime && t > latest) ?? latest;

      const i = props.timings.filter((t) => {
        return t <= currentTime;
      });

      if (i.length - 1 != count) setCount(i.length - 1);

      if (l) {
        setLatest(l);
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [playing, currentTime]);

  useEffect(() => {
    if (!props.currentChord) return;

    const key = props.currentChord[0];
    const suffix =
      props.currentChord.slice(1) != "" ? props.currentChord.slice(1) : "maj";

    const c = props.chords[key].find((x) => x.Suffix == suffix);

    if (c) {
      setCurrentChord(c);
    }
  }, [props.currentChord]);

  useEffect(() => {
    if (props.onHighlightChord) props.onHighlightChord(count);
  }, [count]);

  return (
    <div className="container">
      {hasWindow && (
        <div>
          <ReactPlayer
            ref={player}
            url={url}
            playing={playing}
            onReady={setupPlayer}
            onPlay={() => setCurrentTime(player.current.getCurrentTime())}
          />

          <div className={styles.playerController}>
            <button onClick={togglePlay}>PLAY/PAUSE</button>
            <button onClick={() => seek(10)}>seek (to 10s)</button>
            <input type="range" min={0} max={maxTime} />
          </div>

          {currentChord && (
            <div>
              <Chord chord={currentChord} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
