
const FACEBOOK_ACCESS_KEY = {
    TWITTER_CONSUMER_KEY: "SOME KEY",
    TWITTER_CONSUMER_SECRET: "SOME SECRET",
    TWITTER_ACCESS_TOKEN: "SOME ACCESS TOKEN",
    TWITTER_TOKEN_SECRET: "SOME TOKEN SECRET"
};
const SESSION = {
    COOKIE_KEY: "thisappisawesome"
};
const MYSQL_CONFIG = {
    host: process.env.HOST_DB,
    user: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.NAME_DB,
    port: 3307
}
const KEYS = {
    ...FACEBOOK_ACCESS_KEY,
    ...SESSION,
    ...MYSQL_CONFIG
};

module.exports = KEYS;