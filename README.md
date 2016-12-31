# Reactivity #


### Setup Postgres/PostGIS/Knex CLI ###
```
`npm install -g knex`
`brew install postgres`
`brew install postgis`
`createdb reactivity`

Open database CLI: 
`psql reactivity`

Install POSTGIS extension on DB from CLI (command line prompt should read 'reactivity=#'):
`CREATE EXTENSION postgis`

Troubleshoot postgres installation/startup -> `brew info postgres`
```

run
```
npm install
npm start
```
to compile and serve via express



for development with a webpack dev server, run

```
npm run dev
```
