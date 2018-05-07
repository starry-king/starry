var jsonFileReader = require("./json-file-reader");
var types = require("./types");
var cache = require("./cache");
var loaders = require("./loaders");

var ok = require("assert").ok;

function loadFromFile(filePath, fs) {
    ok(filePath, '"filePath" is required');

    var taglib = cache.get(filePath);

    // Only load a taglib once by caching the loaded taglibs using the file
    // system file path as the key
    if (!taglib) {
        taglib = new types.Taglib(filePath);
        cache.put(filePath, taglib);

        var taglibProps = jsonFileReader.readFileSync(filePath, fs);
        loaders.loadTaglibFromProps(taglib, taglibProps, null, fs);
    }

    return taglib;
}

module.exports = loadFromFile;
