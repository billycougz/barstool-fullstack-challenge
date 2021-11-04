import fetch from "node-fetch";
import { getDb } from "./db.js";

const availableFeeds = [
  {
    name: "mlb",
    endpoint: "https://chumley.barstoolsports.com/dev/data/games/eed38457-db28-4658-ae4f-4d4d38e9e212.json",
  },
  {
    name: "nba",
    endpoint: "https://chumley.barstoolsports.com/dev/data/games/6c974274-4bfc-4af8-a9c4-8b926637ba74.json",
  },
];

const errorMap = {
  NO_LEAGUE: { id: 1, status: 400, msg: "No league was provided" },
  INVALID_LEAGUE: { id: 2, status: 400, msg: "The league provided is invalid" },
  DATABASE_INSERTION: { id: 3, status: 500, msg: "There was an error on our end" },
};

const handleError = (error, res) => {
  const { id, status, msg } = error;
  console.error(id, status, msg);
  res.status(status).json({ error: msg });
};

const isValidCache = (document) => {
  if (document) {
    const cacheExpirationInMs = 15000;
    const msSinceUpdate = new Date() - new Date(document._id.getTimestamp());
    const secondsUntilExpiration = (cacheExpirationInMs - msSinceUpdate) / 1000;
    if (secondsUntilExpiration > 0) {
      console.log(`Cache expires in ${secondsUntilExpiration} seconds`);
      return true;
    }
    console.log(`Cache expired ${secondsUntilExpiration * -1} seconds ago`);
    return false;
  }
  console.log("No data in cache");
  return false;
};

const getBoxscoreData = (req, res, next) => {
  const requestedFeed = availableFeeds.find((feed) => feed.name === req.query.league);
  if (!requestedFeed) {
    const error = req.query.league ? errorMap.INVALID_LEAGUE : errorMap.NO_LEAGUE;
    handleError(error, res);
    return;
  }
  console.log(`Checking ${requestedFeed.name} collection for valid cache`);
  const db = getDb();
  db.collection(requestedFeed.name)
    .findOne({})
    .then(async (document) => {
      if (isValidCache(document)) {
        console.log(`Returning data from ${requestedFeed.name} cache`);
        res.send(document);
      } else {
        if (document) {
          db.collection(requestedFeed.name).deleteOne({ _id: document._id });
          console.log(`Deleted expired document ${document._id} from ${requestedFeed.name} cache`);
        }
        console.log(`Fetching data from ${requestedFeed.name} feed`);
        const feedResponse = await fetch(requestedFeed.endpoint);
        const feedData = await feedResponse.json();
        db.collection(requestedFeed.name).insertOne(feedData, function (err, result) {
          if (err) {
            handleError(errorMap.DATABASE_INSERTION, res);
          } else {
            console.log(`Added feed data into ${requestedFeed.name} cache with document id ${result.insertedId}`);
            console.log("Returning data to client");
            res.status(200).send(feedData);
          }
        });
      }
    });
};

export default getBoxscoreData;
