"use strict";

const httpStatus = require("http-status-codes");

module.exports = {
    pageNotFound: (req, res) => {
        let errorCode = httpStatus.NOT_FOUND;
        res.status(errorCode);
        res.render("error");
        
    },
    internalServerError: (error, req, res, next) => {
        let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
        console.error(`ERROR Ocured: ${error.stack}`);
        res.status(errorCode);
        res.send(`${errorCode} | Sorry our application is taking a nap!`);
    }
}