// SUPPORT VARIABLES
var nameRE = /^\s*function ([^ (]*)/; // for constructor.name

var stack = new Array(1000);

var stackLength = 0;

var errorConstructor = {
	"Error":true,
	"EvalError":true,
	"RangeError":true,
	"ReferenceError":true,
	"SyntaxError":true,
	"TypeError":true,
	"URIError":true
};

var filledConstructor = {
	"Boolean":true,
	"Date":true,
	"String":true,
	"Number":true,
	"RegExp":true
};


// SUPPORT FUNCTIONS
function crockford(obj){
    
	function F(){};

	F.prototype = obj.constructor.prototype;

	return new F();
};	



function checkStack(obj){
  
  for(var i=0; i<stackLength; i++){
    
    if(obj === stack[i])
      return true;
  }
  
  return false;
}



function stackPush(obj){

  stack[stackLength] = obj;
  
  stackLength++;
}



function stackPop(){
  
  stackLength--;
}





// MAIN FUNCTION
function deepCloneES3(obj){
	
	if(
		obj !== null && 
		typeof obj === "object" && 
		!checkStack(obj)
	){

		var newObj;
		
    
		var conName = obj.constructor.name || 
				obj.constructor.toString().match(nameRE)[1];
			
			
    if(conName === "Object")
      newObj = new obj.constructor();

    else if ( filledConstructor[conName] ) 
      newObj = new obj.constructor(obj);

    else if ( conName === "Array" ) 
      newObj = new obj.constructor(obj.length);

    else if ( errorConstructor[conName] ){

      if(obj.stack){ // not ES3; but in FireFox1

        newObj = new obj.constructor(obj.message);

        newObj.stack = obj.stack;
      }

      else
        newObj = new Error(obj.message + " INACCURATE OR MISSING STACK-TRACE");
    }

    else 
      newObj = crockford(obj);
		

		for(var key in obj){

			if( obj.hasOwnProperty(key) ){

				if(
					obj[key] !== null && 
					typeof obj[key] === "object"
				){
					
					stackPush(obj);
          
					newObj[key] = deepCloneES3( obj[key] );
					
          stackPop();
				}
				
				else
					newObj[key] = obj[key];
			}
		}
	}

	return newObj || obj;
}
