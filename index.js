var Logger = require('js-logger');
var markdown = require('markdown').markdown;
var fs = require('fs');

var logLevel = Logger[ (process.env["LOG_LEVEL"] || "warn").trim().toUpperCase() ] || Logger.WARN;
Logger.setLevel(logLevel);

var log = Logger.get("concordion-js");
var transformNodeLog = Logger.get('concordion-js.transformNode');
var transformLinkLog = Logger.get('concordion-js.transformLink');
var resolveLog = Logger.get('concordion-js.resolve');
var perfLog = Logger.get('concordion-js.perf');

var consoleHandler = Logger.createDefaultHandler();
var myHandler = function (messages, context) {
    //jQuery.post('/logs', { message: messages[0], level: context.level });
};

Logger.setHandler(function (messages, context) {
    consoleHandler(messages, context);
    myHandler(messages, context);
});

perfLog.time('runtime');

require('pegjs-require');

perfLog.time('concordion-expr.pegjs');
var cexpr = require('./concordion-expr.pegjs');
perfLog.timeEnd('concordion-expr.pegjs');
//var cexpr = require('./concordion-expr');




perfLog.time('read .md');
var fixtureTemplate = fs.readFileSync('Main.md', 'utf8');
perfLog.timeEnd('read .md');

perfLog.time('markdown.parse');
var fixtureAst = markdown.parse(fixtureTemplate);
perfLog.timeEnd('markdown.parse');

console.log(JSON.stringify(fixtureAst));

var env = {
	split: function (str) {
		log.debug("split " + JSON.stringify(str));
		var parts = str.split(" "); 
		return {firstName: parts[0], lastName: parts[1]};
	}
};

perfLog.time('transformNode');
var transformed = transformNode(env, fixtureAst);
perfLog.timeEnd('transformNode');

// program output
console.log(JSON.stringify(transformed));

log.debug("env = " + JSON.stringify(env));

function resolve (env, cNode) {
	log = resolveLog;

	log.debug("resolve " + JSON.stringify(cNode));

	if (cNode[0] == "Literal") {
		return cNode[1];
	} else if (cNode[0] == "LocalVariable" || cNode[0] == "Variable") {
		var components = cNode[1].split('.');
		var obj = env;
		var propName = components.shift();
		while (obj && propName) {
			// todo handle missing properties
			log.debug("-- " + obj + "." + propName);
			obj = obj[propName];
			propName = components.shift();
		}

		log.debug("--> " + obj);

		return obj;
	} else if (cNode[0] == "Function") {
		var fn = resolve(env, cNode[1]);
		var args = [];

		var nextArg = cNode[2];
		while (nextArg) {
			args.push(resolve(env, nextArg[0]));
			nextArg = nextArg[1];
		}

		log.debug("Call fn " + fn + " with args " + JSON.stringify(args));
		var result = fn.apply(null, args);
		log.debug("Called fn result = " + result);

		return result;
	} else {
		throw new Error("Could not resolve expression", cNode);
	}
}



function transformLink (env, node) {
	var log = transformLinkLog;

	var href = node[1].href;
	var title = node[1].title;
	var label = node[2];

	if (href != "-") { return node; }

	var cNode = cexpr.parse(title);

	if (cNode[0] == "LocalVariable") {
		var varName = cNode[1];
		var varVal = label.trim();
		log.debug("Assign local variable from label: " + varName + " to " + JSON.stringify(varVal));

		env[varName] = varVal;
	}

	if (cNode[0] == "Assign" && cNode[1][0] == "LocalVariable") {
		var varName = cNode[1][1];
		var val = resolve(env, cNode[2]);

		log.debug("Assign local variable " + varName + " to '" + val + "'");
		env[varName] = val;
	}

	if (cNode[0] == "AssertEqual") {
		log.debug("AssertEqual " + JSON.stringify(cNode));
		var expected = label;
		var actual = resolve(env, cNode[1]);

		var truth = actual == expected;

		log.debug("Assert equals... expect " + expected + " = " + actual + "... true? " + truth);
		
		return ["AssertEqual", expected, actual, truth];
	}

	return node;
}


function transformNode (env, node) {
	var log = transformNodeLog;
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

perfLog.timeEnd('runtime');
