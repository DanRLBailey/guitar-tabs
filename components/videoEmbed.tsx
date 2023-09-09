import { useEffect, useRef, useState } from "react";
import styles from "../styles/VideoEmbed.module.scss";
import ReactPlayer from "react-player/youtube";
import Slider from "./slider";

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import Replay10Icon from "@mui/icons-material/Replay10";
import Forward10Icon from "@mui/icons-material/Forward10";
import CheckBox from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SettingsIcon from "@mui/icons-material/Settings";
import Popup from "./popup";

interface VideoEmbedProps {
  embedId: string;
  onChordsHidden: (hidden: boolean) => void;
  onTimeChange: (time: number) => void;
}

interface Setting {
  [key: string]: number | boolean | string;
}

export default function VideoEmbed(props: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [settings, setSettings] = useState<Setting>({
    url: `https://www.youtube.com/watch?v=${props.embedId}`,
    settingsOpen: false,
    volume: getSettingsFromStore("volume", 50),
    speed: getSettingsFromStore("speed", 100),
    autoscroll: true,
    showChords: getSettingsFromStore("showChords", true),
  });

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
  };

  const onSettingChange = (setting: Setting, store: boolean = true) => {
    setSettings({ ...settings, ...setting });

    const key = Object.keys(setting)[0];
    if (store) localStorage.setItem(key, setting[key].toString());
  };

  useEffect(() => {
    props.onTimeChange(currentTime);
  }, [currentTime]);

  return (
    <div className={styles.videoEmbedContainer}>
      <div className={styles.player}>
        <ReactPlayer
          ref={player}
          url={settings.url as string}
          playing={playing}
          onReady={() => setMaxTime(player.current.getDuration())}
          progressInterval={10}
          onProgress={() => setCurrentTime(player.current.getCurrentTime())}
          width="auto"
          height="30vh"
          volume={(settings.volume as number) / 100}
          playbackRate={(settings.speed as number) / 100}
        />
      </div>
      <div className={styles.scrubberContainer}>
        <Slider
          currentValue={currentTime}
          maxValue={maxTime}
          onSliderChange={(val) => seekTo(val)}
        />
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
        <Slider
          currentValue={settings.volume as number}
          maxValue={100}
          onSliderChange={(val) => onSettingChange({ volume: val })}
          icon={
            <button
              onClick={() => {
                console.log(getSettingsFromStore("volume"));
                onSettingChange(
                  (settings.volume as number) > 0
                    ? { volume: 0 }
                    : { volume: getSettingsFromStore("volume") },
                  false
                );
              }}
            >
              <VolumeUpIcon />
            </button>
          }
        />
        <div className={styles.settingsContainer}>
          <button
            onClick={() =>
              onSettingChange({ settingsOpen: !settings.settingsOpen })
            }
          >
            <SettingsIcon />
          </button>
          {settings.settingsOpen && (
            <Popup className={styles.settings}>
              <>
                <div>
                  Autoscroll:
                  <button
                    onClick={() =>
                      onSettingChange({ autoscroll: !settings.autoscroll })
                    }
                  >
                    {settings.autoscroll && <CheckBox color="action" />}
                    {!settings.autoscroll && (
                      <CheckBoxOutlineBlank color="action" />
                    )}
                  </button>
                </div>
                <div>
                  Speed:
                  <button
                    onClick={() => onSettingChange({ speed: 75 })}
                    className={settings.speed == 75 ? styles.active : ""}
                  >
                    0.75x
                  </button>
                  <button
                    onClick={() => onSettingChange({ speed: 100 })}
                    className={settings.speed == 100 ? styles.active : ""}
                  >
                    1x
                  </button>
                  <button
                    onClick={() => onSettingChange({ speed: 150 })}
                    className={settings.speed == 150 ? styles.active : ""}
                  >
                    1.5x
                  </button>
                </div>
                <div>
                  Hard Mode:
                  <button
                    onClick={() => {
                      props.onChordsHidden(!settings.showChords);
                      onSettingChange({ showChords: !settings.showChords });
                    }}
                  >
                    {settings.showChords && (
                      <CheckBoxOutlineBlank color="action" />
                    )}
                    {!settings.showChords && <CheckBox color="action" />}
                  </button>
                </div>
              </>
            </Popup>
          )}
        </div>
      </div>
    </div>
  );

  function getSettingsFromStore(setting: string, fallback?: number | boolean) {
    const local = localStorage.getItem(setting);
    // if (local) return parseInt(local);

    if (local) {
      switch (typeof fallback) {
        case "boolean":
          props.onChordsHidden(local == "true");
          return local == "true";
        case "number":
        default:
          return parseInt(local);
      }
    }

    if (!fallback) return 0;

    localStorage.setItem(setting, fallback.toString());
    return fallback;
  }
}
