// TODO: Implement error handling middleware
module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
};
