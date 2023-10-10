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
      query: `insert into songs VALUES (null, ${userId}, '${songName}', '${songArtist}', '${JSON.stringify(
        parts
      )}', '${JSON.stringify(timings)}', '${
        tabs ? JSON.stringify(tabs) : null
      }', ${capo ? parseInt(capo) : null}, '${link}', '${slug}', NOW(), false)`,
    });

    res.send(result);
  } catch (error) {
    res.error(error);
  }
};
