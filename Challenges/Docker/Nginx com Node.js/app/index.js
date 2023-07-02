const express = require('express')
const app = express();
const port = 3000;
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
}

const mysql = require('mysql');

const connection = mysql.createConnection(config);

const sqlCreate = `CREATE TABLE if not exists people (id INT AUTO_INCREMENT, name VARCHAR(255), PRIMARY KEY (id));`
connection.query(sqlCreate)

const insertSQL = `INSERT INTO people(name) values('Hugaleno rocks too!')`
connection.query(insertSQL)

app.get('/', async (req, res) => {
  let html = '<h1>Full Cycle Rocks!!</h1>';
  html += "<ul>"
  const people = await getPeople();
  people.forEach(people => {
    html += '<li>'+ people.name +'</li>'
  });
  

  html += "</ul>"
  res.send(html)
})
app.listen(port, () => {
  console.log('Rodando na porta ' + port);
})


function getPeople() {
   return new Promise((resolve, reject) => {
    const selectSQL = `SELECT * FROM people;`
    connection.query(
      selectSQL,
      null,
      (err, result) => {
        return err ? reject(err) : resolve(result);
      }
    );
   })
  
}