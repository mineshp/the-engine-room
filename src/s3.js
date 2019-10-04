// const { s3 } = require('./s3Client');

// const Bucket = process.env.BUCKET_NAME || 'the-beautiful-game';

// const whenAreGamesPlayed = {
//   TNF: 2, // Tuesday
//   YNAP: 3 // Wednesday
// };

// const getLatestGame = async (gameName) => {
//   console.log(gameName);
//   const now = new Date();
//   const timestamp = now.setDate(now.getDate() + ((7 - now.getDay()) % 7 + whenAreGamesPlayed[gameName]) % 7);
//   const gameDate = Date(timestamp).toISOString().slice(0, 10);
//   // console.log(gameDate);
//   const bucketParams = {
//     Bucket,
//     Key: `games/${gameName}/${gameName.toLowerCase()}-${gameDate}`
//   };

//   const data = await s3.getObject(bucketParams).promise();
//   console.log(data);
//   return data;
//   // Promise.resolve(1);
// };

// module.exports = { getLatestGame };