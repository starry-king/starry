var cache = require("./cache");

var types = require("./types");
var loaders = require("./loaders");
var DependencyChain = require("./DependencyChain");

function loadTaglibFromProps(taglib, taglibProps, fs) {
    return loaders.loadTaglibFromProps(taglib, taglibProps, null, fs);
}

function loadTaglibFromFile(filePath, fs) {
    return loaders.loadTaglibFromFile(filePath, fs);
}

function clearCache() {
    cache.clear();
}

function createTaglib(filePath) {
    return new types.Taglib(filePath);
}

function loadTag(tagProps, filePath, fs) {
    var tag = new types.Tag(filePath);
    loaders.loadTagFromProps(
        tag,
        tagProps,
        new DependencyChain(filePath ? [filePath] : []),
        fs
    );
    return tag;
}

exports.clearCache = clearCache;
exports.createTaglib = createTaglib;
exports.loadTaglibFromProps = loadTaglibFromProps;
exports.loadTaglibFromFile = loadTaglibFromFile;
exports.loadTag = loadTag;
