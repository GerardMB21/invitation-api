require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

//Routers
const { guestsRouter } = require('./routes/guests.routes');
const { escortsRouter } = require('./routes/escorts.routes');

//utils
const { globalErrorHandler } = require('./utils/globalError');
const { AppError } = require('./utils/appError');

app.use(cors());
app.use(express.json());

//set template engine

//limiter
const limiter = rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000, //1hr
    message: 'Number of requests have been exceded'
});

app.use(limiter);

//security headers
app.use(helmet());

//compress response
app.use(compression());

//log incoming requests
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));

//invocate routes
app.use("/api/v1/guests", guestsRouter);
app.use("/api/v1/escorts", escortsRouter);

app.all('*',(req,res,next)=>{
    next(
        new AppError(
			`${req.method} ${req.originalUrl} not found in this server`,
			404
        )
    );
});

app.use(globalErrorHandler);

module.exports = { app };