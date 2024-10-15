require('dotenv').config();

const express = require('express');

const PORT = process.env.PORT||3007;
const app = express();

app.use(express.json());

const server = app.listen(PORT,()=>{
    console.log('App running in port '+PORT);
});