/*GNU LGPLv3*/

var deepCloneES6 = (function(){
	// GENERAL SUPPORT VARIABLES
	let errorConstructor = {
		"Error":true,
		"EvalError":true,
		"RangeError":true,
		"ReferenceError":true,
		"SyntaxError":true,
		"TypeError":true,
		"URIError":true
	};

	let filledConstructorES3 = {
		"Boolean":true,
		"Date":true,
		"String":true,
		"Number":true,
		"RegExp":true
	};

	let filledConstructorES6 = {
		"BigInt":true,
		"Symbol":true
	};

	let arrayConstructorsES5 = {
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
		"Uint32Array":true
	};

	let arrayConstructorsES6 = {
		"ArrayBuffer":true,
		"SharedArrayBuffer":true
	};


	// DEEP-CLONING FUNCTIONS ES6
	function deepCloneES6(obj, circMap = new WeakMap()){

		if(
			obj !== null && 
			typeof obj === "object" &&
			!circMap.get(obj)
		){


			circMap.set(obj, true);


			let newObj;

			if(obj.constructor){

				let oType = obj.constructor.name;

				if(oType === "Object"){

					let longName = Object.prototype.toString.call(obj);

					if(longName === "[object Generator]")
						return obj;

					else
						newObj = new obj.constructor(); // mangles Argument-object type

				}

				else if(filledConstructorES3[oType])
					newObj = new obj.constructor(obj);

				else if(filledConstructorES6[oType])
					newObj = obj.constructor(obj);

				else if(arrayConstructorsES5[oType])
					newObj = new obj.constructor(obj.length);

				else if(arrayConstructorsES6[oType])
					newObj = new obj.constructor(obj.byteLength);

				else if(oType === "DataView")
					newObj = new obj.constructor(obj.buffer);

				else if ( errorConstructor[oType] ){

					if(obj.stack){

						newObj = new obj.constructor(obj.message);

						newObj.stack = obj.stack;
					}

					else
						newObj = new Error(obj.message + " INACCURATE OR MISSING STACK-TRACE");

				}

				else if(oType === "Set"){

					newObj = new Set();

					obj.forEach((value, key)=>{

						let aVal = value !== null 
							&& typeof value === "object" 
							? deepCloneES6( value, circMap )
							: value;

						newObj.set( key, aVal );
					});			
				}

				else if(oType === "Map"){

					newObj = new Map();

					obj.forEach((value, key)=>{

						let aKey = typeof key === "object" 
							&& key !== null 
							? deepCloneES6( key, circMap ) 
							: key;

						let aVal = typeof value === "object" 
							&& value !== null 
							? deepCloneES6( value, circMap ) 
							: value;

						newObj.set( aKey, aVal );
					});
				}

				else{

					newObj = new obj.constructor();

					let cProps = Object.getOwnPropertyNames(newObj);

					let cI = 0,
					    cImax = cProps.length;

					for(;cI<cImax; cI++)
						if( !obj.hasOwnProperty( cProps[cI] ) )
							delete newObj[ cProps[cI] ];

				}

			}

			else
				newObj = Object.create(null); 


			let props = Object.getOwnPropertyNames(obj),
			    prop,
			    descriptor;

			for(let i in props){

				descriptor = Object.getOwnPropertyDescriptor( obj, props[i] );

				prop = props[i];

				if(
					descriptor.value &&
					typeof descriptor.value === "object" &&
					descriptor.value !== null && 
					!circMap.get( descriptor.value )

				){

					Object.defineProperty( newObj, prop, descriptor );

					newObj[prop] = deepCloneES6( obj[prop], circMap );
				}

				else if(descriptor.get || descriptor.set) 
					continue;

				else
					Object.defineProperty( newObj, prop, descriptor );

			}


			let syms = Object.getOwnPropertySymbols(obj),
			    sym;

			for(let i = 0, imax = syms.length; i<imax; i++){

				sym = syms[i];
				
				if(
					typeof obj[sym] === "object" && 
					obj[sym] !== null &&
					!circMap.get( obj[sym] )
				)
					newObj[sym] = cloneItES6( sym, circMap );

				else
					newObj[sym] = obj[sym];

			}

			
			circMap.delete(obj);
			
			return newObj;
		}

		return obj;
	}
	
	
	return deepCloneES6;
})();
