/*GNU LGPLv3*/

// SUPPORT VARIABLES
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

var arrayConstructorsES5 = {
	"Array":true,
	"BigInt64Array":true,
	"BigUint64Array":true,
	"Float32Array":true,
	"Float64Array":true,
	"Int8Array":true,
	"Int16Array":true,
	"Int32Array":true,
	"Uint8Array":true,
	"Uint8ClampedArray":true,
	"Uint16Array":true,
	"Uint32Array":true,
};

var nameRE = /^\s*function ([^ (]*)/;

var stack = new Array(1000);

var stackLength = 0;



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
function deepCloneES5(obj){
  
	if(obj !== null && 
		typeof obj === "object" && 
		!checkStack(obj)
	){

    	var newObj;

    	if(obj.constructor){

			var oType = obj.constructor.name || 
				obj.constructor.toString().match(nameRE)[1];


			if(oType === "Object") 
				newObj = new obj.constructor();

			else if(filledConstructor[oType])
				newObj = new obj.constructor(obj);

			else if(obj.cloneNode)
				newObj = obj.cloneNode(true);

			else if(arrayConstructorsES5[oType])
				newObj = new obj.constructor(obj.length);

			else if ( errorConstructor[oType] ){

				if(obj.stack){

					newObj = new obj.constructor(obj.message);

					newObj.stack = obj.stack;
				}

        			else
					newObj = new obj.constructor(obj.message + " INACCURATE OR MISSING STACK-TRACE");
        
			}

			else{
				newObj = new obj.constructor();

				var cProps = Object.getOwnPropertyNames(newObj);
				
				var cI = 0,
				    cImax = cProps.length;
				
				for(;cI<cImax; cI++)
					if( !obj.hasOwnProperty( cProps[cI] ) )
						delete newObj[ cProps[cI] ];
      
			}
		}

		else
			newObj = Object.create(null);


		let props = Object.getOwnPropertyNames(obj);

		let descriptor;

		for(let i in props){

			descriptor = Object.getOwnPropertyDescriptor( obj, props[i] );

			prop = props[i];

			if(
				descriptor.value &&
			   	descriptor.value !== null && 
				typeof descriptor.value === "object"
			){

				stackPush(obj);

				Object.defineProperty( newObj, prop, descriptor );
					
				newObj[prop] = deepCloneES5(obj[prop]);

				stackPop();
			}

			else if(descriptor.get || descriptor.set) 
				continue;

			else
				Object.defineProperty( newObj, prop, descriptor );

		}

		return newObj;
	}

	return obj;
}
