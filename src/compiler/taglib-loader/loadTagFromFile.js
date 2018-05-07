var jsonFileReader = require("./json-file-reader");
var types = require("./types");
var cache = require("./cache");
var loaders = require("./loaders");

var ok = require("assert").ok;

function loadTagFromFile(filePath, fs) {
    ok(filePath, '"filePath" is required');

    var tag = cache.get(filePath);

    // Only load a tag once by caching the loaded tags using the file
    // system file path as the key
    if (!tag) {
        tag = new types.Tag(filePath);
        cache.put(filePath, tag);

        var tagProps = jsonFileReader.readFileSync(filePath, fs);
        loaders.loadTagFromProps(tag, tagProps, fs);
    }

    return tag;
}

module.exports = loadTagFromFile;
