import * as vars from './vars.mjs'

//----------------------------------------------------------------------
//FUNCTIONS

//fix this terrible function
export function defineColorGradient(r,g,b){
  if (stateColor.length > 1){
      console.log('stateColor is already defined');
  }
  else {
      for (let i = 0; i < colorCount; i++){
          stateColor.push(`rgb(${r[0]+r[1]*i*cDelta},${g[0]+g[1]*i*cDelta},${b[0]+b[1]*i*cDelta})`);
      }
  }
}

export function createGridRandom(density, rows, columns){
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

export function checkLiveNeighborsAt(row, column){
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

export function drawGrid(){
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

export function ruleStep(B, S){
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

export function setRuleString(B, S){
  bornRule = B;
  surviveRule = S;
}

export function getRuleString(){
  return [[...bornRule],[...surviveRule]]
}

export function updateBornRule(n){
  if (bornRule.find(el => el === n) === undefined){
      //Todo, make it in order
      bornRule.push(n);
  }
  else {
      bornRule.splice(bornRule.findIndex(el => el === n), 1);
  }
}

export function updateSurviveRule(n){
  if (surviveRule.find(el => el === n) === undefined){
      //Todo, make it in order
      surviveRule.push(n);
  }
  else {
      surviveRule.splice(surviveRule.findIndex(el => el === n),1);
  }
}

export function update(){
  ruleStep(bornRule, surviveRule);
  drawGrid();
  //update other stuff here, like a score or cell count maybe
}