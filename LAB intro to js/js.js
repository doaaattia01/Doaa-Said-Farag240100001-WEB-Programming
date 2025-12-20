// Functions

function hello() {
    console.log("hello");
}

hello();


function sum(n1=4, n2=5) {
    var result = n1+n2;
    console.log(result);
}

// sum();
sum(4, 6);



function sum(n1=4, n2=5) {
    var result = n1+n2;
    return result;

}


console.log(sum(4,7));



var anonymous = function hi() {
    console.log("hi");
    
}   


anonymous();


function AnotherFunction(anonymous){
    console.log("THIS IS CALL ANOTHER FUNCTION!");
    anonymous();
}


AnotherFunction(function() {
    console.log("THIS IS ANONYMOUS FUNCTION!!");
    
})



for (let i = 0; i < 5; i++) {
    var u = 4
    console.log(i);
}
console.log(u);




var arr = [100,200,300,300,"name","string"]

console.log(arr);
console.log(arr[4]);

arr[0] = "Rick"
console.log(arr);
console.log(arr.length);

arr.pop();
console.log(arr);
arr.push(80,90);

console.log(arr);
arr.splice(3,0,450);
console.log(arr);
arr.shift();
console.log(arr);
arr.unshift(8);
console.log(arr);


var arr2 =[10,20,40,30,40,50,60,40];

console.log(arr2.indexOf(20));

console.log(arr2.lastIndexOf(40));

var miniArr = arr2.slice(2,5);

console.log(miniArr);


var arr3 = [1,2,3,4];
var arr4 = [5,6,7,8];


var newArr = arr3.concat(arr4)
console.log(newArr);
