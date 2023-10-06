//----------------------------------------------------------------------
//VARIABLES

const range = (start, stop, step = 1) =>
   Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);

//canvas drawing 
const c = document.getElementById("gridCanvas");
const t = c.getContext("2d");

//2d array, where our grid data is in
let gridArray = [];

//Decoration
//TODO need to correlate state with stateColor
const colorCount = 10;
const cDelta = Math.round(255/colorCount); //difference of the colors when going from 0 - 255
let stateColor = [`lightgrey`];
const borderColor = 'floralwhite';
const lineWidth = '1';
let thereAreGridLines = true;

//Conway is b:3|s:2,3
let bornRule = [];
let surviveRule = [];

//defines # of cells each dimension
let rows = 80;
let columns = 80;

//divides the cells evenly with the canvas
let xUnit = c.width/rows;
let yUnit = c.height/columns;

//let delay = 16; //milliseconds
let delay = document.getElementById("sliderDelay")?.value ?? 17; //problem is it doesn't get it at runtime

let density = document.getElementById("sliderDensity")?.value ?? 50; //problem is it doesn't get it at runtime
let densityValue = document.getElementById("densityValue");
densityValue.innerHTML = density;

let game = null;

let playPauseText = document.getElementById("playPause");

//----------------------------------------------------------------------
//FUNCTIONS

function defineColorGradient(r,g,b){
    if (stateColor.length > 1){
        console.log('stateColor is already defined');
    }
    else {
        for (let i = 0; i < colorCount; i++){
            stateColor.push(`rgb(${r[0]+r[1]*i*cDelta},${g[0]+g[1]*i*cDelta},${b[0]+b[1]*i*cDelta})`);
        }
    }
}

function drawGrid(){
    t.beginPath();
    let x = 0;
    let y = 0;
    t.strokeStyle = borderColor;
    t.lineWidth = lineWidth;

    for (var i = 0; i < gridArray.length; i++){
        for (var k = 0; k < gridArray[i].length; k++){
            x=i*xUnit;
            y=k*yUnit;
            t.fillStyle = gridArray[i][k];
            t.fillRect(x,y,xUnit,yUnit);
        }
    }

    if (thereAreGridLines){
        //Horizontal lines
        for (var i = 0; i < rows + 1; i++){
            y=i*yUnit;
            t.moveTo(0,y);
            t.lineTo(c.width,y);
            t.stroke();
        }
        //Vertical Lines
        for (var i = 0; i < columns + 1; i++){
            x=i*xUnit;
            t.moveTo(x,0);
            t.lineTo(x,c.height);
            t.stroke();
        }
    }
}

function createGridRandom(density, rows, columns){
    for (var i = 0; i < rows; i++){
        gridArray[i] = new Array(columns);
        for (var k = 0; k < columns; k++){
            let num = Math.random() + (density/100) - 0.5;
            if (num > 0.5){
                gridArray[i][k]  = stateColor[1];
            }
            else {
                gridArray[i][k]  = stateColor[0];
            }
        }
    }
}

function checkLiveNeighborsAt(row, column){
    let aliveCount = 8; 

    for (var i = -1; i < 2; i++){
        for (var k = -1; k < 2; k++){
            if ((gridArray[row+i] == undefined || gridArray[row+i][column+k] == undefined || gridArray[row+i][column+k] == stateColor[0]) && (i != 0 || k != 0)){
                aliveCount--;
            }
        }
    }

    return aliveCount;
}

