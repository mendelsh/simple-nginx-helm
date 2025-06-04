//import {PI, getCircumference, getArea, getVolume} from './mathUtil.js';
const π = 3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679;
const display = document.getElementById("display");

function appendToDisplay(input){
    display.value === "Error" ? display.value = input : display.value += input; 
}

function cleerDisplay(){
    display.value = ""
}

function calculate(){
    try{
        display.value = eval(display.value);
    }
    catch(error){
        display.value = "Error";
    }
}
