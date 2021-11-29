require('dotenv').config();

module.exports= {
    port: process.env.PORT || 8080,
    jwtSecret: process.env.JWT_SECRET,
    dbConfig: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB,
        port: process.env.DB_PORT
    },
}