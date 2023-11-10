import express from 'express';
import cors from 'cors'
import { router } from './routes/router'

const app = express();

app.use(cors())


app.use("/", router)

app.listen(3000, () =>
  console.log('Mayfly server listening on port 3000!'),
);