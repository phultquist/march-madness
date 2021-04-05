export let regions = {
    west: "West",
    east: "East",
    southeast: "Southeast",
    midwest: "Midwest",
    semifinals: "National Semifinals",
    championship: "National Championship"
};

export let rounds = {
    roundOf64: "Round of 64",
    roundOf32: "Round of 32",
    sweetSixteen: "Sweet Sixteen",
    eliteEight: "Elite Eight",
    semifinals: "National Semifinals",
    championship: "National Championship"
}
export class School {
    name: string;
    private tournamentTeams: TournamentTeam[] = [];

    constructor(_name: string) {
        this.name = _name;
    }

    /**
     * Adds a tournamentTeam to the school history
     */
    public addTournamentTeam(team: TournamentTeam) {
        this.tournamentTeams.push(team);
    } 

    /**
     * findTournamentTeams
     */
    public findTournamentTeams(allTeams: TournamentTeam[]) {
        this.tournamentTeams.concat(allTeams.filter(team => team.name == this.name));
    }

    public get history(): TournamentTeam[] {
        return this.tournamentTeams;
    }
    
    public get games() : Game[] {
        let games = [];
        this.tournamentTeams.forEach(team => {
            games.concat(team.games);
        });
        return games;
    }
    
    /**
     * getWins
     */
    public getWins() {
        return this.games.filter(game => game.winner.name == this.name);
    }

    /**
     * getLosses
     */
    public getLosses() {
        return this.games.filter(game => game.loser.name == this.name);
    }
}   

export interface GameTeam {
    name: string;
    seed: number;
    score: number;
    winner: boolean;
}

export interface Game {
    winner: GameTeam;
    loser: GameTeam;
    date: Date;
    region: string;
    round: string;
    overtime?: string;
}

export class TournamentTeam {
    games: Game[];
    region: string;
    seed: number;
    name: string;
    constructor() {
        
    }
}

export class Tournament {
    games: Game[] = [];
    teams: TournamentTeam[] = [];
    year: number;
    constructor() {
        
    }
}