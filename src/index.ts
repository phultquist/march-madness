import { readData, getGames, getTournaments, getSchools } from "./parse";

(async () => {
    let gamesData = await readData();
    let games = getGames(gamesData);
    let tournaments = getTournaments(games);
    let schools = getSchools(tournaments);
})();