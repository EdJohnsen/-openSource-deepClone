var deepCloneES3 = (function(){/*GNU LGPLv3*/
	
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

			stackPush(obj);
			
			var newObj;

			var conName = obj.constructor.name || 
					obj.constructor.toString().match(nameRE)[1];


			if(conName === "Object")
				newObj = new obj.constructor(); // mangles Argument-object type

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

			else{
				
				newObj = new obj.constructor();

				for(var cKey in newObj)
					if( 
						newObj.hasOwnProperty(cKey) && 
						!obj.hasOwnProperty(cKey)
					)
						delete newObj[cKey];
				
			}


			for(var key in obj){

				if( obj.hasOwnProperty(key) ){

					if(
						typeof obj[key] === "object" &&
						obj[key] !== null && 
						!checkStack( obj[key] )
					)
						newObj[key] = deepCloneES3( obj[key] );

					else
						newObj[key] = obj[key];
				}
			}
			
			stackPop();
			
			return newObj
		}

		
		return obj;
	}
	
	
	return deepCloneES3;
})();
