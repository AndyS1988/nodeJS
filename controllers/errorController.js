"use strict";

const httpStatus = require("http-status-codes");

module.exports = {
    logErrors: (error, req, res, next) => {
        console.error(error.stack);
        next(error);
    },
    respondNoResourceFound: (req, res) => {
        let errorCode = httpStatus.NOT_FOUND;
        res.status(errorCode);
        res.render("error");
        
    },
    respondInternalError: (error, req, res, next) => {
        let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
        console.error(`ERROR Ocured: ${error.stack}`);
        res.status(errorCode);
        res.send(`${errorCode} | Sorry our application is taking a nap!`);
    }
}