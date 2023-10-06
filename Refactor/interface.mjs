import * as vars from './vars.mjs'

//----------------------------------------------------------------------
//UI

//make into variable instead?
export function clearGrid(){
  t.clearRect(0,0,c.width,c.height);
}

export function setDelay(d){
  delay = d;
  if (game){
      pause();
      play();
  }
  else{
      pause();
  }
}

export function setSides(width, height){
  rows = width;
  columns = height;
  xUnit = c.width/rows;
  yUnit = c.height/columns;
  reset()
}

export function pause(){
  clearInterval(game);
  game = null;
}

export function play(){
  if (!game){
      game = setInterval(update, delay);
  }
}

export function step()
{
  update();
}

export function reset()
{
  createGridRandom(density,rows,columns);
  drawGrid();
}

export function help(){
  let helpStr = 
  `reset()\nstep()\nplay()\npause()\nsetDelay()\nsetRuleString(B, S)\nsetSides(w, h)\ndelay\ndensity`;

  console.log(helpStr);
}

export function displayColors(){
  for (let i = 0; i < stateColor.length; i++){
      console.log(stateColor[i]);
  }
}
