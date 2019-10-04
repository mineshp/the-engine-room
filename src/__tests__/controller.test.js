const request = require('supertest');
const app = require('../index');
const db = require('../db');
const s3 = require('../s3');


jest.mock('../db');
jest.mock('../s3');

const players = [
  {
    gameName: 'testGame',
    available: false,
    gameId: '12345',
    playerId: 'ABCDEF',
    player: 'firmino',
    confirmationTime: "2019-09-10T16:07:16.356Z"
  },
  {
    gameName: 'testGame',
    available: true,
    gameId: '12345',
    playerId: 'ABCDEG',
    player: 'salah',
    confirmationTime: "2019-09-10T17:07:16.356Z"
  },
  {
    gameName: 'testGame',
    available: true,
    gameId: '12345',
    playerId: 'ABCDEH',
    player: 'mane',
    confirmationTime: "2019-09-10T17:02:16.356Z"
  }
];

describe('Handler engine tests', () => {
  it('retrieves all players', async () => {
    db.getAllPlayersForGame.mockReturnValueOnce(players);

    const { body, statusCode } = await request(app.callback())
      .get('/api/game/12345/players');


    expect(db.getAllPlayersForGame).toBeCalledWith('12345');
    expect(body).toEqual(
      [
        {
          gameName: 'testGame',
          available: false,
          gameId: '12345',
          playerId: 'ABCDEF',
          player: 'firmino',
          confirmationTime: "2019-09-10T16:07:16.356Z"
        },
        {
          gameName: 'testGame',
          available: true,
          gameId: '12345',
          playerId: 'ABCDEG',
          player: 'salah',
          confirmationTime: "2019-09-10T17:07:16.356Z"
        },
        {
          gameName: 'testGame',
          available: true,
          gameId: '12345',
          playerId: 'ABCDEH',
          player: 'mane',
          confirmationTime: "2019-09-10T17:02:16.356Z"
        }
      ]
    );
    expect(statusCode).toBe(200);
  });

  it('retrieves all available players and sorts by earliest confirmationTime', async () => {
    db.getAllPlayersForGame.mockReturnValueOnce(players);

    const { body, statusCode } = await request(app.callback())
      .get('/api/game/12345/players/available');


    expect(db.getAllPlayersForGame).toBeCalledWith('12345');
    expect(body).toEqual(
      [
        {
          gameName: 'testGame',
          available: true,
          gameId: '12345',
          playerId: 'ABCDEH',
          player: 'mane',
          confirmationTime: "2019-09-10T17:02:16.356Z"
        },
        {
          gameName: 'testGame',
          available: true,
          gameId: '12345',
          playerId: 'ABCDEG',
          player: 'salah',
          confirmationTime: "2019-09-10T17:07:16.356Z"
        }
      ]
    );
    expect(statusCode).toBe(200);
  });

  it('sets player A\'s availability to true', async () => {
    db.togglePlayerAvailability.mockReturnValueOnce({});

    const { body, statusCode } = await request(app.callback())
      .put('/api/player/ABCDEF/12345/available/true');

    expect(db.togglePlayerAvailability).toBeCalledWith('ABCDEF', '12345', 'true');

    expect(statusCode).toBe(200);
  });

  it('sets player B\'s availability to false', async () => {
    db.togglePlayerAvailability.mockReturnValueOnce({});

    const { body, statusCode } = await request(app.callback())
      .put('/api/player/ABCDEG/12345/available/false');

    expect(db.togglePlayerAvailability).toBeCalledWith('ABCDEG', '12345', 'false');

    expect(statusCode).toBe(200);
  });

  it('adds a new player', async () => {
    db.createPlayer.mockReturnValueOnce({});

    const { body, statusCode } = await request(app.callback())
      .post('/api/player/add/12345')
      .send({
        "gameName": "championsGame",
        "player": "testPlayer",
        "nickName": "testino",
        "rating": 2
      });

    expect(db.createPlayer).toBeCalledWith('12345', {
      gameName: 'championsGame',
      rating: 2,
      gameId: '12345',
      playerId: expect.any(String),
      player: 'testPlayer',
      available: false,
      nickName: 'testino'
    });

    expect(statusCode).toBe(200);
  });

  it('retrieves a player', async () => {
    db.getPlayersById.mockReturnValueOnce(players[0]);

    const { body, statusCode } = await request(app.callback())
      .get('/api/player/ABCDEF/profile');


    expect(db.getPlayersById).toBeCalledWith('ABCDEF');
    expect(body).toEqual(
      {
        gameName: 'testGame',
        available: false,
        gameId: '12345',
        playerId: 'ABCDEF',
        player: 'firmino',
        confirmationTime: "2019-09-10T16:07:16.356Z"
      }
    );
    expect(statusCode).toBe(200);
  });

  it('retrieves all games', async () => {
    players.push({
      gameName: 'myTestGame',
      available: true,
      gameId: '12346',
      playerId: 'ABCDEH',
      player: 'mane',
      confirmationTime: "2019-09-10T17:02:16.356Z"
    });

    db.getAllPlayers.mockReturnValueOnce(players);

    const { body, statusCode } = await request(app.callback())
      .get('/api/games');

    expect(body).toEqual(
      [
        {
          gameId: '12345',
          gameName: 'testGame'
        },
        {
          gameId: '12346',
          gameName: 'myTestGame'
        }
      ]
    );
    expect(statusCode).toBe(200);
  });

  it('retrieves a game', async () => {
    players.push({
      gameName: 'myTestGame',
      available: true,
      gameId: '12346',
      playerId: 'ABCDEH',
      player: 'mane',
      confirmationTime: "2019-09-10T17:02:16.356Z"
    });

    db.getAllPlayers.mockReturnValueOnce(players);

    const { body, statusCode } = await request(app.callback())
      .get('/api/games/myTestGame');

    expect(body).toEqual(
      {
        gameId: '12346',
        gameName: 'myTestGame'
      }
    );

    expect(statusCode).toBe(200);
  });
});
