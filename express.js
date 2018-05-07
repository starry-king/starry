var isDebug = require("./env").isDebug;
var target = isDebug ? "./src/express" : "./dist/express";

module.exports = module.parent
    ? module.parent.require(target)
    : require(target);
