import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import levelup from 'levelup';
import leveldown from 'leveldown';
import encode from 'encoding-down';
import { protectWithOneKey } from './auth/auth';
import { getUserDataOneKey, updateUserDataOneKey } from './handlers/user';
import * as dotenv from 'dotenv';
// Load up the .env file FIRST, before anything else
dotenv.config();
const db = levelup(encode(leveldown('./db'), { valueEncoding: 'json' }));
const port = process.env.PORT || 8080;
const app = express();

// Rate limiter (ai generated? i dont remember)
const limiter = rateLimit({
	windowMs: 120 * 60 * 1000, // 2 hours
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// 450 is the amount you would get contacted if you got a update data every second
const lightLimit = rateLimit({
	windowMs: 120 * 60 * 1000, // 2 hours
	max: 500,
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const allowedOrigins = [
	'http://localhost:3000',
	'http://localhost:3000/To-doz-React',
	'https://zarmdev.github.io/To-doz-React/',
];

// Use of AI here.
app.use(cors({
	origin: function (origin, callback) {
		// allow requests with no origin 
		// (like mobile apps or curl requests)
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) === -1) {
			var msg = 'The CORS policy for this site does not ' +
				'allow access from the specified Origin.';
			return callback(new Error(msg), false);
		}
		return callback(null, true);
	}
}));

// app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get('/', limiter, (req, res) => {
	res.send("Success!")
	res.status(200)
})

// anywhere within /api is protected
app.use('/api', protectWithOneKey)

// these routes called after /api
app.post('/api/getdata', limiter, getUserDataOneKey)
app.post('/api/updatedata', lightLimit, updateUserDataOneKey)

app.listen(port, () => {
	console.log('Express server initialized on ' + String(port));
});

export default db