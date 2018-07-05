var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
var _sizeX=513;
var _sizeY=513;
var dispersion=10;
var clampR={
	min_input:document.getElementById("clampMinR"),
	max_input:document.getElementById("clampMaxR"),
	getMin:function(){return this.min_input.value},
	getMax:function(){return this.max_input.value}
}
var clampG={
	min_input:document.getElementById("clampMinG"),
	max_input:document.getElementById("clampMaxG"),
	getMin:function(){return this.min_input.value},
	getMax:function(){return this.max_input.value}
}
var clampB={
	min_input:document.getElementById("clampMinB"),
	max_input:document.getElementById("clampMaxB"),
	getMin:function(){return this.min_input.value},
	getMax:function(){return this.max_input.value}
}

var seed_Input=document.getElementById("seed");
var dispersion_Input=document.getElementById("dispersion");
dispersion_Input.value=dispersion;
var mapR=GenerateEmpty();
var mapG=GenerateEmpty();
var mapB=GenerateEmpty();
Update();
function GenerateSeed()
{
	seed_Input.value=Math.seedrandom();
}
function ClearR()
{
	mapR=GenerateEmpty();
	Update();
}
function ClearG()
{
	mapG=GenerateEmpty();
	Update();
}
function ClearB()
{
	mapB=GenerateEmpty();
	Update();
}
function GenerateR()
{
	ReadParameters();
	mapR=DiamondSquare();
	Update();
}
function GenerateG()
{
	ReadParameters();
	mapG=DiamondSquare();
	Update();
}
function GenerateB()
{
	ReadParameters();
	mapB=DiamondSquare();
	Update();
}
function ReadParameters()
{
	Math.seedrandom(seed_Input.value);
	dispersion= dispersion_Input.value; 
}
function Update()
{
	DrawDaimondSquare(mapR,mapG,mapB,ctx);
}
function GenerateEmpty()
{
	var arr=new Array(_sizeX);
	for(let x=0;x<_sizeX;++x)
	{	
		arr[x]=new Array(_sizeY);
		for(let y=0;y<_sizeY;++y)
			arr[x][y]=0;
	}
	return arr;		
}
function DrawDaimondSquare(arrR,arrG,arrB,context)
{
	for(let x=0;x<_sizeX;++x)
		for(let y=0;y<_sizeY;++y)
		{
			var r=clampFromObj(arrR[x][y],clampR);
			var g=clampFromObj(arrG[x][y],clampG);
			var b=clampFromObj(arrB[x][y],clampB);
			ctx.fillStyle = "rgba("+r+","+g+","+b+","+1+")";
		
			context.fillRect(x,y,1,1);
		}
}

function DiamondSquare()
{
    var sX=_sizeX;
	var sY=_sizeY;
	var DATA_SIZE= Math.max(_sizeX,_sizeY);
	
    //if(isPowerOfTwo(DATA_SIZE-1))
//	{
//		DATA_SIZE=nextPowerOfTwo(DATA_SIZE)+1;
//    }
	var arr = new Array(DATA_SIZE);
	for (var i = 0; i < DATA_SIZE; i++) {
	  arr[i] = new Array(DATA_SIZE);
	  for(let j=0;j< DATA_SIZE;++j)
	  {
		  arr[i][j]=0;
	  }
	}
	//seed the data
	arr[0][0] = arr[0][DATA_SIZE-1] = arr[DATA_SIZE-1][0] = 
		arr[DATA_SIZE-1][DATA_SIZE-1] = 0;

	var h = 256;
	//Random.seed=SEED;
	var sideLength = DATA_SIZE-1;
	for(;sideLength >= 2;sideLength=Math.floor(sideLength/2) ){
		h/= 2;
		var halfSide = Math.round(sideLength/2);

		//generate the new square values
		for(var x=0;x<DATA_SIZE-1;x+=sideLength){
			for(var y=0;y<DATA_SIZE-1;y+=sideLength){
				var avg=0;
					avg+= arr[x][y];  //top left
					avg+=arr[x+sideLength][y];//top right
					avg+=arr[x][y+sideLength]; //lower left
					avg+=arr[x+sideLength][y+sideLength];//lower right
				avg /= 4;


				arr[x+halfSide][y+halfSide] =
					avg + (Math.random()*2*h) - h;
			}
		}
		for( x=0;x<DATA_SIZE-1;x+=halfSide){

			for( y=(x+halfSide)%sideLength;y<DATA_SIZE-1;y+=sideLength){

				avg = 
					arr[(x-halfSide+DATA_SIZE)%DATA_SIZE][y] + //left of center
					arr[(x+halfSide)%DATA_SIZE][y] + //right of center
					arr[x][(y+halfSide)%DATA_SIZE] + //below center
					arr[x][(y-halfSide+DATA_SIZE)%DATA_SIZE]; //above center
				avg /= 4;
				avg = avg + dispersion*((Math.random()*2*h) - h);
				arr[x][y] = avg;
				if(x == 0)  arr[DATA_SIZE-1][y] = avg;
				if(y == 0)  arr[x][DATA_SIZE-1] = avg;
			}
		}
	}
	return arr;
}
function isPowerOfTwo(x) {
    return (Math.log(x)/Math.log(2)) % 1 === 0;
}
function nextPowerOfTwo(x){
	var pow=1;
	while(pow<x){
		pow=pow<<1;
	}
	return pow;
}
function clampFromObj(num,clampObj)
{
	return clamp(num, clampObj.getMin(), clampObj.getMax());
}
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}
