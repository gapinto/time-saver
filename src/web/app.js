import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

class Application {
    
    constructor() {
        dotenv.config({ path: '.env' });
        this.express = express();
        this.setConfig();
    }

    setConfig() {
        //Allows us to receive requests with data in json format
        this.express.use(bodyParser.json({ limit: '50mb' }));
    
        //Allows us to receive requests with data in x-www-form-urlencoded format
        this.express.use(bodyParser.urlencoded({ limit: '50mb', extended:true}));
    
        //Enables cors   
        this.express.use(cors());
      }
}

module.exports = new Application();