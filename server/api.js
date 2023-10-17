import express from 'express';
import cors from 'cors';
import { getUrl } from './src/services/backendSpinUp.js';


const app = express();
app.use(cors());

const retrieveUrl = async () => {
  const url = await getUrl()
  console.log(url)
}

retrieveUrl()

