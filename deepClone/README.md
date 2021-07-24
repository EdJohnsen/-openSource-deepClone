Ignoring Call Stack problems, the deepCloneESx solutions in this repository are considered "complete" by the below definition.

Additionally, excepting argument objects, all solutions in this repository support cross-frame deep-cloning.

These solutions are all more complete than are the solutions offered by [Lodash](https://github.com/lodash/lodash/blob/master/cloneDeep.js), [The Dojo Toolkit](https://dojotoolkit.org/reference-guide/1.7/dojo/clone.html), [MooTools](https://mootools.net/core/docs/1.6.0/Types/Object#Object:Object-clone), [Angular](https://docs.angularjs.org/api/ng/function/angular.copy), [jQuery](https://api.jquery.com/jquery.extend/), and the [Structured Clone Algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).


## Completeness
To earn the title of a complete deep-cloning solution, a solution must solve all, appropriate, generally solvable problems.

Solutions to problems related to non-iterable objects (such as WeakSet and WeakMap), as well as problems inherent to some built-in objects (like Math) are not considered by my definition of completeness. Also, although extra cloning features are cool, a javascript-based deep-cloning solution can fit my definition of complete without providing cloning solutions for objects available through APIs (like HTML elements).


## Deep-Cloning Problems

Problems listed without *s are generally solvable.

Problems listed with one or more *s are not generally be solved.

1. Scope *
2. Memory **
3. Call Stack
4. Inheritance
5. Object Variety
6. Circular References
7. Cross-Frame Objects ***


Functions, setters, and getters can reference out-of-cloner-scope variables. *

Values within an object may use more than half of the available memory. **

Custom constructors may be incorrectly named, and we've no accessible argument constructors. ***
