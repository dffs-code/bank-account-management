if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

module.exports = {
  dialect: 'mysql',
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  define: {
    timestamps: true,
    },
}