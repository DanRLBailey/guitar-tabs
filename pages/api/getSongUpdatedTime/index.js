/* eslint-disable import/no-anonymous-default-export */
import excuteQuery from "../../../lib/db";

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const songName = body["songName"];

  try {
    const result = await excuteQuery({
      query: `SELECT last_updated, slug FROM songs where user_id = 1 AND slug = "${songName}"  AND deleted = false`,
    });

    res.send(result);
  } catch (error) {
    res.error(error);
  }
};
