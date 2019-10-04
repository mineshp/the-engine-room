const createError = require('http-errors');
const shortid = require('shortid');

const {
  getAllPlayersForGame,
  togglePlayerAvailability,
  createPlayer,
  getPlayersById,
  getAllPlayers
} = require('./db');

const sortByDate = (a, b) => {
  if (a.confirmationTime < b.confirmationTime) { return -1; }
  if (a.confirmationTime > b.confirmationTime) { return 1; }
  return 0;
}

const validatePlayer = (field) => {
  if (field !== 'gameName') {
    createError(400, 'gameName is required');
  }
  if (field !== 'player') {
    createError(400, 'player is required');
  }
  if (field !== 'nickName') {
    createError(400, 'nickName is required');
  }
  if (field !== 'rating') {
    createError(400, 'rating is required');
  }
  return;
};

const allGames = async () => {
  const getPlayers = await getAllPlayers();

  const result = [];
  const map = new Map();
  for (const item of getPlayers) {
      if(!map.has(item.gameId)){
          map.set(item.gameId, true);    // set any value to Map
          result.push({
              gameId: item.gameId,
              gameName: item.gameName
          });
      }
  }
  return result;
}

const getGames = async (ctx) => {

  ctx.body = await allGames();;
}

const getGame = async (ctx) => {
  const { gameName } = ctx.params;

  console.log(gameName);
  const games = await allGames();
  ctx.body = games.find((game) => gameName === game.gameName);
}

const getPlayers = async (ctx) => {
  const { gameId } = ctx.params;
  ctx.body = await getAllPlayersForGame(gameId)
};

const getAvailablePlayers = async (ctx) => {
  const { gameId } = ctx.params;

  const allPlayers = await getAllPlayersForGame(gameId);

  ctx.body = allPlayers.filter((player) => player.available === true)
    .sort(sortByDate);
};

const addNewPlayer = async (ctx) => {
  const { gameId } = ctx.params;
  const newPlayerObj = ctx.request.body;

  try {
    Object.keys(newPlayerObj).forEach((field) => validatePlayer(field));
  } catch (err) {
    ctx.body = err;
  }

  const playerObj = { ...newPlayerObj,
    gameId,
    available: false,
    playerId: shortid.generate()
  }

  ctx.body = await createPlayer(gameId, playerObj);
}

const getFirst10 = async (ctx) => {
  const { gameId } = ctx.params;

  const allPlayers = await getAllPlayersForGame(gameId);

  ctx.body = allPlayers.filter((player) => player.available === true)
    .sort(sortByDate).slice(0, 10);
}

const getSubs = async (ctx) => {
  const { gameId } = ctx.params;

  const allPlayers = await getAllPlayersForGame(gameId);

  ctx.body = allPlayers.filter((player) => player.available === true)
    .sort(sortByDate).slice(10);
}

const setPlayerAvailability = async (ctx) => {
  const { playerId, gameId, availability } = ctx.params;

  ctx.body = await togglePlayerAvailability(playerId, gameId, availability);
}

const getPlayer = async (ctx) => {
  const { playerId } = ctx.params;

  ctx.body = await getPlayersById(playerId);
}

module.exports = {
  getGames,
  getGame,
  getPlayers,
  getAvailablePlayers,
  setPlayerAvailability,
  addNewPlayer,
  getFirst10,
  getSubs,
  getPlayer
}
