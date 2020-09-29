const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001
const apiCalls = require('./api-calls.js');
const algo = require('./algo.js');
require('dotenv').config();

app.get('/request/:summName', (req, res) => {
    let matchHistJSON;
    let privateUid;
    apiCalls.summFetch(req.params.summName)
        .then(data => {
            if (data.status === 403) {
                console.log("success");
                res.set("Access-Control-Allow-Origin", "*");
                res.status(403).send("Forbidden");
                return;
            }
            privateUid = data.accountId;
            if (privateUid === undefined) {
                res.set("Access-Control-Allow-Origin", "*");
                res.status(data.status.status_code).send(data.status.message);
                return;
            }
            return apiCalls.matchHist(privateUid, 10)
                .then(data => {
                    matchHistJSON = data;
                    const promArr = [];
                    matchHistJSON.matches.forEach(x => {
                        promArr.push(apiCalls.matchData(x.gameId)
                            .then(data => {
                                let ans = algo.matchVal(data, privateUid);
                                return ans;
                            })
                            .catch(err => {
                                res.set("Access-Control-Allow-Origin", "*");
                                res.send(err);
                                return;
                            })
                        )
                    })
                    return Promise.all(promArr)
                        .then(data => {
                            res.set("Access-Control-Allow-Origin", "*");
                            res.send({
                                "UID": privateUid,
                                "matchData": data
                            });
                        })
                        .catch(err => {
                            res.set("Access-Control-Allow-Origin", "*");
                            res.send(err);
                            return;
                        })
                })
        })
        .catch(err => {
            res.set("Access-Control-Allow-Origin", "*");
            res.send(err);
            return;
        })
})

app.listen(PORT);