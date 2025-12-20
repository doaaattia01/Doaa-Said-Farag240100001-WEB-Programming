// Function that prints "welcome" to the console
function welcome(){
    console.log("welcome")
}

//the function won't be executed unless we call it
welcome()

// Calling the welcome function inside console.log
// The function prints "welcome" and returns undefined, so console.log prints undefined
console.log(welcome())

// Function that adds two numbers
// n1 and n2 have default values (4 and 5) if no arguments are passed
function add(n1=4,n2=5){
    var t = 2   // var: function scope
    let c = 1   // let: block scope
    var result = n1 + n2  // calculate the sum
    return result          // return the result
}

// Calling add(3,4) → output: 7(printing the call of a function will print the return)
console.log(add(3,4))

// Function expression stored in variable y
var y = function(){
    console.log("hi")
}

// Calling y: prints "hi"
y()

// Function that accepts another function as argument (first class citizen)
function callAnotherFn(Fn){
    console.log("call another function") // first message
    Fn()                                  // call the function passed
}

// Passing an anonymous function: prints "the other function"
callAnotherFn(function(){
    console.log("the other function")
})

// block scope example
for (let i = 0; i < 5; i++) {
  var u = 4  // var: accessible outside the loop
  let k = 5  // let: only inside the loop
  console.log(i) 
}


//var => not block scope, function scope
//let => block scope ,function scope

// u exists because var is function scoped
console.log(u) // output: 4

// console.log(k)    //error: undfined

// Array examples
var arr = [100,200,400,500,"name","major"]
console.log(arr)           // print full array
console.log(arr[4])        // print element at index 4  "name"
arr[1] = 300                // change element at index 1
console.log(arr)           // print updated array
console.log(arr.length)    // print number of elements
arr.pop()                  // remove last element
console.log(arr)
arr.push(800,900)          // add elements at the end
console.log(arr)
arr.splice(3,0,450)        // insert 450 at index 3
console.log(arr)
arr.shift()                // remove first element
console.log(arr)
arr.unshift(30)            // add element at the beginning
console.log(arr)

arr2 = [10,20,30,20,40]
console.log(arr2.indexOf(900))  // -1 (not found)
console.log(arr2.lastIndexOf(400)) // 4

var miniArr = arr2.slice(2,5)   // extract elements index 2 to 4
console.log(miniArr)

var arr3 = [1,2,3]
var arr4 = [5,6,7]
var newArr = arr3.concat(arr4)  // combine arrays
console.log(newArr)
console.log(arr2.reverse())     // reverse array

var strArr = ["array","string"]
var newString = strArr.join(" ") // join elements with space  "array string"
console.log(newString)
