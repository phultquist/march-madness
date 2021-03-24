import { readData, getGames, getTournaments, getSchools } from "./parse";

(async () => {
    let gamesData = await readData();
    let games = getGames(gamesData);
    let tournaments = getTournaments(games);
    let schools = getSchools(tournaments);

    let roundOf64PointDifference = games.filter(game => game.round == "National Championship").map(game => game.winner.score - game.loser.score);
    console.log(average(roundOf64PointDifference));

    let dukeWinsByYear = schools.find(school => school.name == "Duke").history.map(team => {
        return { year: team.name, numWins: team.games.filter(game => game.winner.name == team.name).length }
    })
    console.log(dukeWinsByYear);

})();

const average = (array: any[]): number => array.reduce((a, b) => a + b) / array.length;