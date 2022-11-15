// const express = require('express')
// const pg = require('pg');
// const R = require('ramda')

// const app = express();

// app.use()
// app.use(express.json({limit: '50mb'}))
// app.use(express.urlencoded({extended: true, limit: '50mb'}));

// const cs = 'postgres://huantran@localhost:5432/sdc'

// const client = new pg.Client(cs);
// client.connect();

// const PORT = 3000;
// app.listen(PORT, () => console.log('Listening at Port: ', PORT));

const {Client} = require('pg');

// const client = new Client({
//   host: 'localhost',
//   user: 'huantran',
//   port: 5432,
//   password: '',
//   database: 'test'
// });

const cs = 'postgres://huantran@localhost:5432/sdc'
const client = new Client(cs);
client.connect();

client.query('CREATE TABLE IF NOT EXISTS review (id BIGSERIAL PRIMARY KEY NOT NULL, summary VARCHAR(255), body TEXT NOT NULL, rating INT NOT NULL, date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, reviewer_name VARCHAR(100) NOT NULL, reviewer_email VARCHAR(150) NOT NULL, recommended BOOLEAN NOT NULL, helpfulness INT NOT NULL DEFAULT 0, reported BOOLEAN NOT NULL DEFAULT false, product_id BIGINT NOT NULL);')
  .then(() => {
    console.log('Table successfully created')
  })
  .catch(err => {
    console.log(err.message)
  })
  .finally(() => {
    client.end();
  })