/* eslint-disable import/no-anonymous-default-export */
import excuteQuery from "../../../lib/db";

export default async (req, res) => {
  try {
    const result = await excuteQuery({
      query: "SELECT * FROM songs WHERE user_id = 1",
    });

    res.send(result);
  } catch (error) {
    res.error(error);
  }
};
