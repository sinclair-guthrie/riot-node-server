const fetch = require('node-fetch');
require('dotenv').config();
const apiKey = process.env.RIOT_API;

const options = {
    headers: { "X-Riot-Token": apiKey }
}

// summFetch makes a fetch call using summoner name - returns a JSON obj with the "accountId" property used for other api calls
const summFetch = function(summName) {
    let summUrl = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summName;
    return fetch(summUrl, options).then(res => res.json());
}

// matchHist makes a fetch call using private user ID - returns a JSON obj with match history info. listLength determines the total number of matches pulled, starting with the most recent
const matchHist = function(privUid, listLength) {
    let matchHist = "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" + privUid + "?endIndex=" + listLength;
    return fetch(matchHist, options).then(res => res.json());
}

// matchData makes a fetch call using the "gameId" property - returns a JSON obj with the data on that specific game
const matchData = function(gameId) {
    let gameUrl = "https://na1.api.riotgames.com/lol/match/v4/matches/" + gameId;
    return fetch(gameUrl, options).then(res => res.json());
}


exports.summFetch = summFetch;
exports.matchHist = matchHist;
exports.matchData = matchData;