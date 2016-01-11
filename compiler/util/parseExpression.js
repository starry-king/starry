'use strict';
var charProps = require('char-props');

const esprima = require('esprima');
const Expression = require('../ast/Expression');
var compiler = require('../');

function convert(node) {
    var builder = compiler.defaultBuilder;

    if (Array.isArray(node)) {
        let nodes = node;
        for (let i=0; i<nodes.length; i++) {
            var converted = convert(nodes[i]);
            if (converted == null) {
                return null;
            }
            nodes[i] = converted;
        }
        return nodes;
    }

    switch(node.type) {
        case 'ArrayExpression': {
            let elements = convert(node.elements);
            if (!elements) {
                return null;
            }
            return builder.arrayExpression(elements);
        }
        case 'AssignmentExpression': {
            let left = convert(node.left);
            if (!left) {
                return null;
            }

            let right = convert(node.right);
            if (!right) {
                return null;
            }

            return builder.assignment(left, right, node.operator);
        }
        case 'BinaryExpression': {
            let left = convert(node.left);
            if (!left) {
                return null;
            }

            let right = convert(node.right);
            if (!right) {
                return null;
            }

            return builder.binaryExpression(left, node.operator, right);
        }
        case 'CallExpression': {
            let callee = convert(node.callee);

            if (!callee) {
                return null;
            }

            let args = convert(node.arguments);
            if (!args) {
                return null;
            }

            return builder.functionCall(callee, args);
        }
        case 'ConditionalExpression': {
            let test = convert(node.test);

            if (!test) {
                return null;
            }

            let consequent = convert(node.consequent);

            if (!consequent) {
                return null;
            }

            let alternate = convert(node.alternate);

            if (!alternate) {
                return null;
            }

            return builder.conditionalExpression(test, consequent, alternate);
        }
        case 'ExpressionStatement': {
            return convert(node.expression);
        }
        case 'FunctionDeclaration':
        case 'FunctionExpression': {
            let name = null;

            if (node.id) {
                name = convert(node.id);
                if (name == null) {
                    return null;
                }
            }

            let params = convert(node.params);
            if (!params) {
                return null;
            }

            let body = convert(node.body);
            if (!body) {
                return null;
            }

            return builder.functionDeclaration(name, params, body);
        }
        case 'Identifier': {
            return builder.identifier(node.name);
        }
        case 'Literal': {
            return builder.literal(node.value);
        }
        case 'LogicalExpression': {
            let left = convert(node.left);
            if (!left) {
                return null;
            }

            let right = convert(node.right);
            if (!right) {
                return null;
            }

            return builder.logicalExpression(left, node.operator, right);
        }
        case 'MemberExpression': {
            let object = convert(node.object);
            if (!object) {
                return null;
            }

            let property = convert(node.property);
            if (!property) {
                return null;
            }

            return builder.memberExpression(object, property, node.computed);
        }
        case 'NewExpression': {
            let callee = convert(node.callee);

            if (!callee) {
                return null;
            }

            let args = convert(node.arguments);
            if (!args) {
                return null;
            }

            return builder.newExpression(callee, args);
        }
        case 'Program': {
            if (node.body && node.body.length === 1) {
                return convert(node.body[0]);
            }
            return null;
        }
        case 'ObjectExpression': {
            let properties = convert(node.properties);
            if (!properties) {
                return null;
            }
            return builder.objectExpression(properties);
        }
        case 'Property': {
            let key = convert(node.key);
            if (!key) {
                return null;
            }
            let value = convert(node.value);
            if (!value) {
                return null;
            }
            return builder.property(key, value);
        }
        case 'ThisExpression': {
            return builder.thisExpression();
        }
        case 'UnaryExpression': {
            let argument = convert(node.argument);
            if (!argument) {
                return null;
            }

            return builder.unaryExpression(argument, node.operator, node.prefix);
        }
        default:
            return null;
    }
}

function parseExpression(src) {
    let jsAST;
    try {
        jsAST = esprima.parse('(' + src + ')');
    } catch(e) {
        var errorIndex = e.index;

        var errorMessage = e.toString();
        if (errorIndex != null && errorIndex >= 0) {
            var srcCharProps = charProps(src);
            errorIndex--; // Account for extra paren added to start
            let line = srcCharProps.lineAt(errorIndex)+1;
            let column = srcCharProps.columnAt(errorIndex)+1;
            errorMessage += ' [Line ' + line + ', Col: ' + column + ']';
        }
        var wrappedError = new Error('Invalid JavaScript expression: ' + src + ' - ' + errorMessage);
        wrappedError.index = errorIndex;
        wrappedError.src = src;
        wrappedError.code = 'ERR_INVALID_JAVASCRIPT_EXPRESSION';
        throw wrappedError;
    }

    var converted = convert(jsAST);
    if (converted == null) {
        converted = new Expression({value: src});
    }

    return converted;
}

module.exports = parseExpression;