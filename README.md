# concordion-js
A Javascript implementation of Concordion testing framework. Experiment and WIP

## Status

Experimental.

* Parses Main.md example from Concordion into a tree. 
* Transforms the tree. 
* When it encounters a link with href "-" it processe it as a Concordion expression. 
* It then interprets that, to the point that the assertions in the example are made correctly with debug output.

### Output

```
["markdown",["header",{"level":1},"Splitting Names"],["para","To help personalise our mailshots we want to have the first name and last name of the customer. \nUnfortunately the customer data that we are supplied only contains full names."],["para","The system therefore attempts to break a supplied full name into its constituents by splitting around whitespace."],["header",{"level":3},["link",{"href":"-","title":"basic"},"Example"]],["para","The full name ",["link",{"href":"-","title":"#name"},"Jane Smith"]," is ",["link",{"href":"-","title":"#result = split(#name)"},"broken"]," into first name ",["link",{"href":"-","title":"?=#result.firstName"},"Jane"]," and last name ",["link",{"href":"-","title":"?=#result.lastName"},"Smith"],"."]]
Assign local variable from label: name to "Jane Smith"
resolve ["Function",["Variable","split"],[["LocalVariable","name"],null]]
resolve ["Variable","split"]
-- [object Object].split
--> function (str) {
		console.log("split " + JSON.stringify(str));
		var parts = str.split(" ");
		return {firstName: parts[0], lastName: parts[1]};
	}
resolve ["LocalVariable","name"]
-- [object Object].name
--> Jane Smith
Call fn function (str) {
		console.log("split " + JSON.stringify(str));
		var parts = str.split(" ");
		return {firstName: parts[0], lastName: parts[1]};
	} with args ["Jane Smith"]
split "Jane Smith"
Called fn result = [object Object]
Assign local variable result to '[object Object]'
AssertEqual ["AssertEqual",["LocalVariable","result.firstName"]]
resolve ["LocalVariable","result.firstName"]
-- [object Object].result
-- [object Object].firstName
--> Jane
Assert equals... expect Jane = Jane... true? true
AssertEqual ["AssertEqual",["LocalVariable","result.lastName"]]
resolve ["LocalVariable","result.lastName"]
-- [object Object].result
-- [object Object].lastName
--> Smith
Assert equals... expect Smith = Smith... true? true
["markdown",["header",{"level":1},"Splitting Names"],["para","To help personalise our mailshots we want to have the first name and last name of the customer. \nUnfortunately the customer data that we are supplied only contains full names."],["para","The system therefore attempts to break a supplied full name into its constituents by splitting around whitespace."],["header",{"level":3},["link",{"href":"-","title":"basic"},"Example"]],["para","The full name ",["link",{"href":"-","title":"#name"},"Jane Smith"]," is ",["link",{"href":"-","title":"#result = split(#name)"},"broken"]," into first name ",["AssertEqual","Jane","Jane",true]," and last name ",["AssertEqual","Smith","Smith",true],"."]]
env = {"name":"Jane Smith","result":{"firstName":"Jane","lastName":"Smith"}}
```
