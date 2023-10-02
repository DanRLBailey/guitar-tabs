export function mod(number: number, modulo: number) {
  return ((number % modulo) + modulo) % modulo;
}

export function toMinutesAndSeconds(time: number) {
  let str = "";
  const minutes = Math.floor(time / 60);
  str += minutes < 10 ? "0" + minutes : minutes;

  const seconds = Math.floor(time - minutes * 60);
  str += seconds < 10 ? ":0" + seconds : ":" + seconds;
  return str;
}

export function toMinutesSecondsAndMilliseconds(time: number) {
  let str = "";
  const minutes = Math.floor(time / 60);
  str += minutes < 10 ? "0" + minutes : minutes;

  const seconds = time - minutes * 60;
  str += seconds < 10 ? ":0" + convertSeconds(seconds) : ":" + convertSeconds(seconds);
  return str;
}

function convertSeconds(seconds: number) {
  return seconds.toFixed(2).replace(".", ":")
}