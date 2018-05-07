exports.check = function(markoCompiler, expect) {
    var taglibLookup = markoCompiler.taglibLookup;
    var lookup = taglibLookup.buildLookup(__dirname, require("fs"));
    var tag = lookup.getTag("nested-foo");

    expect(tag != null).to.equal(true);
    expect(tag.name).to.equal("nested-foo");
};
