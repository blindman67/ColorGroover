# ColorGroover
JavaScript object for manipulating colours.
Sorry for the bad format of this Readme doc as I dont know the formating rules yet.

Please fell free to email me at markspronck@gmail.com if you have any cmment, need help or what ever. Please include ColorGroover in the title so that I can keep you out of the spam folder.

This object provides a set of functions for handeling colours in a javascript environment.

Including the file MSColors.js will create a Local scoped object called color that will give access to all the functionality.



### To use.
```
// sets the output colour format to HEX eg "#FFFFFF"
color.setDefaultOutFormat("HEX");  
col = color.toDefault("red"); // returns a "#FF0000"
col = color.toDefault("Red"); // returns a "#FF0000"
col = color.toDefault([0,0,255]); // returns a "#0000FF"
col = color.toDefault("rgba(0,255,0,1)"); // returns a "#00FF00"
```

Getting formats.
```
color.formats // holds all the default out formats that can be used.
```

### List of out formats.   
HEX,hex,RGBA,RGBa,rgba,RGBC,RGBaC,Int24,Int32,Int12,Int16,HSLC,HSLaC,HSL,hsl,VA,Va,va,name,named,P,PRGB

Format descriptions.
* HEX: # then three 2 character hexadecimal for red green and blue
* hex  # then three 1 character hexadecimal numbers for red,green,blue


The following four are currently being developed please use at own risk.
* Int24 8 Bits per channel RGB Red lowest order to Blue highest.
* Int32 8 Bits per channel RGBA Red lowest order to Alpha highest.
* Int12 4 Bits per channel RGB Red lowest order to Blue highest.
* Int16 4 Bits per channel RGBA Red lowest order to Alpha highest.


Uppercase denotes binary range 0-255 and lowercaase denotes floating point range 0-1
* RGB array of [R,G,B];  // 0-255,0-255,0-255
* rgb array of [r,g,b];  // 0-1,0-1,0-1
* RGBA Array of [R,G,B,A]  <--- this is the default internal colour format
* RGBa Array of [R,G,B,a]
* rgba Array of [r,g,b,a]


CSS Hue saturation lightness and alpha
* HSLC CSS spec "hsl(H,S,L)"
* HSLaC CSS spec "hsl(H,S,L,a)"


CSS colour functions Red Green Blue and alpha
* RGBC CSS spec "rgb(R,G,B)"
* RGBaC CSS spec "rgba(R,G,B,a)"


Value is a grey scale value V is value and A is alpha Lowercase 0-1 Uppercase 0-255
* VA Array of [V,A]
* Va Array of [V,a]
* va Array of [v,a]
* V number of V


Photon counts. P is total photons recievied or emmited P >= 0 with white = 3*256*256
Photons are an abstract count and do not include time or area constants. To get the true counts you will need to referance the device detecting (Camera) or emitting (Screen) to find the constants for area and time.
PR,PG, and PB are 1/3 of P's area and have a range of P >= 0 and full on at 256*256 or 65536
* P Total Photon count.
* PRGB Photon count per channel.[PR,PG,PB]


Names are case insensitive. 
Use
```
    createNamedColorSet(name,[colours])
```
    name is the name of the named colour set.
    colours is a optional string of colours, delimited with comma "," then delimited with ":" with the lowercase name and 
    then the hex colour.
    
    eg 
    '''
    color.createNamedColorSet("Basic","red:#FF0000,green:#00FF00,blue:#0000FF,white:#FFFFFF,black:#000000")
    color.setActiveNamedColorSet("Basic"); // Basic colour set as active.
    color.setDefaultOutFormat("named");
    var col = color.toDefault([0,0,0]); // returns the string "black"
    '''
The named colour returned is the closest named colour that matches 
Note the named format is still under development. 
*name is a CSS3 named colour;
*named is a custom Color name.


### Usefull functions
Some functions. Colors are returned in the current default colour format. Use color.setDefaultOutFormat(format) to set the format

* tweenColor(col,col1,dist)
    returns a colour dist between using the RGB colour space. dist >=0 <= 1
    
* tweenPhotons(col,col1,point)
    returns a colour dist between using the Photon colour space. dist >=0 <= 1
    
* getComplementary(col)
    Returns the complementary colour
    
* add(col,col1)
    Returns the sum of the two colours in RGB colour space.
    
* subtract(col,col1)
    Returns col-col1 col subtract col1
    eg 
    color.subtract("yellow","Red") // returns [0,255,0,255] or "green" depending on the default format
    
* multiply(col,col1)
    Multipies col by col1. col1 can be a colour or a float value 
    
* addPhotons(col,col1)
   Same as add but us done in the Photon colour space
   
* subtractPhotons(col,col1)
   Same as  subtract but us done in the Photon colour space
   
* multiplyPhotons(col,col1)
   Same as  multiply but us done in the Photon colour space
   
* saturate(col,[amount])
   Saturates a colour. If amount is excluded then set saturation to 100%. 
   Amount is an optional float 
     0 = no saturatoin 
     <1 = reduces saturation
     1= no chance
     >1 = increases saturation.
     
   Note that grey values can not have additional saturation. Using saturate may give incorect values is you exclude the 
   optional amount argument.
   
* lighten(col,[amount])
   Lightens the colour to 100%
   Amount is optional and the same as above (saturate)
   
* hue(col,amount)
   Changes the HUE 
   amount is the hue to change to in the range 0-360
   
* furtherest(col)
   Get the colour furthest from the col
   
* contrast(col)
   Gets the contrasting colour Black ot White that is furthests
   
* tweenColorHSL(col,col1,point)
    Tweens in HSL space.
    
    
    
Still lots to do and debugging to be done.. 
