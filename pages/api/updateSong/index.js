/* eslint-disable import/no-anonymous-default-export */
import excuteQuery from "../../../lib/db";

export default async (req, res) => {
  const body = JSON.parse(req.body);

  const userId = 1;
  const songName = body["songName"];
  const songArtist = body["songArtist"];
  const parts = body["parts"];
  const timings = body["timings"];
  const tabs = body["tabs"];
  const capo = body["capo"];
  const link = body["link"];
  const slug = body["slug"];

  try {
    const result = await excuteQuery({
      query: `UPDATE songs SET song_name = '${songName}', song_artist = '${songArtist}', parts = '${JSON.stringify(
        parts
      )}', timings = '${JSON.stringify(timings)}', tabs = '${
        tabs ? JSON.stringify(tabs) : null
      }', capo = ${
        capo ? parseInt(capo) : null
      }, link = '${link}', last_updated = NOW() WHERE slug = '${slug}'`,
    });

    res.send(result);
  } catch (error) {
    res.error(error);
  }
};
