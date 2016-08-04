var markdown = require('markdown').markdown;
var fs = require('fs');

require('pegjs-require');

var cexpr = require('./concordion-expr.pegjs');
//var cexpr = require('./concordion-expr');


var fixtureTemplate = fs.readFileSync('Main.md', 'utf8');

var fixtureAst = markdown.parse(fixtureTemplate);

console.log(JSON.stringify(fixtureAst));

var env = {
	split: function (str) {
		console.log("split " + JSON.stringify(str));
		var parts = str.split(" "); 
		return {firstName: parts[0], lastName: parts[1]};
	}
};

var transformed = transformNode(env, fixtureAst);

console.log(JSON.stringify(transformed));

console.log("env = " + JSON.stringify(env));



function resolve (env, cNode) {
	console.log("resolve " + JSON.stringify(cNode));

	if (cNode[0] == "Literal") {
		return cNode[1];
	} else if (cNode[0] == "LocalVariable" || cNode[0] == "Variable") {
		var components = cNode[1].split('.');
		var obj = env;
		var propName = components.shift();
		while (obj && propName) {
			// todo handle missing properties
			console.log("-- " + obj + "." + propName);
			obj = obj[propName];
			propName = components.shift();
		}

		console.log("--> " + obj);

		return obj;
	} else if (cNode[0] == "Function") {
		var fn = resolve(env, cNode[1]);
		var args = [];

		var nextArg = cNode[2];
		while (nextArg) {
			args.push(resolve(env, nextArg[0]));
			nextArg = nextArg[1];
		}

		console.log("Call fn " + fn + " with args " + JSON.stringify(args));
		var result = fn.apply(null, args);
		console.log("Called fn result = " + result);

		return result;
	} else {
		throw new Error("Could not resolve expression", cNode);
	}
}

function transformLink (env, node) {
	var href = node[1].href;
	var title = node[1].title;
	var label = node[2];

	if (href != "-") { return node; }

	var cNode = cexpr.parse(title);

	if (cNode[0] == "LocalVariable") {
		var varName = cNode[1];
		var varVal = label.trim();
		console.log("Assign local variable from label: " + varName + " to " + JSON.stringify(varVal));

		env[varName] = varVal;
	}

	if (cNode[0] == "Assign" && cNode[1][0] == "LocalVariable") {
		var varName = cNode[1][1];
		var val = resolve(env, cNode[2]);

		console.log("Assign local variable " + varName + " to '" + val + "'");
		env[varName] = val;
	}

	if (cNode[0] == "AssertEqual") {
		console.log("AssertEqual " + JSON.stringify(cNode));
		var expected = label;
		var actual = resolve(env, cNode[1]);

		var truth = actual == expected;

		console.log("Assert equals... expect " + expected + " = " + actual + "... true? " + truth);
		
		return ["AssertEqual", expected, actual, truth];
	}

	return node;
}


function transformNode (env, node) {
	var result = node;

	if (!Array.isArray(node)) { return node; }

	switch (node[0]) {
		case "link":
			result = transformLink(env, node);
			break;
		default:
			result = node.map(node => transformNode(env, node));
	}

	return result;
}
