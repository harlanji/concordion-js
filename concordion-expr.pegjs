{

}

Output
  = Command / Assertion / Assignment / Expr

Command
  = "c:" cmd:([\a-z\-\.]+) _ "=" _ e:Expr { return ["Command", "echo", e]; }

Assignment
  = vari:AnyVariable _ "=" _ e:Expr { return ["Assign", vari, e]; }

Assertion
  = "?=" _ e:Expr { return ["AssertEqual", e]; }

AnyVariable
  = vari:Variable { return vari; } 
    / lvari:LocalVariable { return lvari; }

Expr = Literal / Function / AnyVariable

Variable 
  = [A-Za-z0-9\.]+ { return ["Variable", text()]; }

LocalVariable
  = "#" vari:Variable { return ["LocalVariable", vari[1]]; } 

ArgList
  = e:Expr ("," _ rest:ArgList _ {e.rest = rest;})? { return [e, e.rest]; }
  
Function 
  = vari:AnyVariable "(" _ args:ArgList? _ ")"  { return ["Function", vari, args]; }  

Literal = v:(String / Number) { return ["Literal", v]; }

String = "'" str:[a-zA-Z0-9\ \. \-]+ "'" { return str.join(""); }

Number = digits:([0-9]+) { return parseInt(digits.join("")); } 

_ "whitespace"
  = [ \t\n\r]*
