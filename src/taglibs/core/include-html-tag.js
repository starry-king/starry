"use strict";

var resolveFrom = require("resolve-from");

module.exports = function codeGenerator(el, codegen) {
    let argument = el.argument;
    let context = codegen.context;
    if (!argument) {
        return;
    }

    let builder = codegen.builder;
    let pathExpression = builder.parseExpression(argument);
    if (
        pathExpression.type !== "Literal" ||
        typeof pathExpression.value !== "string"
    ) {
        codegen.addError(
            'Argument to the <include-html> tag should be a string value: <include-html("./foo.txt")/>'
        );
        return;
    }

    var path = pathExpression.value;
    var dirname = codegen.context.dirname;
    try {
        path = resolveFrom(dirname, path);
    } catch (e) {
        codegen.addError("File not found: " + path);
        return;
    }

    var txt = context.fs.readFileSync(path, { encoding: "utf8" });
    return builder.text(
        builder.literal(txt),
        false /* do not escape since this is HTML*/
    );
};
