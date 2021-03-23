"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
let games = [];
fs.createReadStream("data.csv")
    .pipe(csv_parser_1.default())
    .on('data', data => {
    let winner = {
        name: data.Winner,
        score: data["Winning Score"],
        seed: data["Winning Seed"],
        winner: true
    };
    let loser = {
        name: data.Loser,
        score: data["Losing Score"],
        seed: data["Losing Seed"],
        winner: false
    };
    games.push({
        winner,
        loser,
        date: toDate(data.Date),
        region: data.Region,
        overtime: data.Overtime,
        round: data.Round
    });
})
    .on('end', () => {
    console.log("Data Read!");
    parseData(games);
});
const parseData = (games) => {
    let tournaments = [];
    games.forEach(game => {
        let year = game.date.getFullYear(), tournament = tournaments.find(t => t.year == year);
        if (tournament == undefined || tournament == null) {
            tournaments.push({
                year,
                teams: [],
                games: [game]
            });
        }
        else {
            tournament.games.push(game);
        }
    });
    tournaments.sort((a, b) => a.year - b.year); // probably not a necessary line, depending on if input data is sorted
    tournaments.forEach(tournament => {
        let games = tournament.games;
        games.forEach(game => {
            [game.winner, game.loser].forEach(teamInGame => {
                let team = tournament.teams.find(t => t.name == teamInGame.name);
                if (team == undefined || team == null) {
                    tournament.teams.push({
                        name: teamInGame.name,
                        games: [game],
                        region: game.region,
                        seed: teamInGame.seed
                    });
                }
                else {
                    team.games.push(game);
                }
            });
        });
    });
    console.log(tournaments[0].teams.sort((a, b) => b.games.length - a.games.length)[0]);
};
const toDate = (text) => {
    let split = text.split("/");
    var year = parseInt(split[2]);
    var month = parseInt(split[0]);
    var day = parseInt(split[1]);
    return new Date(year < 20 ? 2000 + year : year, month - 1, day);
};
