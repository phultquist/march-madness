import * as fs from 'fs'
import csv from "csv-parser";

type Region = "West" | "East" | "Southeast" | "Midwest" | "National Semifinals" | "National Championship";

interface GameTeam {
    name: string;
    seed: number;
    score: number;
    winner: boolean;
}

interface Game {
    winner: GameTeam;
    loser: GameTeam;
    date: Date;
    region: Region;
    round: string;
    overtime?: string;
}

interface TournamentTeam {
    games: Game[];
    region: Region;
    seed: number;
    name: string;
}

interface Tournament {
    games: Game[];
    teams: TournamentTeam[];
    year: number;
}

let games: Game[] = [];

fs.createReadStream("data.csv")
    .pipe(csv())
    .on('data', data => {
        let winner: GameTeam = {
            name: data.Winner,
            score: data["Winning Score"],
            seed: data["Winning Seed"],
            winner: true
        };
        let loser: GameTeam = {
            name: data.Loser,
            score: data["Losing Score"],
            seed: data["Losing Seed"],
            winner: false
        }
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

const parseData = (games: Game[]): void => {
    let tournaments: Tournament[] = [];

    games.forEach(game => {
        let year = game.date.getFullYear(),
            tournament = tournaments.find(t => t.year == year);

        if (tournament == undefined || tournament == null) {
            tournaments.push({
                year,
                teams: [],
                games: [game]
            })
        } else {
            tournament.games.push(game)
        }
    });

    tournaments.sort((a,b) => a.year - b.year); // probably not a necessary line, depending on if input data is sorted

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
                } else {
                    team.games.push(game);
                }
            });
        });
    });

    console.log(tournaments[0].teams.sort((a, b) => b.games.length - a.games.length)[0]);
}

const toDate = (text: string): Date => {  
    let split = text.split("/");
    var year = parseInt(split[2]);
    var month = parseInt(split[0]);
    var day = parseInt(split[1]);

    return new Date(year < 20 ? 2000 + year : year, month - 1, day)
}