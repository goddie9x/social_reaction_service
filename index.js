require('dotenv').config();

const express = require('express');
const getAuthAndPutCurrentUserAuthToBody = require('./utils/middlewares/getAuthAndPutCurrentUserAuthToBody');
const connectToDiscoveryServer = require('./utils/configs/discovery');
const router = require('./routes');

const PORT = process.env.PORT||3007;
const app = express();

app.use(express.json());
app.use(getAuthAndPutCurrentUserAuthToBody);
app.use(process.env.APP_PATH||'/api/v1/reactions',router);

connectToDiscoveryServer();

const server = app.listen(PORT,()=>{
    console.log('App running in port '+PORT);
});