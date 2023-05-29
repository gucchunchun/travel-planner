body = "Destination is like: ";
//[[[a,b]c]d]選択方法によって配列の形が異なるため
var array="charming"
while(Array.isArray(array)){
    let newArray=[];
    for(let i=0; i<array.length; i++){
        if(Array.isArray(array[i])){
            newArray.push(array[i]);
        }else{
            body += array[i] + " "
        }
    }
    array=newArray[0];
}
if(typeof array === "string"){
    body += array;
}
console.log(body);