/* eslint-disable import/no-anonymous-default-export */
import excuteQuery from "../../../lib/db";

export default async (req, res) => {
  const bcrypt = require("bcryptjs");

  const body = JSON.parse(req.body);
  const email = body["email"];
  const password = body["password"];

  try {
    const result = await excuteQuery({
      query: `SELECT * FROM users WHERE email = "${email}"`,
    });

    let match = await bcrypt.compare(password, result[0]["password"]);
    if (!match) res.error({ error: "Passwords do not match" });

    res.send(result[0]);
  } catch (error) {
    res.error(error);
  }
};
