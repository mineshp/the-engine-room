const serverless = require('serverless-http');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const convert = require('koa-convert');

const {
  getGames,
  getGame,
  getPlayers,
  getAvailablePlayers,
  setPlayerAvailability,
  addNewPlayer,
  getFirst10,
  getSubs,
  getPlayer
} = require('./controller');

const app = new Koa();

const whitelist = process.env.WHITELIST
  ? process.env.WHITELIST.split(',')
  : [];

const checkOriginAgainstWhitelist = (ctx) => {
  const requestOrigin = ctx.accept.headers.origin;
  if (!whitelist.includes(requestOrigin)) {
    return ctx.throw(`🙈 ${requestOrigin} is not a valid origin`);
  }
  return requestOrigin;
};

app.use(convert(cors({ origin: checkOriginAgainstWhitelist })));
app.use(koaBody());
app.use(bodyParser());

const router = new Router();
router.get('/api', (ctx) => {
  ctx.body = JSON.stringify({ message: 'Welcome to the engine room api' });
});

router.get('/api/games', getGames);
router.get('/api/games/:gameName', getGame);
router.get('/api/game/:gameId/players', getPlayers);
router.get('/api/game/:gameId/players/available', getAvailablePlayers);
router.get('/api/game/:gameId/getFirst10', getFirst10);
router.get('/api/game/:gameId/getSubs', getSubs);
router.get('/api/player/:playerId/profile', getPlayer);
router.put('/api/player/:playerId/:gameId/available/:availability', setPlayerAvailability);
router.post('/api/player/add/:gameId', addNewPlayer);

app.on('error', (err) => {
  console.log('server error', err);
});

app.use(router.routes());

module.exports = app;