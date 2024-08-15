// TODO: Store sensitive keys and configuration here
module.exports = {
    mongoURI: process.env.MONGO_URI || 'your-mongo-db-connection-string',
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
    gpsApiKey: process.env.GPS_API_KEY || 'your-gps-api-key',
    emailApiKey: process.env.EMAIL_API_KEY || 'your-email-api-key'
};
