"use strict";

//  A breif over view. 
//
// It is intened that this file is created in the same scope as your application.
// I am rather new to Javascript coding so please excuse any unconvetional coding.

// Photon Color space
// Photon color space works on the principle that cameras compress the photns counts that hit each element of the CCD by calculating the square root of the number of photons.
// Using the photon color space give a more accurate visual interpretation of the colors when combining colors.



// Color type naming convention. (Sorry but I have messed with camel case conventions )
// These are only intened to be used in the following clour format descriptions
// R: Red channel value 0-255
// r: Red channel value 0-1
// G: Green channel value 0-255
// g: green channel value 0-1
// B: Blue channel value 0-255
// b: blue channel value 0-1
// A: Alpha channel value 0-255
// a: Alpha channel value 0-1
// V: Grey scale value 0-255
// v: Grey scale value 0-1
// H: Hue scale 0-360
// h: Hue scale 0-1
// S: Saturation value 0-100%
// s: Saturation value 0-1
// L: lightness value 0-100%
// l: lightness value 0-1
// P: Count of photons emitted or received per unit. P >= 0
// PR: Count of photons emitted or received for red. PR >= 0
// PG: Count of photons emitted or received for green. PR >= 0
// PB: Count of photons emitted or received for blue. PR >= 0


// Color format names.
// HEX: # then three 2 character hexadecimal for red green and blue
// hex  # then three 1 character hexadecimal numbers for red,green,blue
// Int24 8 Bits per channel RGB 
// Int32 8 Bits per channel RGBA
// Int12 4 Bits per channel RGB 
// Int16 4 Bits per channel RGBA
// nRGB Three named variables R,G,B 
// nrgb Three named variables r,g,b 
// nRGBA Four named variables R,G,B,A 
// nRGBa Four named variables R,G,B,a 
// nrgba Four named variables r,g,b,a 
// RGB array of [R,G,B];
// rgb array of [g,g,b];
// RGBA Array of [R,G,B,A]  <--- this is the default internal color format
// RGBa Array of [R,G,B,a]
// rgba Array of [r,g,b,a]
// RGBC HTML spec "rgb(R,G,B)"
// RGBaC HTML spec "rgba(R,G,B,a)"
// HSLC HTML spec "hsl(H,S,L,)"
// HSLaC HTML spec "hsla(H,S,L,a)"
// VA Array of [V,A]
// Va Array of [V,a]
// va Array of [v,a]
// P Total Photon count.
// PRGB Photon count per channel.[PR,PG,PB]
// name is a HTML CSS3 named colors;
// named is a custom set of named colors.
// COL unknown format color. If there is ambiguity assumes Integer values.
// col unknown format color. If there is ambiguity assumes float values.

