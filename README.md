# The Engine Room

## Development

### Validate the serverless.yaml file is correct

```bash
sls deploy --noDeploy --stage dev
```

### How to run serverless offline mode locally

```bash
sls -- offline
```

### Access app endpoint

```http
http://localhost:3000/api
```

### How to deploy to production

```bash
AWS_PROFILE=min-aws sls deploy
```

## DB Admin

### Add player

```bash
AWS_PROFILE=min-aws aws dynamodb put-item --table-name <table-name> --item file://data/db/addPlayer.json
```

### Add multiple players

```bash
AWS_PROFILE=min-aws aws dynamodb batch-write-item --request-items file://data/db/addPlayers.json
```

## Endpoints

### See all players for a game

``` bash
http://localhost:3000/api/dev/game/ZNHSGH/players
```

### See all available players for a game

``` bash
http://localhost:3000/api/dev/game/ZNHSGH/players/available
```

### Switch player availability

Set query string parameter available to true or false

``` bash
http://localhost:3000/api/dev/player/XYZGHJ?available=true
```

### Pick teams

``` bash
http://localhost:3000/api/dev/game/ZNHSGH/pickTeams
```

### Add player to game

``` bash
http://localhost:3000/api/dev/player/add/ZNHSGH
```

POST Data JSON

``` json
{
  "gameName": "TNF",
  "player": "minesh",
  "nickName": "mins",
  "rating": 2
}
```

### Get First 10

``` bash
http://localhost:3000/api/dev/game/:gameId/getFirst10
```

### Get Subs

``` bash
http://localhost:3000/api/dev/game/:gameId/getSubs
```

### Add game

``` bash
http://localhost:3000/api/dev/game/add
```

### See all games

``` bash
http://localhost:3000/api/dev/games/all
```

### Get a player by playerId

``` bash
http://localhost:3000/api/dev/player/:playerId
```
