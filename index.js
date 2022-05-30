const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const DbConnect = require('./dataBase/DbConnect')
const { oneSpendRoute, usersRoute, monthRoute } = require('./Routes/router')

require('dotenv/config');

app.use(cors());
app.use(bodyParser.json());

app.use('/oneSpend', oneSpendRoute);
app.use('/user', usersRoute)
app.use('/month', monthRoute)



app.get('/', (req, res) => {
    res.status(200).send('working')
})


DbConnect();

app.listen(process.env.PORT, () => console.log(`listening at ${process.env.PORT}`))