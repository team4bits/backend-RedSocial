const genericMiddleware = require("./genericMiddleware");
const userMiddleware = require("./userMiddleware");
const tagMiddleware = require("./tagMiddleware");
const commentMiddleware = require("./commentMiddleware");
const archiveMiddleware = require("./archiveMiddleware")
const postMiddleware = require("./postMiddleware")

module.exports = { genericMiddleware, commentMiddleware, userMiddleware, tagMiddleware, archiveMiddleware, postMiddleware};