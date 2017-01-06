# Reactivity #


### Setup Postgres/PostGIS/Knex CLI ###
```
`npm install -g knex`

Mac
  `brew install postgres`
  `brew install postgis`

Linux
  `sudo apt-get install postgresql`
  `sudo apt-get install postgis`
  `sudo -u postgres psql`
  `CREATE USER [your linux username] SUPERUSER;`
  `sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"`
  `\q`
  add "user: 'postgres', password: 'postgres'" to the connection objects in knexfile.js

Create database and open CLI:
`createdb reactivity`
`psql reactivity`

Install POSTGIS extension on DB from CLI (command line prompt should read 'reactivity=#'):
`CREATE EXTENSION postgis;`

Troubleshoot postgres installation/startup -> `brew info postgres`

After running migration script (npm run dev, npm run backend, or npm start) at least once, seed dev data with: `knex seed:run`
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
