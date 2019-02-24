var JsonDB = require('node-json-db');
var db = new JsonDB("db.json", true, true);
db.push("/game/testunit/surname","Profil de test");