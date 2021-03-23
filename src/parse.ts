import * as fs from 'fs'
import csv from "csv-parser";
import { School, Tournament, TournamentTeam, Game, GameTeam } from './structure'

const run = async ():Promise<void> => {
    let gamesData = await readData();
    let games = getGames(gamesData);
    let tournaments = getTournaments(games);
    let schools = getSchools(tournaments);
}

const getGames = (fullData: any[]): Game[] => {
    let games: Game[] = [];
    fullData.forEach(data => {
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
    });

    return games;
}


const readData = (): Promise<any[]> => {
    let allData = [];
    let readStream = fs.createReadStream("data.csv")
        .pipe(csv())
        .on('data', data => {
            allData.push(data);
        })

    return new Promise((resolve, reject) => {
        readStream.on('end', () => resolve(allData));
    });
}


const getTournaments = (games: Game[]): Tournament[] => {
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
                } else {
                    team.games.push(game);
                }
            });
        });
    });

    return tournaments;
}

const getSchools = (tournaments: Tournament[]): School[] => {
    let schools: School[] = [];
    tournaments.forEach(tournament => {
        tournament.teams.forEach(team => {
            let school = schools.find(s => s.name == team.name);
            if (school == undefined || school == null) {
                school = new School(team.name);
                school.addTournamentTeam(team);
                schools.push(school);
            } else {
                school.addTournamentTeam(team);
            }
        });
    });

    return schools;
}

const toDate = (text: string): Date => {
    let split = text.split("/");
    var year = parseInt(split[2]);
    var month = parseInt(split[0]);
    var day = parseInt(split[1]);

    return new Date(year < 20 ? 2000 + year : year, month - 1, day)
}

run();