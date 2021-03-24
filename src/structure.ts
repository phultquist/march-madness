type Region = "West" | "East" | "Southeast" | "Midwest" | "National Semifinals" | "National Championship";
type Round = "Round of 64" | "Round of 32" | "Sweet Sixteen" | "Elite Eight" | "National Semifinals" | "National Championship";

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
    region: Region;
    round: Round;
    overtime?: string;
}

export interface TournamentTeam {
    games: Game[];
    region: Region;
    seed: number;
    name: string;
}

export class Tournament {
    games: Game[] = [];
    teams: TournamentTeam[] = [];
    year: number;
    constructor() {
        
    }
}