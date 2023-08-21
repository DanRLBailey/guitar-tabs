/* eslint-disable import/no-anonymous-default-export */
import excuteQuery from "../../../lib/db";

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const songName = body["songName"];

  try {
    const result = await excuteQuery({
      query: `SELECT * FROM songs WHERE user_id = 1 AND slug = "${songName}"`,
    });

    res.send(result);
  } catch (error) {
    res.error(error);
  }
};
