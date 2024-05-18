import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import levelup from 'levelup';
import leveldown from 'leveldown';
import encode from 'encoding-down';
import { protectWithOneKey } from './auth/auth';
import { getUserData, updateUserData } from './handlers/user';
import * as dotenv from 'dotenv';
// Load up the .env file FIRST, before anything else
dotenv.config();
const db = levelup(encode(leveldown('./db'), { valueEncoding: 'json' }));

const app = express();

// Rate limiter (ai generated? i dont remember)
const limiter = rateLimit({
	windowMs: 120 * 60 * 1000, // 2 hours
	max: 2000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter);

// app.use(cors({
//     origin: process.env.ORIGIN_SITE
// }));
app.use(cors());

app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const port = 8080;

app.get('/', (req, res) => {
	res.send("Success!")
	res.status(200)
})

// anywhere within /api is protected
app.use('/api', protectWithOneKey)

// these routes called after /api
app.post('/api/getdata', getUserData)
app.post('/api/updatedata', updateUserData)

app.listen(port, () => {
    console.log('Express server initialized on ' + String(port));
});

export default db