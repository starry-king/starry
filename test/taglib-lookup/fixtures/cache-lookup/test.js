var nodePath = require("path");

exports.check = function(markoCompiler, expect) {
    var taglibLookup = markoCompiler.taglibLookup;
    var lookup1 = taglibLookup.buildLookup(
        nodePath.join(__dirname, "foo"),
        require("fs")
    );
    var lookup2 = taglibLookup.buildLookup(
        nodePath.join(__dirname, "foo"),
        require("fs")
    );
    var lookup3 = taglibLookup.buildLookup(
        nodePath.join(__dirname, "foo/empty"),
        require("fs")
    );
    var lookup4 = taglibLookup.buildLookup(
        nodePath.join(__dirname, "baz"),
        require("fs")
    );
    expect(lookup1).to.equal(lookup2);
    expect(lookup2).to.equal(lookup3);
    expect(lookup1).to.not.equal(lookup4);
};
