
const express = require("express"); //Importerer modulet express
const app = express();
const port = 8080;
const sqlite3 = require('sqlite3');

app.use(express.json());

const db = new sqlite3.Database('db.sqlite3');
//Run this code only first time to create the database

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, userId INTEGER, FOREIGN KEY(userId) REFERENCES users(id))');
    db.run('CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, ticketType TEXT, date DATE, customerId INTEGER, environmentId INTEGER, dataCategoryId INTEGER, FOREIGN KEY(userId) REFERENCES users(id), FOREIGN KEY(customerId) REFERENCES customers(id), FOREIGN KEY(environmentId) REFERENCES environments(id), FOREIGN KEY(dataCategoryId) REFERENCES dataCategories(id))');
    db.run('CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS customerCategories (id INTEGER PRIMARY KEY AUTOINCREMENT, categoryId INTEGER, customerId INTEGER, FOREIGN KEY(categoryId) REFERENCES category(id), FOREIGN KEY(customerId) REFERENCES customers(id))');
    db.run('CREATE TABLE IF NOT EXISTS environments (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS customerEnvironments (id INTEGER PRIMARY KEY AUTOINCREMENT, environmentId INTEGER, customerId INTEGER, FOREIGN KEY(environmentId) REFERENCES environments(id), FOREIGN KEY(customerId) REFERENCES customers(id))');
});

insertDummyData();
function insertDummyData() {
    //Check if data already exists
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        if (rows.length === 0) {
            db.serialize(() => {
                //Dummy users
                db.run('INSERT INTO users (username, password) VALUES ("henrik.andersen@kmd.dk", "1234")');
                db.run('INSERT INTO users (username, password) VALUES ("hans.hansen@kmd.dk", "1234")');

                //Dummy customers
                db.run('INSERT INTO customers (name, userId) VALUES ("Banedanmark", 1)');
                db.run('INSERT INTO customers (name, userId) VALUES ("Lægemiddelstyrelsen", 1)');
                db.run('INSERT INTO customers (name, userId) VALUES ("E-Boks", 2)');
                db.run('INSERT INTO customers (name, userId) VALUES ("Københavns Kommune", 2)');
                db.run('INSERT INTO customers (name, userId) VALUES ("Aalborg Kommune", 2)');

                //Dummy categories
                db.run('INSERT INTO category (name) VALUES ("Patching")');
                db.run('INSERT INTO category (name) VALUES ("Backup")');
                db.run('INSERT INTO category (name) VALUES ("Logs")');
                db.run('INSERT INTO category (name) VALUES ("Antivirus")');
                db.run('INSERT INTO category (name) VALUES ("Monitoring")');
                db.run('INSERT INTO category (name) VALUES ("Security")');
                db.run('INSERT INTO category (name) VALUES ("Reporting")');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (1, 1)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (2, 1)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (3, 1)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (4, 1)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (2, 2)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (3, 2)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (4, 2)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (5, 2)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (1, 3)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (4, 3)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (5, 3)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (3, 3)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (1, 4)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (3, 4)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (4, 4)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (6, 4)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (7, 4)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (1, 5)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (2, 5)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (4, 5)');
                db.run('INSERT INTO customerCategories (categoryId, customerId) VALUES (3, 5)');

                //Dummy environments
                db.run('INSERT INTO environments (name) VALUES ("User test")');
                db.run('INSERT INTO environments (name) VALUES ("Staging")');
                db.run('INSERT INTO environments (name) VALUES ("Pre. prod")');
                db.run('INSERT INTO environments (name) VALUES ("Prod")');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (1, 1)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (2, 1)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (3, 1)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (4, 1)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (2, 2)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (4, 2)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (1, 3)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (2, 3)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (3, 3)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (4, 3)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (4, 4)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (1, 5)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (3, 5)');
                db.run('INSERT INTO customerEnvironments (environmentId, customerId) VALUES (4, 5)');
            });
        } else {
            console.log('Data already exists');
        }
    });
}

//Login
app.post('/api/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            console.log(err.message);
        } else {
            if (row) {
                delete row.password;
                res.status(200).send(row);
            } else {
                res.status(401).send({ message: 'Forkert brugernavn eller password' });
            }
        }
    });
});

//Fetch customers by userid
app.get('/api/users/:userId/customers', (req, res) => {
    let userId = req.params.userId;
    db.all('SELECT * FROM customers WHERE userId = ?', [userId], (err, rows) => {
        if (err) {
            console.log(err.message);
        } else {
            res.status(200).send(rows);
        }
    });
});

//Fetch environments by customerid
app.get('/api/customers/:customerId/environments', (req, res) => {
    let customerId = req.params.customerId;
    db.all('SELECT * FROM environments WHERE id IN (SELECT environmentId FROM customerEnvironments WHERE customerId = ?)', [customerId], (err, rows) => {
        if (err) {
            console.log(err.message);
        } else {
            res.status(200).send(rows);
        }
    });
});

//Fetch categories by customerid
app.get('/api/customers/:customerId/categories', (req, res) => {
    let customerId = req.params.customerId;
    db.all('SELECT * FROM category WHERE id IN (SELECT categoryId FROM customerCategories WHERE customerId = ?)', [customerId], (err, rows) => {
        if (err) {
            console.log(err.message);
        } else {
            res.status(200).send(rows);
        }
    });
});

//Create ticket in database
app.post('/api/users/:userId/tickets', (req, res) => {
    let userId = req.params.userId;
    let ticket = req.body;
    db.run('INSERT INTO tickets (userId, ticketType, date, customerId, environmentId, dataCategoryId) VALUES (?, ?, ?, ?, ?, ?)', [userId, ticket.ticketType, ticket.date, ticket.customer, ticket.environment, ticket.dataCategory], (err) => {
        if (err) {
            console.log(err.message);
        } else {
            res.status(201).send({ message: 'Ticket oprettet' });
        }
    });
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server lytter på port ${port}`) //Serveren lytter på port 8080
});