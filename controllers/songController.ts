import excuteQuery from "../lib/db"

export const getSongs = async (req, res) => {
  try {
    console.log("req nom", req.body)
    const result = await excuteQuery({
        query: 'INSERT INTO post(content) VALUES(?)',
        values: [req.body.content],
    });
    console.log( "ttt",result );
  } catch ( error ) {
    console.log( error );
  }
};