const { dbClient } = require('./dbClient');

const TableName = process.env.TABLE_NAME || 'liga-dev';

const getAllPlayersForGame = async (gameId) => {
  const params = {
    TableName,
    IndexName: 'game-player-index',
    KeyConditionExpression: 'gameId = :gameId',
    ExpressionAttributeValues: {
      ':gameId': gameId
    }
  };

  try {
    const data = (await dbClient.query(params).promise()).Items;
    return data;
  } catch (error) {
    return { error: `AWS - ${error.message}` };
  }
}

const togglePlayerAvailability = async (playerId, gameId, availability) => {
  const params = {
    TableName,
    Key: {
      playerId,
      gameId
    },
    UpdateExpression: 'set available = :availability, confirmationTime = :lastUpdated',
    ExpressionAttributeValues: {
      ':availability': availability === 'true' ? true : false,
      ':lastUpdated': new Date().toISOString()
    },
    ReturnValues: 'UPDATED_NEW'
  };

  return dbClient.update(params).promise()
    .catch((e) => JSON.stringify({ error: e }));
};

const createPlayer = async (gameId, newPlayerObj) => {
  const params = {
    TableName,
    Item: newPlayerObj
  };

  return dbClient.put(params).promise()
    .catch((e) => JSON.stringify({ error: e }));
};

const getPlayersById = async (playerId) => {
  const params = {
    TableName,
    KeyConditionExpression: 'playerId = :p',
    ExpressionAttributeValues: {
      ':p': playerId
    }
  };

  try {
    const data = (await dbClient.query(params).promise()).Items;
    return data[0];
  } catch (error) {
    return { error: `AWS - ${error.message}` };
  }
};

const getAllPlayers = async () => {
  const params = {
    TableName,
    ProjectionExpression: "gameId, gameName"
  };

  try {
    const data = (await dbClient.scan(params).promise()).Items;
    return data;
  } catch (error) {
    return { error: `AWS - ${error.message}` };
  }
};

module.exports = {
  getAllPlayersForGame,
  togglePlayerAvailability,
  createPlayer,
  getPlayersById,
  getAllPlayers
}