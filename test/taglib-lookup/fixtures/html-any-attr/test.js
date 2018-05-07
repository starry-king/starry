exports.check = function(markoCompiler, expect) {
    var taglibLookup = markoCompiler.taglibLookup;
    var lookup = taglibLookup.buildLookup(__dirname, require("fs"));

    var attrDef = lookup.getAttribute("div", "blah");
    expect(attrDef).to.be.an("object");
};
