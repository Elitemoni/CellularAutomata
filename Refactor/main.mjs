import * as vars from './vars.mjs'
import * as ui from './interface.mjs'
import * as run from './run.mjs'

densityValue.innerHTML = vars.density;

//----------------------------------------------------------------------
//LISTENERS
document.getElementById("slider").addEventListener("input", e => {density = e.target.value; document.getElementById("densityValue").innerHTML = density});

//----------------------------------------------------------------------
//MAIN

//yellow to blue
defineColorGradient([255,-1],[255,0],[0,1]);

//setup grid
reset()

//start with Conway's Game of Life
document.getElementById('checkBorn3').click()
document.getElementById('checkSurvive2').click()
document.getElementById('checkSurvive3').click()