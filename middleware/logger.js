const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} at ${Date.now().toString()}!!`);
    next();
};

module.exports = logger;