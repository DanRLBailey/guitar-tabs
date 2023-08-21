// db.js
import mysql from "serverless-mysql";
const db = mysql({
  config: {
    host: "guitar-tabs-db.cddrlf2md3st.eu-west-2.rds.amazonaws.com",
    user: "admin",
    password: "HpX8xazoy8GPkGqv2DLd",
    database: "guitar-tabs",
  },
});

export default async function excuteQuery({ query, values }) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}
