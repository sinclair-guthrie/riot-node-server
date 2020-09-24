/*
Keeping track of the winners/losers queue algorithm here.
potential variables: 
- first blood
- first tower
- first dragon
- first rift
- your KDA vs team avg

current variables: 
- your KDA vs your opponent KDA

current return values:
-Remake
-Unsupported gametype
-Can't parse the data - someone likely roamed a bunch
-Both perfect KDA
-Perfect KDA
-Enemy perfect KDA
*/
/*
const testJson = require("./test2.json")

let testID = "DaZCHy8A89R2k7KxdvZlj-Zu3jX2rkotppjzLYmdAVRi0kI" */

const matchVal = function(data, privateUid) {
    if (data.gameDuration < 240) {
        return "Remake";
    }
    if (data.queueId !== 400 && data.queueId !== 420 && data.queueId !== 430 && data.queueId !== 440) {
        return "Unsupported gametype"
    }
    let partId = data.participantIdentities.find(x => x.player.accountId == privateUid).participantId;
    let partInfo = data.participants.find(x => x.participantId == partId);
    let teamId = partInfo.teamId;
    let playerRole;
    let enemyInfo;
    // playerRole is taking the value from one of two fields in riot's data: "role" or "lane". values are: MIDDLE, TOP, JUNGLE, DUO_CARRY, DUO_SUPPORT
    if (partInfo.timeline.lane === "BOTTOM") {
        playerRole = partInfo.timeline.role;
        enemyInfo = data.participants.find(x => {
            return (x.teamId !== teamId && x.timeline.role === playerRole);
        });
    } else {
        playerRole = partInfo.timeline.lane;
        enemyInfo = data.participants.find(x => {
            return (x.teamId !== teamId && x.timeline.lane === playerRole);
        });
    }
    if (playerRole === undefined || enemyInfo === undefined) {
        return "Can't parse the data - someone likely roamed a bunch";
    }
    let partKDA = (partInfo.stats.kills + partInfo.stats.assists) / partInfo.stats.deaths;
    let enemyKDA = (enemyInfo.stats.kills + enemyInfo.stats.assists) / enemyInfo.stats.deaths;
    if (partKDA === Infinity && enemyKDA === Infinity) return "Both perfect KDA"; // testing if both kda's are perfect
    let diff = partKDA - enemyKDA;
    if (diff === Infinity) return "Perfect KDA";
    if (diff === -Infinity) return "Enemy perfect KDA"
    return (diff);
}

exports.matchVal = matchVal;