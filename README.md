# march-madness
My first dance with TypeScript

I made this in January and have been updating it recently, but it's a short repo made for statistical analysis of past march madness games, which probably should have been written in R. 

It sets up the infrastructure to answer questions like "How many wins has Duke had in NCAA history" or "What percent of 8 ranked teams won in the round of 64?"

```typescript
let dukeWinsByYear = schools.find(school => school.name == "Duke").history.map(team => {
        return { year: team.name, numWins: team.games.filter(game => game.winner.name == team.name).length }
    });
```

Of course, these could all be done on a spreadsheet, but it sets up the infrastructure for a deeper dive into the data.
