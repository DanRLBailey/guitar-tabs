import { useEffect, useRef, useState } from "react";
import styles from "../styles/VideoEmbed.module.scss";
import ReactPlayer from "react-player/youtube";
import Slider from "./slider";

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import Replay10Icon from "@mui/icons-material/Replay10";
import Forward10Icon from "@mui/icons-material/Forward10";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SettingsIcon from "@mui/icons-material/Settings";
import { Setting } from "../types/interfaces";
import { getSettingsFromStore } from "../lib/localStore";
import SettingToggle from "./settingToggle";
import { toMinutesAndSeconds } from "../lib/numbers";

interface VideoEmbedProps {
  embedId: string;
  onTimeChange: (time: number) => void;
}

export default function VideoEmbed(props: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [playerSettings, setPlayerSettings] = useState<Setting>({
    url: `https://www.youtube.com/watch?v=${props.embedId}`,
    "settings-open": false,
    volume: getSettingsFromStore("volume", 50),
    speed: getSettingsFromStore("speed", 1),
    "show-video": getSettingsFromStore("show-video", true),
  });
  const [volumeHover, setVolumeHover] = useState<boolean>(false);

  const player = useRef<any>();

  const seekBy = (amount: number) => {
    let current = player.current.getCurrentTime();
    const min = 0;

    current += amount;
    current = Math.min(Math.max(parseInt(current), min), maxTime);

    seekTo(current);
  };

  const seekTo = (amount: number) => {
    player.current.seekTo(amount, "seconds");
    setCurrentTime(amount);
  };

  const onSettingChange = (
    setting?: Setting,
    saveToStorage: boolean = true
  ) => {
    if (!setting) return;

    setPlayerSettings({ ...playerSettings, ...setting });

    if (!saveToStorage) return;

    const key = Object.keys(setting)[0];
    localStorage.setItem(key, setting[key].toString());
  };

  useEffect(() => {
    props.onTimeChange(currentTime);
  }, [currentTime]);

  return (
    <div className={styles.videoEmbedContainer}>
      <div
        className={styles.player}
        style={{ display: playerSettings["show-video"] ? "block" : "none" }}
      >
        <ReactPlayer
          ref={player}
          url={playerSettings.url as string}
          playing={playing}
          onReady={() => setMaxTime(player.current.getDuration())}
          progressInterval={10}
          onProgress={() => setCurrentTime(player.current.getCurrentTime())}
          width="auto"
          height="inherit"
          volume={(playerSettings.volume as number) / 100}
          playbackRate={playerSettings.speed as number}
        />
      </div>
      <div className={styles.scrubberContainer}>
        <span className={styles.scrubberTime}>
          {toMinutesAndSeconds(currentTime)}
        </span>
        <Slider
          currentValue={currentTime}
          maxValue={maxTime}
          onSliderChange={(val) => seekTo(val)}
        />
        <span className={styles.scrubberTime}>
          {toMinutesAndSeconds(maxTime)}
        </span>
      </div>
      <div className={styles.controlsContainer}>
        <button onClick={() => setPlaying(!playing)}>
          {playing && <PauseCircleIcon />}
          {!playing && <PlayCircleOutlineIcon />}
        </button>
        <button onClick={() => seekBy(-10)}>
          <Replay10Icon />
        </button>
        <button onClick={() => seekBy(10)}>
          <Forward10Icon />
        </button>
        <div
          className={styles.volumeContainer}
          onMouseEnter={() => setVolumeHover(!volumeHover)}
          onMouseLeave={() => setVolumeHover(!volumeHover)}
        >
          <button
            onClick={() => {
              onSettingChange(
                (playerSettings.volume as number) > 0
                  ? { volume: 0 }
                  : { volume: getSettingsFromStore("volume") },
                false
              );
            }}
          >
            <VolumeUpIcon />
          </button>
          {volumeHover && (
            <div className={styles.volumeSliderContainer}>
              <Slider
                currentValue={playerSettings.volume as number}
                maxValue={100}
                onSliderChange={(val) => onSettingChange({ volume: val })}
              />
            </div>
          )}
        </div>
        <button className={styles.settingContainer}>
          <SettingsIcon
            onClick={() =>
              setPlayerSettings({
                ...playerSettings,
                "settings-open": !playerSettings["settings-open"],
              })
            }
          />
          {playerSettings["settings-open"] && (
            <div className={styles.settings}>
              <SettingToggle
                value={{ "show-video": playerSettings["show-video"] }}
                onSettingChange={(setting) => onSettingChange(setting, true)}
                settingText="Show Video"
                type="checkbox"
              />
              <SettingToggle
                value={{ speed: playerSettings["speed"] }}
                onSettingChange={(setting) => onSettingChange(setting)}
                settingText="Speed"
                optionsValues={[0.75, 1, 1.5]}
                type="radio"
              />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
