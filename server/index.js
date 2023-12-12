const express = require("express");
const dotenv  = require("dotenv");
const dbConnect = require("./dbConnect");
const authRouter = require('./routers/authRouter');
dotenv.config('./.env');
const app = express();
const morgan = require('morgan');

// middlewares

app.use(express.json());
app.use(morgan('common'));


app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.status(200).send('OK from Server');
})

const PORT = process.env.PORT || 4000;

dbConnect();
app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});

// bVpP16aNsEWYDFNV