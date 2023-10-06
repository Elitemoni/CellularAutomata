//----------------------------------------------------------------------
//VARIABLES

export const range = (start, stop, step = 1) =>
   Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);

//canvas drawing 
export const c = document.getElementById("gridCanvas");
export const t = c.getContext("2d");

//2d array, where our grid data is in
export let gridArray = [];

//Decoration
//TODO need to correlate state with stateColor
export const colorCount = 10;
export const cDelta = Math.round(255/colorCount); //difference of the colors when going from 0 - 255
export let stateColor = [`lightgrey`];
export const borderColor = 'floralwhite';
export const lineWidth = '1';
export let thereAreGridLines = true;

//Conway is b:3|s:2,3
export let bornRule = [];
export let surviveRule = [];

//defines # of cells each dimension
export let rows = 80;
export let columns = 80;

//divides the cells evenly with the canvas
export let xUnit = c.width/rows;
export let yUnit = c.height/columns;

export let delay = 10; //milliseconds

export let density = document.getElementById("slider")?.value ?? 50; //problem is it doesn't get it at runtime
export let densityValue = document.getElementById("densityValue");

export let game = null;