function ruleStep(B, S){
    let temp = [];
    let ifCellNotBorn;

    //copying gridArray backgroundColors to temp
    for (var i = 0; i < gridArray.length; i++){
        temp[i] = new Array(gridArray[i].length);
        for (var k = 0; k < gridArray[i].length; k++){
            temp[i][k] = gridArray[i][k];
        }
    }
    
    //updates temp to the new state using original gridArray
    for (var i = 0; i < gridArray.length; i++)
    {
        for (var k = 0; k < gridArray[i].length; k++)
        {
            ifCellNotBorn = true;
            let aliveNeighborCount = checkLiveNeighborsAt(i, k);

            if (gridArray[i][k] == stateColor[0]){
                for (var j = 0; j < B.length; j++){
                    if (aliveNeighborCount == B[j]){
                        temp[i][k] = stateColor[1]; //becomes alive
                        ifCellNotBorn = false;
                        break;
                    }
                }
            }
            //else if (gridArray[i][k] == stateColor[1]){
            else {
                for (var j = 0; j < S.length; j++)
                {
                    if (aliveNeighborCount == S[j]){
                        for (let f = 0; f < colorCount; f++){
                            if (temp[i][k] == stateColor[f]){
                                temp[i][k] = stateColor[f+1]; //stays alive, the gradient increases
                                break;
                            }
                        }
                        ifCellNotBorn = false;
                        break;
                    }
                }
            }

            if (ifCellNotBorn){
                temp[i][k] = stateColor[0]; //is dead
            }
        }
    }

    //updates gridArray backgroundColor to match with temp's
    for (var i = 0; i < gridArray.length; i++){
        for (var k = 0; k < gridArray[i].length; k++){
            gridArray[i][k] = temp[i][k];
        }
    }
}

//----------------------------------------------------------------------
//RULE STRINGS

function setRuleString(B, S){
    bornRule = B;
    surviveRule = S;
}

function getRuleString(){
    return [[...bornRule],[...surviveRule]]
}

function updateBornRule(n){
    if (bornRule.find(el => el === n) === undefined){
        //Todo, make it in order
        bornRule.push(n);
    }
    else {
        bornRule.splice(bornRule.findIndex(el => el === n), 1);
    }
}

function updateSurviveRule(n){
    if (surviveRule.find(el => el === n) === undefined){
        //Todo, make it in order
        surviveRule.push(n);
    }
    else {
        surviveRule.splice(surviveRule.findIndex(el => el === n),1);
    }
}

//----------------------------------------------------------------------
//UI

//make into variable instead?
function clearGrid(){
    t.clearRect(0,0,c.width,c.height);
}

function update(){
    ruleStep(bornRule, surviveRule);
    drawGrid();
    //update other stuff here, like a score or cell count maybe
}

function setDelay(d){
    delay = d;
    if (game){
        pause();
        play();
    }
    else{
        pause();
    }
}

function setSides(width, height){
    rows = width;
    columns = height;
    xUnit = c.width/rows;
    yUnit = c.height/columns;
    reset()
}

function pause(){
    clearInterval(game);
    game = null;
}

function play(){
    if (!game){
        game = setInterval(update, delay);
    }
}

function playPause(){
    if (game){
        clearInterval(game);
        game = null;
        playPauseText.innerHTML = "play";
    } else {
        game = setInterval(update, delay);
        playPauseText.innerHTML = "pause";
    }
}

function step()
{
    update();
}

function reset()
{
    createGridRandom(density,rows,columns);
    drawGrid();
}

function help(){
    let helpStr = 
    `reset()\nstep()\nplay()\npause()\nsetDelay()\nsetRuleString(B, S)\nsetSides(w, h)\ndelay\ndensity`;

    console.log(helpStr);
}

function displayColors(){
    for (let i = 0; i < stateColor.length; i++){
        console.log(stateColor[i]);
    }
}

//----------------------------------------------------------------------
//LISTENERS
document.getElementById("sliderDensity").addEventListener("input", e => {density = e.target.value; document.getElementById("densityValue").innerHTML = density});
document.getElementById("sliderDelay").addEventListener("input", e => {delay = e.target.value; document.getElementById("delayValue").innerHTML = delay});

//----------------------------------------------------------------------
//MAIN

//yellow to blue
//defineColorGradient([255,-1],[255,0],[0,1]);
defineColorGradient([255,0],[255,0],[0,0]);

//setup grid
reset()

//start with Conway's Game of Life
document.getElementById('checkBorn3').click()
document.getElementById('checkSurvive2').click()
document.getElementById('checkSurvive3').click()