var color = {
    defaultAlpha : 255,
    setDefaultAlpha : function (alpha) {
        color.defaultAlpha = alpha;
    },
    redValue : 1.0,
    greenValue : 1.0,
    blueValue : 1.0,
    normalizeValue : 3.0,
    setValueConvert_nRGB : function (r, g, b) {
        color.redValue = r;
        color.greenValue = g;
        color.blueValue = b;
        color.normalizeValue = r + g + b;
    },
    setValueConvert_sRGB : function () {
        color.redValue = 0.2126;
        color.greenValue = 0.7152;
        color.blueValue = 0.0722;
        color.normalizeValue = color.redValue + color.greenValue + color.blueValue;
    },
    setValueConvert_Luma : function () {
        color.redValue = 0.299;
        color.greenValue = 0.587;
        color.blueValue = 0.114;
        color.normalizeValue = color.redValue + color.greenValue + color.blueValue;
    },
    // added to indicate if a exact color name is found or not and the distance to the color if not exact
    namedExact : false,
    namedDistance : 0, // this value is only valid if namedExact if false and is the square of the spacial distance between the named color and the returned named color
    namedColorSets : {},
    namedColorSetNameList : [],
    activeNamedColorSet : null,
    getNamedColorSets : function () {
        return color.namedColorSetNameList;
    },
    getColorSetColorNames : function (setName) {
        if (color.namedColorSets[setName] !== undefined) {
            return color.namedColorSets[setName].names;
        }
        return null;
    },
    getColorSetColorHEX : function (setName) {
        if (color.namedColorSets[setName] !== undefined) {
            return color.namedColorSets[setName].HEX;
        }
        return null;
    },
    setActiveNamedColorSet : function (name) {
        if (color.namedColorSets[name] !== undefined) {
            color.activeNamedColorSet = color.namedColorSets[name];
        } else {
            color.activeNamedColorSet = null;
        }
    },
    createNamedColorSet : function (name, colors) {
        if (color.namedColorSets[name] === undefined) {
            var obj = {};
            obj.name = name;
            obj.names = [];
            obj.HEX = [];
            obj.RGB = [];
            if (typeof colors === 'string') {
                var pairs = colors.split(",");
                for (var i = 0; i < pairs.length; i++) {
                    var col = pairs[i].split(":");
                    obj.names.push(col[0].toLowerCase());
                    obj.HEX.push(col[1]);
                    obj.RGB.push([parseInt(col[1].substr(1, 2), 16), parseInt(col[1].substr(3, 2), 16), parseInt(col[1].substr(5, 2), 16)]);
                }
            }
            color.namedColorSets[name] = obj;
            color.namedColorSetNameList.push(name);

        }
    },
    addNamedColor : function (setName, colorName, col) {
        if (color.namedColorSets[setName] === undefined) {
            var obj = {};
            obj.name = name;
            obj.names = [];
            obj.HEX = [];
            obj.RGB = [];
            color.namedColorSets[setName] = obj;
            color.namedColorSetNameList.push(setName);
        }
        if (color.namedColorSets[setName] !== undefined) {
            var obj = color.namedColorSets[setName];
            colorName = colorName.toLowerCase();
            var index = obj.names.indexOf(colorName);
            if (index > -1) {
                obj.HEX[index] = color.RGBA2HEX(color.getRGBA(col));
                obj.RGB[index] = color.RGBA2RGB(color.getRGBA(col));
            } else {
                obj.names.push(colorName);
                obj.HEX.push(color.RGBA2HEX(color.getRGBA(col)));
                obj.RGB.push(color.RGBA2RGB(color.getRGBA(col)));
            }
        }
    },
    removeNamedColor : function (setName, colorName) {
        if (color.namedColorSets[setName] !== undefined) {
            colorName = colorName.toLowerCase();
            var obj = color.namedColorSets[setName];
            var index = obj.names.indexOf(colorName);
            if (index > -1) {
                obj.names.splice(index, 1);
                obj.HEX.splice(index, 1);
                obj.RGB.splice(index, 1);
            }
        }
    },
    removeNamedColorSet : function (setName) {
        if (color.namedColorSets[setName] !== undefined) {
            color.namedColorSets[setName] = undefined;
            var index = color.namedColorSetNameList.indexOf(name);
            if (index > -1) {
                color.namedColorSetNameList.splice(index, 1);
            }
        }
    },
    namedColors : (
        function () {
        var obj = {};
        obj.names = [];
        obj.HEX = [];
        obj.RGB = [];
        var namedColors = "aliceblue:#f0f8ff,antiquewhite:#faebd7,aqua:#00ffff,aquamarine:#7fffd4,azure:#f0ffff,beige:#f5f5dc,bisque:#ffe4c4,black:#000000,blanchedalmond:#ffebcd,blue:#0000ff,blueviolet:#8a2be2,brown:#a52a2a,burlywood:#deb887,cadetblue:#5f9ea0,chartreuse:#7fff00,chocolate:#d2691e,coral:#ff7f50,cornflowerblue:#6495ed,cornsilk:#fff8dc,crimson:#dc143c,cyan:#00ffff,darkblue:#00008b,darkcyan:#008b8b,darkgoldenrod:#b8860b,darkgray:#a9a9a9,darkgrey:#a9a9a9,darkgreen:#006400,darkkhaki:#bdb76b,darkmagenta:#8b008b,darkolivegreen:#556b2f,darkorange:#ff8c00,darkorchid:#9932cc,darkred:#8b0000,darksalmon:#e9967a,darkseagreen:#8fbc8f,darkslateblue:#483d8b,darkslategray:#2f4f4f,darkslategrey:#2f4f4f,darkturquoise:#00ced1,darkviolet:#9400d3,deeppink:#ff1493,deepskyblue:#00bfff,dimgray:#696969,dimgrey:#696969,dodgerblue:#1e90ff,firebrick:#b22222,floralwhite:#fffaf0,forestgreen:#228b22,fuchsia:#ff00ff,gainsboro:#dcdcdc,ghostwhite:#f8f8ff,gold:#ffd700,goldenrod:#daa520,gray:#808080,grey:#808080,green:#008000,greenyellow:#adff2f,honeydew:#f0fff0,hotpink:#ff69b4,indianred:#cd5c5c,indigo:#4b0082,ivory:#fffff0,khaki:#f0e68c,lavender:#e6e6fa,lavenderblush:#fff0f5,lawngreen:#7cfc00,lemonchiffon:#fffacd,lightblue:#add8e6,lightcoral:#f08080,lightcyan:#e0ffff,lightgoldenrodyellow:#fafad2,lightgray:#d3d3d3,lightgrey:#d3d3d3,lightgreen:#90ee90,lightpink:#ffb6c1,lightsalmon:#ffa07a,lightseagreen:#20b2aa,lightskyblue:#87cefa,lightslategray:#778899,lightslategrey:#778899,lightsteelblue:#b0c4de,lightyellow:#ffffe0,lime:#00ff00,limegreen:#32cd32,linen:#faf0e6,magenta:#ff00ff,maroon:#800000,mediumaquamarine:#66cdaa,mediumblue:#0000cd,mediumorchid:#ba55d3,mediumpurple:#9370d8,mediumseagreen:#3cb371,mediumslateblue:#7b68ee,mediumspringgreen:#00fa9a,mediumturquoise:#48d1cc,mediumvioletred:#c71585,midnightblue:#191970,mintcream:#f5fffa,mistyrose:#ffe4e1,moccasin:#ffe4b5,navajowhite:#ffdead,navy:#000080,oldlace:#fdf5e6,olive:#808000,olivedrab:#6b8e23,orange:#ffa500,orangered:#ff4500,orchid:#da70d6,palegoldenrod:#eee8aa,palegreen:#98fb98,paleturquoise:#afeeee,palevioletred:#d87093,papayawhip:#ffefd5,peachpuff:#ffdab9,peru:#cd853f,pink:#ffc0cb,plum:#dda0dd,powderblue:#b0e0e6,purple:#800080,red:#ff0000,rosybrown:#bc8f8f,royalblue:#4169e1,saddlebrown:#8b4513,salmon:#fa8072,sandybrown:#f4a460,seagreen:#2e8b57,seashell:#fff5ee,sienna:#a0522d,silver:#c0c0c0,skyblue:#87ceeb,slateblue:#6a5acd,slategray:#708090,slategrey:#708090,snow:#fffafa,springgreen:#00ff7f,steelblue:#4682b4,tan:#d2b48c,teal:#008080,thistle:#d8bfd8,tomato:#ff6347,turquoise:#40e0d0,violet:#ee82ee,wheat:#f5deb3,white:#ffffff,whitesmoke:#f5f5f5,yellow:#ffff00,yellowgreen:#9acd32";

        var pairs = namedColors.split(",");
        for (var i = 0; i < pairs.length; i++) {
            var col = pairs[i].split(":");
            obj.names.push(col[0].toLowerCase());
            obj.HEX.push(col[1]);
            obj.RGB.push([parseInt(col[1].substr(1, 2), 16), parseInt(col[1].substr(3, 2), 16), parseInt(col[1].substr(5, 2), 16)]);
        }
        return obj;
    })(),
    RGBA2P:        function(RGBA){     return RGBA[0]*RGBA[0] + RGBA[1]*RGBA[1] + RGBA[2]*RGBA[2];},
    RGBA2PRGB:     function(RGBA){     return [RGBA[0]*RGBA[0],RGBA[1]*RGBA[1],RGBA[2]*RGBA[2]];},
    RGBA2V:        function(RGBA){     return Math.round((RGBA[0]*color.redValue + RGBA[1]*color.greenValue + RGBA[2]*color.blueValue)/color.normalizeValue);},
    RGBA2VA:       function(RGBA){     return [Math.round((RGBA[0]*color.redValue + RGBA[1]*color.greenValue + RGBA[2]*color.blueValue)/color.normalizeValue),RGBA[3]];},
    RGBA2Va:       function(RGBA){     return [Math.round((RGBA[0]*color.redValue + RGBA[1]*color.greenValue + RGBA[2]*color.blueValue)/color.normalizeValue),(RGBA[3]/255).toFixed(3)];},
    RGBA2va:       function(RGBA){     return [(Math.round((RGBA[0]*color.redValue + RGBA[1]*color.greenValue + RGBA[2]*color.blueValue)/color.normalizeValue)/255).toFixed(3),(RGBA[3]/255).toFixed(3)];},
    RGBA2Int12:    function(c){        return (c[0]&0xf0)>>4 + (c[1]&0xf0) + ((c[2]&0xf0)<<4); },
    RGBA2Int16:    function(c){        return (c[0]&0xf0)>>4 + (c[1]&0xf0) + ((c[2]&0xf0)<<4)+((c[3]&0xf0)<<8); },
    RGBA2Int24:    function(c){        return c[0]&0xff + ((c[1]&0xff)<<8) + ((c[2]&0xff)<<16); },
    RGBA2Int32:    function(c){        return (c[3]&0xff) | ((c[2]&0xff)<<8) | ((c[1]&0xff)<<16) | ((c[0]&0xff)<<24); },
    RGBA2HEX:      function(c){        return "#"+(c[0] < 16?"0"+c[0].toString(16):c[0].toString(16))+ (c[1] < 16?"0"+c[1].toString(16):c[1].toString(16))+(c[2] < 16?"0"+c[2].toString(16):c[2].toString(16));},
    RGBA2hex:      function(c){        return "#"+((c[0]&0xf0)>>4).toString(16)+((c[1]&0xf0)>>4).toString(16)+((c[2]&0xf0)>>4).toString(16);},
    RGBA2RGBaC:    function(c){        return "rgba(" + c[0] + ","+ c[1] + "," + c[2] + "," + (c[3]/255).toFixed(3) + ")"; },
    RGBA2RGBC:     function(c){        return "rgb(" + c[0] + ","+ c[1] + "," + c[2] + ")"; },
    RGBA2RGB:      function(c){        return [c[0],c[1],c[2]]; },
    RGBA2rgb:      function(c){        return [(c[0]/255).toFixed(3),(c[1]/255).toFixed(3),(c[2]/255).toFixed(3)]; },
    RGBA2RGBA:     function(c){        return [c[0],c[1],c[2],c[3]]; },
    RGBA2RGBa:     function(c){        return [c[0],c[1],c[2],(c[3]/255).toFixed(3)]; },
    RGBA2rgba:     function(c){        return [(c[0]/255).toFixed(3),(c[1]/255).toFixed(3),(c[2]/255).toFixed(3),(c[3]/255).toFixed(3)]; },
    RGBA2named : function (RGBA) {
        var named = color.activeNamedColorSet;
        if (named === null) {
            throw ("No named color set active!");
        }
        var min = Infinity;
        var index = -1;
        for (var i = 0; i < named.RGB.length; i++) {
            var dist = Math.pow(RGBA[0] - named.RGB[i][0], 2) +
                Math.pow(RGBA[1] - named.RGB[i][1], 2) +
                Math.pow(RGBA[2] - named.RGB[i][2], 2);
            if (dist === 0) {
                color.namedExact = true;
                return named.names[i];
            } else
                if (dist < min) {
                    min = dist;
                    index = i;
                }
        }
        color.namedExact = false;
        color.namedDistance = min;
        return named.names[index];
    },
    RGBA2name : function (RGBA) {
        var min = Infinity;
        var index = -1;
        for (var i = 0; i < color.namedColors.RGB.length; i++) {
            var dist = Math.pow(RGBA[0] - color.namedColors.RGB[i][0], 2) +
                Math.pow(RGBA[1] - color.namedColors.RGB[i][1], 2) +
                Math.pow(RGBA[2] - color.namedColors.RGB[i][2], 2);
            if (dist === 0) {
                color.namedExact = true;
                return color.namedColors.names[i];
            } else
                if (dist < min) {
                    min = dist;
                    index = i;
                }
        }
        color.namedExact = false;
        color.namedDistance = min;
        return color.namedColors.names[index]; ;
    },
    
    
    P2RGBA:        function(P){        P = Math.min(255,Math.max(0,Math.round(Math.sqrt(P))));  return [P,P,P,color.defaultAlpha];},
    PRGB2RGBA:     function(P){        return [Math.sqrt(P[0]),Math.sqrt(P[1]),Math.sqrt(P[2]),color.defaultAlpha];},
    V2RGBA:        function(V){        return [V,V,V,color.defaultAlpha];},
    v2RGBA:        function(v){        v = Math.round(v*255);return [v,v,v,color.defaultAlpha];},
    VA2RGBA:       function(VA){       return [VA[0],VA[0],VA[0],VA[1]];},
    Va2RGBA:       function(Va){       return [Va[0],Va[0],Va[0],Math.round(Va[1]*255)];},
    va2RGBA:       function(va){       var v = Math.round(va[0]*255);return [v,v,v,Math.round(va[1]*255)];},
    Int122RGBA:    function(i){        return [(i&0xf)<<4,(i&0xf0),(i&0xf00)>>4,color.defaultAlpha];},
    Int162RGBA:    function(i){        return [(i&0xf)<<4,(i&0xf0),(i&0xf00)>>4,(i&0xf000)>>8];},
    Int242RGBA:    function(i){        return [(i&0xff),(i&0xff00)>>8,(i&0xff0000)>>16,color.defaultAlpha];},
    Int322RGBA:    function(i){        return [(i&0xff),(i&0xff00)>>8,(i&0xff0000)>>16,(i&0xff000000)>>24];},
    HEX2RGBA:      function(h){        return [parseInt(h.substr(1,2),16), parseInt(h.substr(3,2),16), parseInt(h.substr(5,2),16),color.defaultAlpha];},
    hex2RGBA:      function(h){        return [parseInt(h.substr(1,1)+h.substr(1,1),16), parseInt(h.substr(2,1)+h.substr(2,1),16), parseInt(h.substr(3,1)+h.substr(3,1),16),color.defaultAlpha];},
    RGBC2RGBA : function (rgb) {
        rgb = rgb.replace(/rgb\(|\)| /g, "").split(",");
        if (rgb[0][rgb[0].length - 1] === "%") { // if one has % all must
            return [Math.round(Number(rgb[0].substr(0, rgb[0].length - 1)) * 2.55),
                Math.round(Number(rgb[1].substr(0, rgb[1].length - 1)) * 2.55),
                Math.round(Number(rgb[2].substr(0, rgb[2].length - 1)) * 2.55),
                color.defaultAlpha];
        }
        return [Number(rgb[0]), Number(rgb[1]), Number(rgb[2]), color.defaultAlpha];
    },
    RGBAC2RGBA : function (rgb) {
        rgb = rgb.replace(/rgba\(|\| )/g, "").split(",");
        if (rgb[0][rgb[0].length - 1] === "%") { // if one has % all must
            return [Math.round(Number(rgb[0].substr(0, rgb[0].length - 1)) * 2.55),
                Math.round(Number(rgb[1].substr(0, rgb[1].length - 1)) * 2.55),
                Math.round(Number(rgb[2].substr(0, rgb[2].length - 1)) * 2.55),
                Math.round(Number(rgb[3]) * 255)];
        }
        return [Number(rgb[0]), Number(rgb[1]), Number(rgb[2]), Math.round(Number(rgb[3]) * 255)];
    },
    rgb2RGBA:      function(c){        return [Math.round(c[0]*255),Math.round(c[1]*255),Math.round(c[2]*255),Math.round(c[3]*255)]; },
    rgba2RGBA:     function(c){        return [Math.round(c[0]*255),Math.round(c[1]*255),Math.round(c[2]*255),Math.round(c[3]*255)]; },
    RGBa2RGBA:     function(c){        return [c[0],c[1],c[2],Math.round(c[3]*255)]; },
    name2RGBA : function (name) {
        var ind = color.namedColors.names.indexOf(name.toLowerCase());
        if (ind === -1) {
            return undefined;
        }
        ind = color.namedColors.RGB[ind];
        return [ind[0], ind[1], ind[2], color.defaultAlpha];
    },
    
    nRGBA2rgbC:    function(r,g,b){    return "rgb(" + r + ","+ g + "," + b + ")";},
    nRGBA2rgbaC:   function(r,g,b,a){  return "rgba(" + r + ","+ g + "," + b + "," + (a/255).toFixed(3) + ")"; },
    HEX2RGB:       function(h){        return [parseInt(h.substr(1,2),16), parseInt(h.substr(3,2),16), parseInt(h.substr(5,2),16)];},
    hex2RGB:       function(h){        return [parseInt(h.substr(1,1),16)*16, parseInt(h.substr(2,1),16)*16, parseInt(h.substr(3,1),16)*16];},
    nRGB2HEX:      function(r,g,b){    return "#" +  (r < 16?"0"+r.toString(16):r.toString(16))+(g < 16?"0"+g.toString(16):g.toString(16))+ (b < 16?"0"+b.toString(16):b.toString(16));},
    nRGB2Int24:      function(r,g,b){    return r&0xff + ((g&0xff)<<8) + ((b&0xff)<<16);},
    nRGBA2Int32:     function(r,g,b,a){  return r&0xff + ((g&0xff)<<8) + ((b&0xff)<<16) + ((a&0xff)<<24); },
    HSL2RGB : function (h, s, l) {
        var min,
        v;
        l /= 100;
        s /= 100;
        h /= 360
        v = l <= 0.5 ? l * (1 + s) : l + s - l * s;
        if (v === 0) {
            return [0, 0, 0];
        }
        min = 2 * l - v;
        h = (6 * h) % 6;
        switch (Math.floor(h)) {
        case 0:
            return [Math.round(v * 255), Math.round((min + (v * ((v - min) / v) * h)) * 255), Math.round(min * 255)];
        case 1:
            return [Math.round((v - (v * ((v - min) / v) * (h - 1))) * 255), Math.round(v * 255), Math.round(min * 255)];
        case 2:
            return [Math.round(min * 255), Math.round(v * 255), Math.round((min + (v * ((v - min) / v) * (h - 2))) * 255)];
        case 3:
            return [Math.round(min * 255), Math.round((v - (v * ((v - min) / v) * (h - 3))) * 255), Math.round(v * 255)];
        case 4:
            return [Math.round((min + (v * ((v - min) / v) * (h - 4))) * 255), Math.round(min * 255), Math.round(v * 255)];
        case 5:
            return [Math.round(v * 255), Math.round(min * 255), Math.round((v - (v * ((v - min) / v) * (h - 5))) * 255)];
        }
    },
    RGB2HSL : function (c) {
        var r,
        g,
        b,
        h,
        s,
        l,
        min,
        max,
        d;
        r = c[0] / 255;
        g = c[1] / 255;
        b = c[2] / 255;
        max = Math.max(r, g, b);
        min = Math.min(r, g, b);
        l = (max + min) / 2;

        if (max == min) {
            h = 0;
            s = 0; // achromatic
        } else {
            d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
            case r:
                h = (g - b) / d;
                break;
            case g:
                h = 2 + ((b - r) / d);
                break;
            case b:
                h = 4 + ((r - g) / d);
                break;
            }
            h *= 60;
            if (h < 0) {
                h += 360;
            }
            h = Math.round(h);
        }
        return [h, Math.round(s * 100), Math.round(l * 100)];
    },
    HSLC2RGBA : function (h) {
        h = h.replace(/hsl\(|\)|%| /g, "").split(",");
        h = color.HSL2RGB(h[0], h[1], h[2]);
        h.push(color.defaultAlpha);
        return h;
    },
    HSLaC2RGBA : function (h) {
        h = h.replace(/hsla\(|\)|%| /g, "").split(",");
        var a = Math.round(h[3] * 255);
        h = color.HSL2RGB(h[0], h[1], h[2]);
        h.push(a);
        return h;
    },
    HSL2RGBA:       function(h) { h = color.HSL2RGB(h[0],h[1],h[2]),h.push(color.defaultAplha);return h;},
    HSLA2RGBA:      function(h) { var a = h[3];h = color.HSL2RGB(h[0],h[1],h[2]),h.push(a);return h;},
    HSLa2RGBA:      function(h) { var a = Math.round(h[3]*255);h = color.HSL2RGB(h[0],h[1],h[2]),h.push(a);return h;},
    RGBA2HSL:       function(c) {return color.RGB2HSL(c);},
    RGBA2hsl:       function(c) {c = color.RGB2HSL(c);return [(c[0]/360).toFixed(3),(c[1]/100).toFixed(3),(c[2]/100).toFixed(3)]},
    RGBA2HSLa:      function(c) {var a = (c[3]/255).toFixed(3);c = color.RGB2HSL(c); c.push(a); return c;},
    RGBA2HSLA:      function(c) {var a = c[3];c = color.RGB2HSL(c); c.push(a); return c;},
    RGBA2HSLC:      function(c) { var hsl = color.RGB2HSL(c); return "hsl("+hsl[0]+","+ hsl[1]+"%,"+hsl[2]+"%)"; },
    RGBA2HSLaC:     function(c) {var hsl = color.RGB2HSL(c);  return "hsla("+hsl[0]+","+ hsl[1]+"%,"+hsl[2]+"%,"+(c[3]/255).toFixed(3)+")";},
    // changed this function to look at the CSS3 named colors then to look at the current named colors set if any.
    // will now return a tranparent black if no matching name is found.
    getRGBA:function(col){
        var namedCol;
        if(typeof col === "string"){
            if(col.length === 4){
                if(col[0] === "#"){
                    return color.hex2RGBA(col);
                }
            }else
            if(col.length === 7){
                if(col[0] === "#"){
                    return color.HEX2RGBA(col);
                }
            }else
            if(col[0] === "r"){
                if(col[3] === "("){
                    return color.RGBC2RGBA(col);
                }else
                if(col[4] === "("){
                    return color.RGBac2RGBA(col);
                }
            }else
            if(col[0] === "h"){
                if(col[3] === "("){
                    return color.HSLC2RGBA(col);
                }else
                if(col[4] === "("){
                    return color.HSLaC2RGBA(col);
                }
            }
            namedCol = color.name2RGBA(col);
            if(color.namedCol === undefined && color.activeNamedColorSet !== null){
                namedCol = color.named2RGBA(col);                    
            }
            if(namedColor === undefined){  // if name match can not be found create transparent color;
                namedCol = [0,0,0,0];
            }
            return namedCol;            
        }else
        if(typeof col === "number"){
            return color.Int322RGBA(col);
        }else
        if(col.length !== undefined){
            if(col.length === 2){
                return [col[0]&0xff,col[0]&0xff,col[0]&0xff,col[1]&0xff];
            }else
            if(col.length === 3){
                return [col[0]&0xff ,col[1]&0xff ,col[2]&0xff , color.defaultAlpha];
            }
            return [col[0]&0xff ,col[1]&0xff ,col[2]&0xff ,col[3]&0xff ];
            
        }
        
    },
    formats : "HEX,hex,RGBA,RGBa,rgba,RGBC,RGBaC,Int24,Int32,Int12,Int16,HSLC,HSLaC,HSL,hsl,VA,Va,va,name,PRGB".split(","),
    toDefault : function (COL) {
        return color.defaultOut(color.defaultIn(COL));
    },
    defaultOut : function (COL) {
        return COL;
    },
    defaultIn : function (col) {
        return color.getRGBA(col);
    }, // temp function as Color is not yet in scope
    inFormat : "Unknown",
    outFormat : "RGBA",
    setDefaultInFormat : function (format) {
        if (color.formats.indexOf(format) > -1) {
            color.defaultIn = Color[format + "2RGBA"];
            color.inFormat = format;
        }
        color.defaultIn = color.getRGBA;
        color.inFormat = "Unknown";
    },
    setDefaultOutFormat : function (format) {
        if (color.formats.indexOf(format) > -1) {
            color.defaultOut = Color["RGBA2" + format];
            color.outFormat = format;
            return true;
        }
        return false;
    },
    setup : (
        function () {
        return "Setup OK";
    })(),

    tweenColor : function (col, col1, point) {
        point = Math.min(1, Math.max(0, point));
        col = color.getRGBA(col);
        col1 = color.getRGBA(col1);
        col[0] = Math.floor(((col1[0] - col[0]) * point) + col[0]);
        col[1] = Math.floor(((col1[1] - col[1]) * point) + col[1]);
        col[2] = Math.floor(((col1[2] - col[2]) * point) + col[2]);
        col[3] = Math.floor(((col1[3] - col[3]) * point) + col[3]);
        return color.toDefault(col);

    },
    tweenPhotons : function (col, col1, point) {
        var a,
        a1;
        point = Math.min(1, Math.max(0, point));
        col = color.getRGBA(col);
        col1 = color.getRGBA(col1);
        a = col[3];
        a1 = col1[3];
        col = color.RGBA2PRGB(col);
        col1 = color.RGBA2PRGB(col1);
        col[0] = Math.floor(((col1[0] - col[0]) * point) + col[0]);
        col[1] = Math.floor(((col1[1] - col[1]) * point) + col[1]);
        col[2] = Math.floor(((col1[2] - col[2]) * point) + col[2]);
        a = Math.floor(((a1 - a) * point) + a);
        col = color.PRGB2RGBA(col);
        col[3] = a;
        return color.toDefault(col);

    },
    getComplementary : function (col) {
        col = color.RGBA2HSLA(color.getRGBA(col));
        col[0] = (col[0] + 180) % 360;
        return color.toDefault(color.HSLA2RGBA(col));

    },
    add : function (col, col1) {
        col = color.getRGBA(col);
        col1 = color.getRGBA(col1);
        col[0] = Math.min(255, col[0] + col1[0]);
        col[1] = Math.min(255, col[1] + col1[1]);
        col[2] = Math.min(255, col[2] + col1[2]);
        col[3] = Math.min(255, col[3] + col1[3]);
        return color.toDefault(col);
    },
    subtract : function (col, col1) {
        col = color.getRGBA(col);
        col1 = color.getRGBA(col1);
        col[0] = Math.max(0, col[0] - col1[0]);
        col[1] = Math.max(0, col[1] - col1[1]);
        col[2] = Math.max(0, col[2] - col1[2]);
        col[3] = Math.max(0, col[3] - col1[3]);
        return color.toDefault(col);
    },
    multiply : function (col, col1) {
        col = color.getRGBA(col);
        if (typeof col1 === 'number') {
            col[0] = Math.min(255, Math.max(0, Math.round(col[0] * col1)));
            col[1] = Math.min(255, Math.max(0, Math.round(col[1] * col1)));
            col[2] = Math.min(255, Math.max(0, Math.round(col[2] * col1)));
            col[3] = Math.min(255, Math.max(0, Math.round(col[3] * col1)));
        } else {
            col1 = color.getRGBA(col1);
            col[0] = Math.round(col[0] * (col1[0] / 255));
            col[1] = Math.round(col[1] * (col1[1] / 255));
            col[2] = Math.round(col[2] * (col1[2] / 255));
            col[3] = Math.round(col[3] * (col1[3] / 255));
        }
        return color.toDefault(col);
    },
    // fixed bug squaring second color
    addPhotons : function (col, col1) {
        col = color.getRGBA(col);
        col1 = color.getRGBA(col1);

        col[0] = Math.min(255, Math.sqrt(col[0] * col[0] + col1[0] * col1[0]));
        col[1] = Math.min(255, Math.sqrt(col[1] * col[1] + col1[1] * col1[1]));
        col[2] = Math.min(255, Math.sqrt(col[2] * col[2] + col1[2] * col1[2]));
        col[3] = Math.min(255, col[3] + col1[3]);
        return color.toDefault(col);
    },
    // fixed bug squaring second color
    // corrected this function to subtract not add
    subtractPhotons : function (col, col1) {
        col = color.getRGBA(col);
        col1 = color.getRGBA(col1);
        col[0] = Math.max(0, Math.sqrt(col[0] * col[0] - col1[0] * col1[0]));
        col[1] = Math.max(0, Math.sqrt(col[1] * col[1] - col1[1] * col1[1]));
        col[2] = Math.max(0, Math.sqrt(col[2] * col[2] - col1[2] * col1[2]));
        col[3] = Math.max(0, col[3] - col1[3]);
        return color.toDefault(col);
    },
    multiplyPhotons : function (col, col1) {
        col = color.getRGBA(col);
        if (typeof col1 === 'number') {
            col[0] = Math.min(255, Math.max(0, Math.round(Math.sqrt(col[0] * col[0] * col1))));
            col[1] = Math.min(255, Math.max(0, Math.round(Math.sqrt(col[1] * col[1] * col1))));
            col[2] = Math.min(255, Math.max(0, Math.round(Math.sqrt(col[2] * col[2] * col1))));
            col[3] = Math.min(255, Math.max(0, Math.round(col[3] * col1)));
        } else {
            col1 = color.getRGBA(col1);
            col[0] = Math.round(Math.sqrt((col[0] * col[0]) * ((col1[0] * col1[0]) / 65536)));
            col[1] = Math.round(Math.sqrt((col[1] * col[1]) * ((col1[1] * col1[1]) / 65536)));
            col[2] = Math.round(Math.sqrt((col[2] * col[2]) * ((col1[2] * col1[2]) / 65536)));
            col[3] = Math.round(col[3] * (col1[3] / 255));
        }
        return color.toDefault(col);
    },
    saturate : function (col, amount) {
        col = color.RGBA2HSLA(color.getRGBA(col));
        if (amount !== undefined) {
            col[1] = Math.round(Math.min(100, Math.max(0, col[1] * amount)));
        } else {
            col[1] = 100
        }
        return color.toDefault(color.HSLA2RGBA(col));
    },
    lighten : function (col, amount) {
        col = color.RGBA2HSLA(color.getRGBA(col));
        if (amount !== undefined) {
            col[2] = Math.min(100, Math.max(0, Math.round(col[2] * amount)));
        } else {
            col[2] = 100
        }
        return color.toDefault(color.HSLA2RGBA(col));
    },

    hue : function (col, amount) {
        col = color.RGBA2HSLA(color.getRGBA(col));
        if (amount !== undefined) {
            col[0] = 180 * amount;
        } else {
            col[0] = 100
        }
        return color.toDefault(color.HSLA2RGBA(col));
    },
    furtherest : function (col) {
        col = color.getRGBA(col);
        col[0] = col[0] < 128 ? 255 : 0;
        col[1] = col[1] < 128 ? 255 : 0;
        col[2] = col[2] < 128 ? 255 : 0;
        return color.toDefault(col);
    },
    contrast : function (col) {
        col = color.RGBA2V(color.getRGBA(col));
        if (col < 128) {
            return color.toDefault([255, 255, 255, 255]);
        }
        return color.toDefault([0, 0, 0, 255]);
    },
    tweenColorHSL : function (col, col1, point) {
        point = Math.min(1, Math.max(0, point));
        col = color.RGBA2HSLA(color.getRGBA(col));
        col1 = color.RGBA2HSLA(color.getRGBA(col1));
        col[0] = Math.floor(((col1[0] - col[0]) * point) + col[0]);
        col[1] = Math.floor(((col1[1] - col[1]) * point) + col[1]);
        col[2] = Math.floor(((col1[2] - col[2]) * point) + col[2]);
        col[3] = Math.floor(((col1[3] - col[3]) * point) + col[3]);
        return color.toDefault(color.HSLA2RGBA(col));

    },
}


