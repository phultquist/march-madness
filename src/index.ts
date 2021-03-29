import * as fs from "fs";
import { readData, getGames, getTournaments, getSchools } from "./parse";
import { rounds, regions } from './structure';

(async () => {
    let gamesData = await readData();
    let games = getGames(gamesData);
    let tournaments = getTournaments(games);
    let schools = getSchools(tournaments);

    let pointDifferencesByRound = Object.values(rounds).map(round => {
        let averagePointDifference = average(games.filter(game => game.round == round).map(game => game.winner.score - game.loser.score));
        return {
            round,
            averagePointDifference
        }
    });

    let dukeWinsByYear = schools.find(school => school.name == "Duke").history.map(team => {
        return { year: team.name, numWins: team.games.filter(game => game.winner.name == team.name).length }
    });

    let allPointDifferences = games.map(game => game.winner.score - game.loser.score);
})();

const average = (array: any[]): number => array.reduce((a, b) => a + b) / array.length;