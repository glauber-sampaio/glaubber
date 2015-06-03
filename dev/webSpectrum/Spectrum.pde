//---------------------------------------------------------------------------------------------------------------------------------------------    
//  A Spectrum visualizer

interface JavaScript
{
  void getSpektra();
}

//  make the connection (passing as the parameter) with javascript
void bindJavascript(JavaScript js)
{
  javascript = js;
}

//  instantiate javascript interface
JavaScript javascript;

void setup()
{
	//using full width of the browser window
  	size(screen.width,300);
  	noStroke();
}

void draw()
{
	background(255);

	//	error checking
    if(javascript!=null)
    {
      //  control function for sound analysis
      javascript.getSpektra();
    }
}

//	function to use the analyzed array
void drawSpektra(int[] sp)
{
	//	your nice visualization comes here...
	fill(0);
  	for (int i=0; i<sp.length; i++)
  	{
    	rect(i,height-30,width/sp.length,-sp[i]/2);    
  	}
}