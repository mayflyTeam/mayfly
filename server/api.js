import express from 'express';
import cors from 'cors';
import router from './src/routes/router.js'


const app = express();
app.use(cors());


app.use("/", router)


const PORT = 3001;
app.listen(PORT, () => {
  console.log('Port running on', PORT);
});

