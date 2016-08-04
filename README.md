# concordion-js
A Javascript implementation of Concordion testing framework. Experiment and WIP

## Status

Experimental.

* Parses Main.md example from Concordion into a tree. 
* Transforms the tree. 
* When it encounters a link with href "-" it processe it as a Concordion expression. 
* It then interprets that, to the point that the assertions in the example are made correctly with debug output.
