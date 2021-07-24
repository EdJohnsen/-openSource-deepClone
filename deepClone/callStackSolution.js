// set up a test object whose depth is 15k objects deep
let obj = {};

function build(obj){
  
  for(let i = 0, imax = 15000; i<imax; i++){
    obj.a = {i};
    obj = obj.a;
  }
}

build(obj);

console.log(obj);



// verify whether 15k is deep enough to cause a max call stack size error on your machine
let i = 0;
function recursionBomb(obj){
  i++;
  i%1000===0 && console.log(i);
  
  for(let key in obj){
    recursionBomb(obj[key]);
  }
}
// if this doesn't throw an error, increase the imax value in the build function
try{
  recursionBomb(obj);
}
catch(e){
  console.log(e);
}




// this is the deep-cloning function... it's quite trimmed down for this example
let loopCount = 0;
function inSteps(obj, loopCount = 0){
	// console.log({arguments});
	if( obj !== null && typeof obj === "object" ){
		
		let newObj = new obj.constructor();
		
		let arr = [];
		
		for(let key in obj){
			
			if(obj[key]!==null && typeof obj === "object"){
				
        if(loopCount < 20){
          newObj[key] = inSteps(obj[key], ++loopCount);
        }
				else
          delay( obj[key], newObj, key );
			}
			
			else
				newObj[key] = obj[key];
		}
		
		return newObj;
	}
	
	return obj;
}


// this function helps the main cloning function handle deep recursion
function delay( objVal, newObj, key ){
  
  setTimeout(
      ()=>newObj[key] = inSteps( objVal ),
		  0
	);
}


// this function verifies that we've cloned an object deeper than can nominally be cloned;
// it outputs the depth of the object we cloned; as initially set, that should be 15k after 15s.
function verify(){
  
  let i = 0;
  
  while(newObj.a){
    
    i++;
    
    newObj = newObj.a
  }
  
  console.log(i);
}





// now we can test our deep-cloning function
let newObj = inSteps(obj);

setTimeout(()=>console.log(newObj),2000);

setTimeout(()=>verify(),15000);
