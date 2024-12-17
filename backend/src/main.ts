import express from 'express'
import cors from 'cors'
import { loadEnv } from './utils/env.js';
import { authRouter } from './endpoints/auth/auth.js';
import { treeRouter } from './endpoints/tree/tree.js';

const port = 4000;

loadEnv();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Api enpoints
app.use("/auth", authRouter);
app.use("/tree", treeRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})