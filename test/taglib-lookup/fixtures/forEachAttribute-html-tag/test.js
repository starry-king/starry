exports.check = function(markoCompiler, expect) {
    var taglibLookup = markoCompiler.taglibLookup;
    var lookup = taglibLookup.buildLookup(__dirname, require("fs"));

    var hasHrefAttr = false;

    lookup.forEachAttribute("a", attr => {
        if (attr.name === "href") {
            hasHrefAttr = true;
        }
    });

    expect(hasHrefAttr).to.equal(true);
};
