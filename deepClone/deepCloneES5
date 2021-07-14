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

    // create object for return;
    // differentiate between objects and dictionaries.
    var newObj;

    // if object was constructed
    // handle inheritance,
    // or utilize built-in constructors
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

        if(obj.stack){ // not ES3; but in FireFox1

          newObj = new obj.constructor(obj.message);

          newObj.stack = obj.stack;
        }

        else
          newObj = new Error(obj.message + " INACCURATE OR MISSING STACK-TRACE");
        
      }

      else
        newObj = Object.create(Object.getPrototypeOf(obj)); // loses multi-frame handling here
      
    }

    else
      newObj = Object.create(null); // multi-frame mishandling


    let props = Object.getOwnPropertyNames(obj);

    let descriptor;

    for(let i in props){

      descriptor = Object.getOwnPropertyDescriptor( obj, props[i] );

      prop = props[i];

      // recurse into descriptor, if necessary
      // and assign prop to newObj
      if(descriptor.value){

        if(descriptor.value !== null && 
          typeof descriptor.value === "object"
        ){

          stackPush(obj);

          newObj[prop] = deepCloneES5(obj[prop]);

          stackPop();
        }

        else
          newObj[prop] = obj[prop];

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
