import { useEffect, useRef, useState } from "react";
import styles from "../styles/VideoEmbed.module.scss";
import ReactPlayer from "react-player/youtube";
import Chord from "./chord";
import {
  Chords,
  Chord as ChordType,
  Tab as TabType,
  TabItem,
} from "../types/interfaces";
import Tab from "./tab";

interface VideoEmbedProps {
  embedId: string;
  chords: Chords;
  tabs: TabType;
  timings: number[];
  currentChord: string;
  onHighlightChord: (index: number) => void;
  onToggleAutoscroll: (autoscroll: boolean) => void;
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
  const [autoscroll, setAutoscroll] = useState(true);

  const [currentChord, setCurrentChord] = useState<ChordType | null>(null);
  const [currentTab, setCurrentTab] = useState<TabItem[] | null>(null);
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

  const seekBy = (time: number, type: string = "seconds") => {
    let t = player.current.getCurrentTime();
    const min = 0;
    const max = player.current.getDuration();

    t += time;
    t = Math.min(Math.max(parseInt(t), min), max);

    player.current.seekTo(t, type);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!playing) return;

      setCurrentTime(player.current.getCurrentTime());
      if (props.timings) {
        const l =
          props.timings.find((t) => t <= currentTime && t > latest) ?? latest;

        const i = props.timings.filter((t) => {
          return t <= currentTime;
        });

        if (i.length - 1 != count) setCount(i.length - 1);

        if (l) {
          setLatest(l);
        }
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [playing, currentTime]);

  useEffect(() => {
    if (!props.currentChord) return;

    const key = props.currentChord[0];
    const suffix =
      props.currentChord.slice(1) != "" ? props.currentChord.slice(1) : "maj";

    const temp = props.chords[key];
    if (temp) {
      const c = temp.find((x) => x.Suffix == suffix);

      if (c) {
        setCurrentChord(c);
        setCurrentTab(null);
        return;
      }
    }

    const t = props.tabs[props.currentChord];

    if (t) {
      setCurrentTab(t);
      setCurrentChord(null);
    }
  }, [props.currentChord]);

  useEffect(() => {
    if (props.onHighlightChord) props.onHighlightChord(count);
  }, [count]);

  useEffect(() => {
    props.onToggleAutoscroll(autoscroll)
  }, [autoscroll]);


  return (
    <div className={styles.container}>
      {hasWindow && (
        <div className={styles.playerContainer}>
          {currentChord && (
            <div className={styles.chord}>
              <Chord chord={currentChord} />
            </div>
          )}
          {currentTab && !currentChord && (
            <div className={styles.chord}>
              <Tab tab={currentTab} />
            </div>
          )}
          <div className={styles.player}>
            <ReactPlayer
              ref={player}
              url={url}
              playing={playing}
              onReady={setupPlayer}
              onPlay={() => setCurrentTime(player.current.getCurrentTime())}
              width="auto"
              height="40vh"
            />

            <div className={styles.playerController}>
              <div className={styles.playerControls}>
                <button onClick={togglePlay} className={playing ? styles.playing : ""}>></button>
                <button onClick={() => seekBy(-10)}>-10</button>
                <input
                  type="range"
                  min={0}
                  max={maxTime}
                  value={currentTime}
                  onChange={(e) => {
                    seek(parseInt(e.target.value));
                  }}
                />
                <input 
                  type="checkbox" 
                  id="autoscroll" 
                  name="scroll" 
                  checked={autoscroll}
                  onChange={() => {setAutoscroll(!autoscroll);}}
                />
                <button onClick={() => seekBy(10)}>+10</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
