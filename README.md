# concordion-js
A Javascript implementation of Concordion testing framework. Experiment and WIP

## Status

Experimental.

* Parses Main.md example from Concordion into a tree. 
* Transforms the tree. 
* When it encounters a link with href "-" it processe it as a Concordion expression. 
* It then interprets that, to the point that the assertions in the example are made correctly with debug output.

### Usage

Run it with configurable log level.

`LOG_LEVEL=debug node index.js`

### Output

```
[concordion-js.perf] concordion-expr.pegjs: 83ms
[concordion-js.perf] read .md: 0ms
[concordion-js.perf] markdown.parse: 6ms
["markdown",["header",{"level":1},"Splitting Names"],["para","To help personalise our mailshots we want to have the first name and last name of the customer. \nUnfortunately the customer data that we are supplied only contains full names."],["para","The system therefore attempts to break a supplied full name into its constituents by splitting around whitespace."],["header",{"level":3},["link",{"href":"-","title":"basic"},"Example"]],["para","The full name ",["link",{"href":"-","title":"#name"},"Jane Smith"]," is ",["link",{"href":"-","title":"#result = split(#name)"},"broken"]," into first name ",["link",{"href":"-","title":"?=#result.firstName"},"Jane"]," and last name ",["link",{"href":"-","title":"?=#result.lastName"},"Smith"],"."]]
[concordion-js.transformLink] Assign local variable from label: name to "Jane Smith"
[concordion-js.resolve] resolve ["Function",["Variable","split"],[["LocalVariable","name"],null]]
[concordion-js.resolve] resolve ["Variable","split"]
[concordion-js.resolve] -- [object Object].split
[concordion-js.resolve] --> function (str) {
		log.debug("split " + JSON.stringify(str));
		var parts = str.split(" ");
		return {firstName: parts[0], lastName: parts[1]};
	}
[concordion-js.resolve] resolve ["LocalVariable","name"]
[concordion-js.resolve] -- [object Object].name
[concordion-js.resolve] --> Jane Smith
[concordion-js.resolve] Call fn function (str) {
		log.debug("split " + JSON.stringify(str));
		var parts = str.split(" ");
		return {firstName: parts[0], lastName: parts[1]};
	} with args ["Jane Smith"]
[concordion-js.resolve] split "Jane Smith"
[concordion-js.resolve] Called fn result = [object Object]
[concordion-js.transformLink] Assign local variable result to '[object Object]'
[concordion-js.transformLink] AssertEqual ["AssertEqual",["LocalVariable","result.firstName"]]
[concordion-js.resolve] resolve ["LocalVariable","result.firstName"]
[concordion-js.resolve] -- [object Object].result
[concordion-js.resolve] -- [object Object].firstName
[concordion-js.resolve] --> Jane
[concordion-js.transformLink] Assert equals... expect Jane = Jane... true? true
[concordion-js.transformLink] AssertEqual ["AssertEqual",["LocalVariable","result.lastName"]]
[concordion-js.resolve] resolve ["LocalVariable","result.lastName"]
[concordion-js.resolve] -- [object Object].result
[concordion-js.resolve] -- [object Object].lastName
[concordion-js.resolve] --> Smith
[concordion-js.transformLink] Assert equals... expect Smith = Smith... true? true
[concordion-js.perf] transformNode: 10ms
["markdown",["header",{"level":1},"Splitting Names"],["para","To help personalise our mailshots we want to have the first name and last name of the customer. \nUnfortunately the customer data that we are supplied only contains full names."],["para","The system therefore attempts to break a supplied full name into its constituents by splitting around whitespace."],["header",{"level":3},["link",{"href":"-","title":"basic"},"Example"]],["para","The full name ",["link",{"href":"-","title":"#name"},"Jane Smith"]," is ",["link",{"href":"-","title":"#result = split(#name)"},"broken"]," into first name ",["AssertEqual","Jane","Jane",true]," and last name ",["AssertEqual","Smith","Smith",true],"."]]
[concordion-js.resolve] env = {"name":"Jane Smith","result":{"firstName":"Jane","lastName":"Smith"}}
[concordion-js.perf] runtime: 132ms
```
