// replica of : https://app.haikei.app
export{}
declare global {
    interface Window {
        PANOLENS:any,
        toastr:any,
        pdfjsLib:any,
        MobileDetect:any,

        followCursor:any,
        device:any,
        deviceChecker:any,
        modalActive:any,
        modalInactive:any,
        interactiveActive:any,
        cNarratorCaption:boolean,
        cCaption:boolean,
        cVolume:number,
        cPlaybackSpeed:number,
        setTimeout:any
        isFullscreen:boolean,
        showPlayerBar:any,

        //window mouse.key
        autoClose:any,
        elemBelow:any,
        movement:boolean,
        autoHideBars:boolean

        //loader
        loader:any,
        
        //main UI
        settingBar:any,
        sideBar:any,
        // [key: string]: any
        playerBar:any,
        mediaCont:any,


        //observer
        sizeObserver:any;

        //media Callables
        media:any
        videos:any,
        audios:any,

        //UI callables
        showBars:any,
        hideBars:any,
        uiVisibilityManager:any,

        //MISC
        MISC:any

        slideshow:any,
        dog:object,
        webkitAudioContext:any,
        testAudio:any,
    }
    interface anyObj {
        // [key:string]:any
    }
    interface eventsTemplate{
        onOver?:any,
        onSelect?:any,
        onActive?:any,
        onLeave?:any,
        enableAllKeys?:boolean,
        disableKeys?:boolean,
        custom?: object,
    }
    interface elemTemplate{
        // [key:string]:any,
        type: string,

        identity?:string,
        class?:string,
        id?:string,

        innerText?:string | number,
        // innerHTML?:any,
        tabbable?:boolean,

        attributes?:object,
        props?:object,
        events?:eventsTemplate,
        setup?:any, //executable function

        appendTo?:any
    }


    interface svgTemplate{
        viewBox?:string,
        groups:svgGroups[]
        styles?:object
        props?:object
        attributes?:object
        events?:object

    }
    interface svgGroups{
        shapes:svgShape[]
        blobs?:svgBlob[]
        styles?:object
        props?:object
        attributes?:object
        events?:object
    }
    interface svgBlob{
        x:number //centerX
        y:number //centerY
        r:number //radius
        c:number //complexity 1-4
        rnd:boolean
    }
    interface svgShape { 
        // circ?:{r:number,cx:number,cy:number}
        circle?:{r:number,cx:number,cy:number}
        rect?:{width:number,height:number,x?:number,y?:number,rx?:number,ry?:number}
        // rectangle?:{width:number,height:number,x?:number,y?:number,rx?:number,ry?:number}
        // ellip?:{cx?:number,cy?:number,rx:number,ry:number}
        ellipse?:{cx?:number,cy?:number,rx:number,ry:number}
        line?:{x1:number,x2:number,y1:number,y2:number}
        // polyl?:{points:string}
        polyline?:{points:string}
        // polyg?:{points:string}
        polygon?:{points:string}
        path?:{d:string}
        blob?:svgBlob,
        styles?:object
        props?:object
        attributes?:object
        events?:object
    }
}

let addPEAS = (elem:any, obj:svgShape)=>{
    if (obj.styles) { //set svg styles
        Object.entries(obj.styles).forEach(([key,val])=>{
            elem.style.setProperty(key,val)
        })
    }
    if (obj.props){
        Object.entries(obj.props).forEach(([key,val])=>{
            Object.assign(elem,{[key] : val})
        })
    } 
    if (obj.attributes){
        Object.entries(obj.attributes).forEach(([key,val])=>{
            elem.setAttribute(key,val)
        })
    }
    if (obj.events){
        Object.entries(obj.events).forEach(([key,val])=>{
            elem.addEventListener(key,val)
        })
    }
}
let blobGen =(obj:{
    x:number //centerX
    y:number //centerY
    r:number //radius
    complexity:number //complexity 0-9
    contrast:number //contrast 0-8
    keepVol?:boolean
})=>{
    let configRNG = {
        run: 0,
        min: 1,
        max: 1,
        maxRuns:999,
        totalRND:0,
    }
    let addContrast = ()=>{
        switch(obj.contrast){
            case 0:
                configRNG.min = 1;break
            case 1: 
                configRNG.min = .86;break
            case 2:
                configRNG.min = .8;break
            case 3: 
                configRNG.min = .75;break
            case 4: 
                configRNG.min = .6;break
            case 5: 
                configRNG.min = .5;break
            case 6: 
                configRNG.min = .4;break
            case 7: 
                configRNG.min = .3;break
            case 8: 
                configRNG.min = .25;break
        }
        // console.log("FIX CONTRAST")
        //reports remaningRND to keep Volume
        if(configRNG.run + 1 == configRNG.maxRuns){ 
            let rem = configRNG.maxRuns - configRNG.totalRND
            // console.log("remaining RND is:" + rem)
            return rem > 1 ? 1 : rem
        }

        let cdiff = configRNG.run - configRNG.totalRND
        if(cdiff > 0 && cdiff < 1.25){
            let trnd = cdiff
        }

        let rnd = Math.random() * (configRNG.max-configRNG.min) + configRNG.min
        configRNG.run += 1
        configRNG.totalRND += rnd
        return rnd
    }
    let getTotalPoints =()=>{
        switch(obj.complexity){
            case 0: return 3
            case 2: return 5
            case 1: return 4
            case 3: return 6
            case 4: return 7
            case 5: return 8
            case 6: return 9
            case 7: return 10
            case 8: return 11
            case 9: return 12
        }
    }
    let getXYCoord =(obj:{
        r:number
        deg:number
        x:number
        y:number
    })=>{
        let rng = obj.r! * addContrast()!
        let x = Math.round((obj.x + ((rng) *Math.sin((obj.deg * Math.PI)/180)))*100)/100
        let y = Math.round((obj.y - ((rng) *Math.cos((obj.deg * Math.PI)/180)))*100)/100
        
        return {x,y,deg:obj.deg,rng}
    }
    let getAnchorR = (obj:{ //get proper radius for proper Circle
        c:number
        r:number
    })=>{
        switch(obj.c){
            case 0: return obj.r *.77
            case 1: return obj.r *.55
            case 2: return obj.r *.4
            case 3: return obj.r *.33
            case 4: return obj.r *.315
            case 5: return obj.r *.29
            case 6: return obj.r *.27
            case 7: return obj.r *.24
            case 8: return obj.r *.2
        }
    }
    let getA1CoordDeg =(obj:{ //get proper degree for anchor coordinate to create a circle
        c:number
        prevDeg:number
        deg:number
    })=>{
        // console.log("Chk params")
        // console.log(obj)
        switch(obj.c){
            case 0: return obj.prevDeg + (obj.deg - obj.prevDeg)*.75
            case 1: return obj.prevDeg + (obj.deg - obj.prevDeg)*1
            case 2: return obj.prevDeg + (obj.deg - obj.prevDeg)*1.2
            case 3: return obj.prevDeg + (obj.deg - obj.prevDeg)*1.45
            case 4: return obj.prevDeg + (obj.deg - obj.prevDeg)*1.75 //sus
            case 5: return obj.prevDeg + (obj.deg - obj.prevDeg)*2.025 //sus
            case 6: return obj.prevDeg + (obj.deg - obj.prevDeg)*2.31 //sus
            case 7: return obj.prevDeg + (obj.deg - obj.prevDeg)*2.55 //sus
            case 8: return obj.prevDeg + (obj.deg - obj.prevDeg)*2.75 //sus
        }
    }
    let getA2CoordDeg =(obj:{ //get proper degree for anchor coordinate to create a circle
        c:number
        prevDeg:number
        deg:number
    })=>{
        switch(obj.c){
            case 0: return obj.prevDeg + (obj.deg - obj.prevDeg)*.25
            case 1: return obj.prevDeg + (obj.deg - obj.prevDeg)*0
            case 2: return obj.prevDeg + (obj.deg - obj.prevDeg)*-.2
            case 3: return obj.prevDeg + (obj.deg - obj.prevDeg)*-.45
            case 4: return obj.prevDeg + (obj.deg - obj.prevDeg)*-.75
            case 5: return obj.prevDeg + (obj.deg - obj.prevDeg)*-1.025
            case 6: return obj.prevDeg + (obj.deg - obj.prevDeg)*-1.31
            case 7: return obj.prevDeg + (obj.deg - obj.prevDeg)*-1.55
            case 8: return obj.prevDeg + (obj.deg - obj.prevDeg)*-1.75
        }
    }
    

    // let startPoint2 = {x:obj.x, y:Math.round((obj.y - (obj.r*addContrast()))*100)/100}
    let rndDeg = Math.random() * 45
    let startPoint = getXYCoord({ //anchor for cPoint
        r:obj.r,
        x:obj.x,
        y:obj.y,
        deg:rndDeg
        // deg:0
    })
    
    // console.log(startPoint)
    let d= "M " + startPoint.x + "," + startPoint.y + " "
    if([0,1,2,3,4,5,6,7,8,9].includes(obj.complexity)){
        //get number of circle points depending on complexity (min:3 max:27)
        let points = getTotalPoints()
        let space = 360/points!
        let pos = 0
        let prevPoint = startPoint
        let prevDeg = rndDeg
        configRNG.maxRuns = points! + (points! * 2) //maxRuns = max radius percentage to retain shape volume

        while(pos != points){
            
            // let deg = space * (pos + 1)
            let deg = rndDeg + (space * (pos + 1))
            let cPoint = getXYCoord({ //accurate next point on the perfect circle
                r:obj.r,
                x:obj.x,
                y:obj.y,
                deg:deg
            })
            if(points == (pos + 1)){
                cPoint.x = startPoint.x
                cPoint.y = startPoint.y
            }
            
            let anchorRadius = getAnchorR({c:obj.complexity,r:obj.r})
            let a1Deg = getA1CoordDeg({c:obj.complexity,deg:deg,prevDeg:prevDeg})!
            let a2Deg = getA2CoordDeg({c:obj.complexity,deg:deg,prevDeg:prevDeg})!
            let a1 = getXYCoord({ //anchor for prevPoint
                r:anchorRadius!,
                x:prevPoint.x,
                y:prevPoint.y,
                deg:a1Deg
            })
            let a2 = getXYCoord({ //anchor for cPoint
                r:anchorRadius!,
                x:cPoint.x,
                y:cPoint.y,
                deg:a2Deg
            })
            // console.log("newPoint",cPoint)
            // console.log("a1",a1)
            // console.log("a2",a2)

            // guidePath = guidePath + "M" + prevPoint.x + "," + prevPoint.y + " L" + a1.x + "," + a1.y + " M" + cPoint.x + "," + cPoint.y + " L" + a2.x + "," + a2.y + " "
            let c = "C " + a1.x + "," + a1.y + " " + a2.x + "," + a2.y + " " + cPoint.x + "," + cPoint.y
            //guide line
            // let c = "L " + a1.x + "," + a1.y + " " + a2.x + "," + a2.y + " " + cPoint.x + "," + cPoint.y
            if(points == (pos + 1)){c = c + "z"}
            d = d + c + " "
            
            // console.log(c)

            prevPoint = cPoint //transfer coords of currentPoint
            prevDeg = deg //transfer deg of currentPoint
            pos++
        }
        
        // console.log(d)
        return d
    } else throw Error ("Blob complexity can only be 0-9")
}
let waveGen = (obj:{
    w:number,
    h:number,
    bal:number, // 0-9 
    complexity:number, // 0-30
    contrast:number, // 0-10
})=>{
    let getBalance = ()=>{ //flat line starts at % of Y-axis
        switch(obj.bal!){
            case 0: return .95;
            case 1: return .90;
            case 2: return .85;
            case 3: return .80;
            case 4: return .75;
            case 5: return .70;
            case 6: return .65;
            case 7: return .60;
            case 8: return .55;
            case 9: return .50;
        }
    }
    let getContrast = (cbal:number)=>{ //min max Y-coords based on % of unused Y-axis 
        let avail = obj.h-cbal //1-.95 = .05 avail
        console.log(cbal)
        switch(obj.contrast!){ //min:
            case 0: return {min:cbal-(avail*0),max:cbal+(avail*0)};
            case 1: return {min:cbal-(avail*.1),max:cbal+(avail*.1)};
            case 2: return {min:cbal-(avail*.2),max:cbal+(avail*.2)};
            case 3: return {min:cbal-(avail*.3),max:cbal+(avail*.3)};
            case 4: return {min:cbal-(avail*.4),max:cbal+(avail*.4)};
            case 5: return {min:cbal-(avail*.5),max:cbal+(avail*.5)};
            case 6: return {min:cbal-(avail*.6),max:cbal+(avail*.6)};
            case 7: return {min:cbal-(avail*.7),max:cbal+(avail*.7)};
            case 8: return {min:cbal-(avail*.8),max:cbal+(avail*.8)};
            case 9: return {min:cbal-(avail*.9),max:cbal+(avail*.9)};
            case 10: return {min:cbal-(avail*1),max:cbal+(avail*1)};
        }
    }
    let getComplexity = ()=>{
        switch(obj.complexity!){
            case 0: return 0;
            case 1: return 2;
            case 2: return 3;
            case 3: return 4;
            case 4: return 5;
            case 5: return 6;
            case 6: return 7;
            case 7: return 8;
            case 8: return 9;
            case 9: return 10;
            case 10: return 11;
            case 11: return 12;
            case 12: return 13;
            case 13: return 14;
            case 14: return 15;
            case 15: return 16;
            case 16: return 17;
            case 17: return 18;
            case 18: return 19;
            case 19: return 20;
            case 20: return 21;
            case 21: return 22;
            case 22: return 23;
            case 23: return 24;
            case 24: return 25;
            case 25: return 26;
            case 26: return 27;
            case 27: return 28;
            case 28: return 29;
            case 29: return 30;
            case 30: return 31;
        }
    }
    let getFirstPoint = (min:number,max:number,origin:number)=>{
        let yPoint = Math.round(Math.random() * (max - min) + min*100)/100
        /* 
                45 prevYisAbove = true
        50 ------------------------
                55 prevYisAbove = false
        */
        if(origin > yPoint){//states if point is above or below
            prevYisAbove = true
        } else prevYisAbove= false

        return {x:0,y:yPoint}
    }
    let getLastPoint = (min:number,max:number)=>{
        let yPoint = Math.random() * (max - min) + min

        return {x:obj.w,y:yPoint}
    }
    let getAnchorPoint=()=>{}
    let getRndYCoord = (prevY:number,limit:{
        min:number,
        max:number
    })=>{
        /* 
                45 prevYisAbove = true
        50 ----------------------------------
                55 prevYisAbove = false
        */
       let yPoint
        if(prevYisAbove){
            prevYisAbove = !prevYisAbove
            yPoint = Math.round(Math.random() * (limit.max - prevY) + prevY*100)/100
        } else {
            prevYisAbove = !prevYisAbove
            yPoint = Math.round(Math.random() * (limit.min - prevY) + prevY*100)/100
        }

        return yPoint
    }

    console.log("FIX CONTRAST")
    console.log("FIX first point must not be stuck at one point")
    console.log(obj)
    let d = ""
    let prevYisAbove = false
    let yOrigin = getBalance()! * obj.h
    let yLimits = getContrast(yOrigin)!
    let complexity = getComplexity()
    console.log(yLimits)

    let startPoint = getFirstPoint(yLimits.min,yLimits.max,yOrigin)
    let lastPoint = getLastPoint(yLimits.min,yLimits.max)
    d+= "M" + startPoint.x + " " + startPoint.y + " "
    
    if(complexity == 0){
        d+= "L" + lastPoint.x + " " + lastPoint.y
        return d
    } else {
        
        // c1 M C C
        let totalPoints = complexity!//how many C cmnds to make
        let cPoint = 1
        let space = obj.w / totalPoints
        while (cPoint < totalPoints + 1){
            let x = Math.round(cPoint++ * space *100)/100//next xCoord

            console.log("point created")
            d+= "L" + x + " " + getRndYCoord(startPoint.y,yLimits) + " "
            

            if(cPoint == totalPoints + 1){
                d+= "z"
            }
            //C50 82 52 45 63 84
            //how to make these C cmnds
            //first get next X point
        }
        
        return d
    }
    
    console.log("TO DO: GET x-axis of 1st L COMMAND")
    console.log({
        yOrigin:yOrigin,
        yLimits:yLimits,
    })
/* 

complexity 0-30

M0 464
L75 448
C150 432 300 400 450 339.5
C600 279 750 190 825 145.5
L900 101

M0 296L50 262.8
C100 229.7 200 163.3 300 196.7
C400 230 500 363 600 416.7
C700 470.3 800 444.7 850 431.8
L900 419

*/
}

/* 
M65 37.5
C43.3 75 -43.3 75 -65 37.5
C-86.6 0 -43.3 -75 0 -75
C43.3 -75 86.6 0 65 37.5

M65 37.5
C43.3 75 -43.3 75 -65 37.5
C-86.6 0 -43.3 -75 0 -75
C43.3 -75 86.6 0 65 37.5

M100 0
C100 50 50 100 0 100
C-50 100 -100 50 -100 0
C-100 -50 -50 -100 0 -100
C50 -100 100 -50 100 0


*/
export function nSvg(request:svgTemplate){ 
    // ---------------------- SETUP SVG --------------
    let xmlns = "http://www.w3.org/2000/svg"
    let svg = document.createElementNS(xmlns, "svg")
    
    if(typeof request.viewBox == "string"){
        let length = request.viewBox.split(" ").length
        if(length != 4){
            if(length < 4){
                while ( 4 > length){
                    request.viewBox = "0 " + request.viewBox
                    length++
                }
            }
        }
    }
    svg.setAttributeNS(null, "viewBox", request.viewBox || "0 0 100 100");
    svg.setAttribute("xmlns", xmlns);
    // preserveAspectRatio?

    addPEAS(svg,request)
    // ---------------------- SETUP GROUPS --------------
    request.groups.forEach((group) => {
        let cGroup = document.createElementNS(xmlns, "g");

        addPEAS(cGroup,group)
        group.shapes.forEach((shape) => { //set shapes
            // console.log(shape)
            let nShape:any = document.createElementNS(xmlns, "path")

            Object.entries(shape).forEach(([key,val])=>{
                // console.log(shape) //obj
                // console.log(key) //shape["key"] = "value"
               
                if (key.includes("circ")) {
                    nShape = document.createElementNS(xmlns, "circle");
                    nShape.setAttributeNS(null, "r", val.r);
                    nShape.setAttributeNS(null, "cx", val.cx || 0 );
                    nShape.setAttributeNS(null, "cy", val.cy || 0);
                } else if (key.includes("rect")) {
                    nShape = document.createElementNS(xmlns, "rect");
                    nShape.setAttributeNS(null, "width", val.width);
                    nShape.setAttributeNS(null, "height", val.height);

                    nShape.setAttributeNS(null, "rx", val.rx || 0);
                    nShape.setAttributeNS(null, "ry", val.ry || 0);
                    nShape.setAttributeNS(null, "x", val.x || 0);
                    nShape.setAttributeNS(null, "y", val.y || 0);

                } else if (key.includes("ellip")) {
                    nShape = document.createElementNS(xmlns, "ellipse");
                    nShape.setAttributeNS(null, "cx", val.cx || 0);
                    nShape.setAttributeNS(null, "cy", val.cy || 0);
                    nShape.setAttributeNS(null, "rx", val.rx);
                    nShape.setAttributeNS(null, "ry", val.ry);
                } else if (key.includes("line")) {
                    nShape = document.createElementNS(xmlns, "line");
                    nShape.setAttributeNS(null, "x1", val.x1);
                    nShape.setAttributeNS(null, "x2", val.x2);
                    nShape.setAttributeNS(null, "y1", val.y1);
                    nShape.setAttributeNS(null, "y2", val.y2);
                } else if (key.includes("polyl")) {
                    nShape = document.createElementNS(xmlns, "polyline");
                    nShape.setAttributeNS(null, "points", val.points);
                } else if (key.includes("polyg")) {
                    nShape = document.createElementNS(xmlns, "polygon");
                    nShape.setAttributeNS(null, "points", val.points);
                } else if (key.includes("path")) {
                    nShape = document.createElementNS(xmlns, "path");
                    nShape.setAttribute("d", val.points);

                } else if (key.includes("blob")) {
                    nShape = document.createElementNS(xmlns, "path");
                    nShape.setAttribute("type", key);
                    nShape.setAttributeNS(null, "d", blobGen(val));
                    Object.assign(nShape,{ //store blob request parameters
                        config:val,
                        update:function(){
                            nShape.setAttribute("d",blobGen(this.config!) )
                        }
                    })
                } else if (key.includes("wave")) {
                    nShape = document.createElementNS(xmlns, "path");
                    let viewBox = svg.getAttribute("viewBox")?.split(" ")
                    nShape.setAttribute("type", key);

                    let d = waveGen({...val,w:parseFloat(viewBox![2]),h:parseFloat(viewBox![3])})
                    console.log(d)
                    nShape.setAttributeNS(null, "d", d);
                }
                
            })
            addPEAS(nShape,shape)

            cGroup.appendChild(nShape);
        });
        svg.appendChild(cGroup);
    });
    
    console.log(svg)
    return svg;
}
export function normalizeSvg(request:svgTemplate){
    // let nObj:svgTemplate = {...request!}
    let prevViewbox:{ //viewBox interface
        x?:any,
        y?:any,
        width?:any,
        height?:any,
    } = {}

    if(request.viewBox){
        let arr = request.viewBox.split(" ")
        if(arr.length >= 2){    
            let adfa = arr[2] ? arr[0]: 0
            prevViewbox.x = arr[2] ? parseFloat(arr[0]) : 0
            prevViewbox.y = arr[3] ? parseFloat(arr[1]) : 0
            prevViewbox.width = arr[2] ? parseFloat(arr[2]) : parseFloat(arr[0])
            prevViewbox.height = arr[3] ? parseFloat(arr[3]) : parseFloat(arr[1])
        } else throw Error("viewBox must have 2 or 4 values e.g. '100 100' OR '0 0 100 100'")
        
        request.viewBox = "0 0 100 100"
    }
    /* groups look like this: arr
        [
            {
                shape:[
                    {rect:{width:8,height:8,rx:2}},
                    {rect:{width:8,height:8,rx:2}}
                ]
            }
        ]
    */
    /* group looks like this: obj
        {
            shape:[
                {rect:{width:8,height:8,rx:2}},
                {rect:{width:8,height:8,rx:2}}
            ]
        }
    */
    /* shapes look like this: arr
        [
            {rect:{width:8,height:8,rx:2}},
            {rect:{width:8,height:8,rx:2}},
        ]
     */
    /* shape look like this: obj
        {rect:{width:8,height:8,rx:2}},
    */
    
    request.groups.forEach((group,groupNum) => {
        group.shapes.forEach((shape,shapeNum) => { //set shapes

            let hasWidthParam = [
                "x",
                "x1",
                "x2",
                "rx",
                "cx",
                "width",
            ]
            let hasHeightParam = [
                "y",
                "y1",
                "y2",
                "ry",
                "cy",
                "height"
            ]
            let prefersSmallerSideParam = [
                "r"
            ]
            let hasBothParams = [
                // "r",
                "d",
                "points"
            ]

            let normalizeWidth = (x:number | string)=>{
                if(typeof x ==  "number"){
                    return ((x / prevViewbox.width) * 100).toFixed(2)
                } else if(typeof x ==  "string"){
                    return ((parseFloat(x) / prevViewbox.width) * 100).toFixed(2)
                } else throw new Error("something went wrong")
            }
            let normalizeHeight = (y:number | string)=>{
                if(typeof y ==  "number"){
                    return ((y / prevViewbox.height) * 100).toFixed(2)
                } else if(typeof y ==  "string"){
                    return ((parseFloat(y) / prevViewbox.height) * 100).toFixed(2)
                } else throw new Error("something went wrong")
            }
            // let normalizeHeight = (x:any)=>{return x}
            // let normalizeWidth = (x:any)=>{return x}

            let nShape:svgShape = shape
            // {rect:{width:25,height:20,x:20,y:20}}

            let nVal:any; // rect:{width:25,height:20,x:20,y:20}
            Object.entries(shape).forEach(([key,val])=>{
                //key = rect; val = {width:25,height:20,x:20,y:20}

                if(["circ","rect","ellip","line"].includes(key)){
                    let cVal = nVal = val
                    Object.keys(val).forEach(key1=>{ //width,height,x,y
                        if(hasWidthParam.includes(key1)){
                            Object.assign(nVal!,{[key1]:normalizeWidth(val[key1])})
                        } else if (hasHeightParam.includes(key)){
                            Object.assign(nVal,{[key1]:normalizeHeight(val[key])})
                        } else if (prefersSmallerSideParam.includes(key)){
                            Object.assign(nVal!,{[key1]:prevViewbox.width > prevViewbox.height ?
                                normalizeHeight(val[key]):normalizeWidth(val[key])})
                        }
                    })

                    key.includes("circ")?
                    Object.assign(nShape.circle!,nVal)
                    : key.includes("rect") ?
                    Object.assign(nShape.rect!,nVal)
                    : key.includes("ellip") ?
                    Object.assign(nShape.ellipse!,nVal)
                    : Object.assign(nShape.line!,nVal)



                } else if (["polyl","polyg"].includes(key)){
                    //key = rect; val = {width:25,height:20,x:20,y:20}
                    let cVal:{points:string} = nVal = {...val}
                    let pointsString = ""
                    Object.keys(cVal).forEach(key1=>{ //width,height,x,y
                        if(key1 == "points"){
                            cVal.points.split(" ").map(i=>i.split(",")).toString().split(",").forEach((i,pos)=>{
                                if((pos+1)%2){ pointsString += normalizeWidth(i) + ","
                                } else pointsString += normalizeHeight(i) + " "
                            })
                        }
                    })
                    // Object.assign(nVal,{["points"]:pointsString})
                    
                    key.includes("polyl") ? 
                    Object.assign(nShape.polyline!,{["points"]:pointsString})
                    : Object.assign(nShape.polygon!,{["points"]:pointsString})

                } else if (key == "path"){
                    //key = rect; val = {width:25,height:20,x:20,y:20}
                    let cVal:{d:string} = nVal = {...val}
                    Object.keys(cVal).forEach(key1=>{ //width,height,x,y
                        if(key1 == "d"){
                            // cVal.d //d

                            let isLetter = new RegExp(/[A-Za-z]/)
                            let isNum = new RegExp(/[0-9]/)
                            let nArr:string[] = []
                            let dArr = cVal.d.split("")
                            let cPos = 0
                            
                            dArr.forEach((i,pos)=>{
                                if(i == " "){
                                    cPos++
                                    // console.log("SPACE pos" +pos + ", cPos" + cPos)
                                    return
                                }
                                if(pos < cPos)return //skip
                                if(cPos > pos)throw new Error("WTF")
                                // console.log(dArr[pos],"pos" + pos)

                                if(isLetter.test(i)){
                                    nArr.push(i)
                                    cPos++
                                    // console.log("LETTER pos" +pos + ", cPos" + cPos)
                                    // console.log(i)
                                } else if (i =="-"){
                                    let val = i
                                    cPos++
                                    let hasDecimal = false

                                    while(isNum.test(dArr[cPos]) || dArr[cPos] =="."){
                                        if(isNum.test(dArr[cPos])){
                                            // console.log("NEGA++ pos" +pos + ", cPos" + cPos)
                                            val += dArr[cPos]
                                            cPos++
                                        } else if (dArr[cPos] =="." && hasDecimal){
                                            // console.log("NEGA ENDED pos" +pos + ", cPos" + cPos)
                                            nArr.push(val)
                                            return
                                        } else if(dArr[cPos] =="."){
                                            hasDecimal = true
                                            // console.log("NEGA++ pos" +pos + ", cPos" + cPos)
                                            val += dArr[cPos]
                                            cPos++
                                        }
                                    }
                                    nArr.push(val)
                                    // console.log("NEGA pos" +pos + ", cPos" + cPos)
                                    // console.log(val)
                                } else if (i =="."){
                                    let val = i // "."
                                    cPos++
                                    while(isNum.test(dArr[cPos])){
                                        // console.log("DECIMAL++ pos" +pos + ", cPos" + cPos)
                                        val += dArr[cPos]
                                        cPos++
                                    } 
                                    nArr.push(val)
                                    // console.log("DECIMAL pos" +pos + ", cPos" + cPos)
                                    // console.log(val)
                                } else if (isNum.test(i)){
                                    let val = i
                                    cPos++
                                    while(isNum.test(dArr[cPos]) || dArr[cPos] =="."){
                                        // console.log("NUMBER++ pos" +pos + ", cPos" + cPos)
                                        val += dArr[cPos]
                                        cPos++
                                    }
                                    nArr.push(val)
                                    // console.log("NUMBER pos" +pos + ", cPos" + cPos)
                                    // console.log(val)
                                }

                            })
                            console.log(nArr.join(" "))

                            let prevLPos = 0
                            let maxPos = 0
                            let d=""
                            let params = ""
                            nArr.forEach((i,pos)=>{
                                if(isLetter.test(i)){

                                    prevLPos = pos
                                    if (["H","h"].includes(i)){
                                        let x = normalizeWidth(nArr[pos+1])
                                        params = i + x
                                        maxPos = pos + 1
                                    } else if (["V","v"].includes(i)){
                                        let y = normalizeHeight(nArr[pos+1])
                                        params = i + y
                                        maxPos = pos + 1
                                    } else if(["M","L","T","m","l","t"].includes(i)){
                                        let x = normalizeWidth(nArr[pos+1])
                                        let y = normalizeHeight(nArr[pos+2])
                                        params = i + x + " " + y
                                        maxPos = pos + 2
                                    } else if(["S","Q","s","q"].includes(i)){
                                        let x2 = normalizeWidth(nArr[pos+1])
                                        let y2 = normalizeHeight(nArr[pos+2])
                                        let x = normalizeWidth(nArr[pos+3])
                                        let y = normalizeHeight(nArr[pos+4])
                                        params = i + x2 + " " + y2 + " " + x + " " + y
                                        maxPos = pos + 4
                                    } else if (["C","c"].includes(i)){
                                        let x2 = normalizeWidth(nArr[pos+1])
                                        let y2 = normalizeHeight(nArr[pos+2])
                                        let x1 = normalizeWidth(nArr[pos+3])
                                        let y1 = normalizeHeight(nArr[pos+4])
                                        let x = normalizeWidth(nArr[pos+5])
                                        let y = normalizeHeight(nArr[pos+6])
                                        params = i + x2 + " " + y2 + " " + x1 + " " + y1 + " " + x + " " + y
                                        maxPos = pos + 6
                                    } else if (["A","a"].includes(i)){
                                        let x2 = normalizeWidth(nArr[pos+1])
                                        let y2 = normalizeHeight(nArr[pos+2])
                                        let angle = nArr[pos+3]
                                        let largeArcFlag = nArr[pos+4]
                                        let sweepFlag = nArr[pos+5]
                                        let x = normalizeWidth(nArr[pos+6])
                                        let y = normalizeHeight(nArr[pos+7])
                                        params = i + x2 + " " + y2 + " " + angle + " " + largeArcFlag + " " + sweepFlag + " " + x + " " + y
                                        maxPos = pos + 7
                                    } else if (["Z","z"].includes(i)){
                                        maxPos = prevLPos = pos
                                        d = d + i + " "
                                        return
                                    }
                                    // console.log("pos"+pos + ", " +params)
                                    d = d + params + " "
                                } else if(isNum.test(i) && pos <= maxPos){ //skip used items
                                    // console.log("pos"+ pos +", skipped " + i)
                                } else { //duplicate command

                                    let l = nArr[prevLPos] //prev letter
                                    if (["H","h"].includes(l)){
                                        let x = normalizeWidth(nArr[pos])
                                        params = l + x
                                        maxPos = pos
                                    } else if (["V","v"].includes(l)){
                                        let y = normalizeHeight(nArr[pos])
                                        params = l + y
                                        maxPos = pos
                                    } else if(["M","L","T","m","l","t"].includes(l)){
                                        let x = normalizeWidth(nArr[pos])
                                        let y = normalizeHeight(nArr[pos+1])
                                        params = l + x + " " + y
                                        maxPos = pos
                                    } else if(["S","Q","s","q"].includes(l)){
                                        let x2 = normalizeWidth(nArr[pos])
                                        let y2 = normalizeHeight(nArr[pos+1])
                                        let x = normalizeWidth(nArr[pos+2])
                                        let y = normalizeHeight(nArr[pos+3])
                                        params = l + x2 + " " + y2 + " " + x + " " + y
                                        maxPos = pos + 3
                                    } else if (["C","c"].includes(l)){
                                        let x2 = normalizeWidth(nArr[pos])
                                        let y2 = normalizeHeight(nArr[pos+1])
                                        let x1 = normalizeWidth(nArr[pos+2])
                                        let y1 = normalizeHeight(nArr[pos+3])
                                        let x = normalizeWidth(nArr[pos+4])
                                        let y = normalizeHeight(nArr[pos+5])
                                        params = l + x2 + " " + y2 + " " + x1 + " " + y1 + " " + x + " " + y
                                        maxPos = pos + 5
                                    } else if (["A","a"].includes(l)){
                                        let x2 = normalizeWidth(nArr[pos])
                                        let y2 = normalizeHeight(nArr[pos+1])
                                        let angle = nArr[pos+2]
                                        let largeArcFlag = nArr[pos+3]
                                        let sweepFlag = nArr[pos+4]
                                        let x = normalizeWidth(nArr[pos+5])
                                        let y = normalizeHeight(nArr[pos+6])
                                        params = l + x2 + " " + y2 + " " + angle + " " + largeArcFlag + " " + sweepFlag + " " + x + " " + y
                                        maxPos = pos + 6
                                    }

                                    // console.log("pos"+ pos +", DUPLICATE " + params)
                                    d = d + params + " "
                                }

                                // M 12 3 a 9 9 0 0 1 4.1 17 H 18 a 1 1 0 0 1 .1 2 H 18 h -4 a 1 1 0 0 1 -1 -.9 V 21 v -4 a 1 1 0 0 1 2 -.1 v .1 1.3 A 7 7 0 0 0 12 5 a 7 7 0 0 0 -7 7 1 1 0 1 1 -2 0 9 9 0 0 1 9 -9 z m 0 6 a 3 3 0 1 1 0 6 3 3 0 1 1 0 -6 z m 0 2 a 1 1 0 1 0 0 2 1 1 0 1 0 0 -2 z
                                // M 12 3 a 9 9 0 0 1 4.1 17 H 18 a 1 1 0 0 1 .1 2 H 18 h -4 a 1 1 0 0 1 -1 -.9 V 21 v -4 a 1 1 0 0 1 2 -.1 v .1 1.3 A 7 7 0 0 0 12 5 a 7 7 0 0 0 -7 7 1 1 0 1 1 -2 0 9 9 0 0 1 9 -9 z m 0 6 a 3 3 0 1 1 0 6 3 3 0 1 1 0 -6 z m 0 2 a 1 1 0 1 0 0 2 1 1 0 1 0 0 -2 z 

                            })
                            Object.assign(nShape.path!,{["d"]:d})
                            // console.log(nShape.path!.d)


                            // Object.assign(request.groups[groupNum].shapes[shapeNum],{[key]:nVal})
                            
                            // console.log(d)

                            /* 
M 3 15 h .1 a 1 1 0 0 1 .9 9 v .1 v 4 h 4 h .1 a 1 1 0 0 1 0 2 H 8 H 3 h -.1 a 1 1 0 0 1 -.9 - 9 V 21 v -5 - .1 a 1 1 0 0 1 .9 - 9 H 3 z m 18 0 a 1 1 0 0 1 1 .9 v .1 5 a 1 1 0 0 1 -.9 1 H 21 h -5 a 1 1 0 0 1 -.1 -2 h .1 4 v -4 a 1 1 0 0 1 .9 -1 h .1 z M 8 2 a 1 1 0 0 1 .1 2 H 8 4 v 4 a 1 1 0 0 1 -.9 1 H 3 a 1 1 0 0 1 -1 -.9 V 8 3 a 1 1 0 0 1 .9 -1 H 3 h 5 z m 13 0 h .1 a 1 1 0 0 1 .9 9 V 3 v 5 .1 a 1 1 0 0 1 -.9 9 H 21 h - .1 a 1 1 0 0 1 -.9 - 9 V 8 4 h -4 - .1 a 1 1 0 0 1 0 -2 h .1 5 z
M 3 15 5 h .1 1 a 1 1 0 0 1 .9 9.9 9 v .1 1 4 h 4 .1 1 a 1 1 0 0 1 0 2 H 8 3 h -. .1 1 a 1 1 0 0 1 -. .9 9 -. .9 9 V 21 1 v -5 5 -. .1 1 a 1 1 0 0 1 .9 9 -. .9 9 H 3 z m 18 8 0 a 1 1 0 0 1 1 .9 9 v .1 1 5 a 1 1 0 0 1 -. .9 9 1 H 21 1 h -5 5 a 1 1 0 0 1 -. .1 1 -2 2 h .1 1 4 v -4 4 a 1 1 0 0 1 .9 9 -1 1 h .1 1 z M 8 2 a 1 1 0 0 1 .1 1 2 H 8 4 v 4 a 1 1 0 0 1 -. .9 9 1 H 3 a 1 1 0 0 1 -1 1 -. .9 9 V 8 3 a 1 1 0 0 1 .9 9 -1 1 H 3 h 5 z m 13 3 0 h .1 1 a 1 1 0 0 1 .9 9.9 9 V 3 v 5 .1 1 a 1 1 0 0 1 -. .9 9.9 9 H 21 1 h -. .1 1 a 1 1 0 0 1 -. .9 9 -. .9 9 V 8 4 h -4 4 -. .1 1 a 1 1 0 0 1 0 -2 2 h .1 1 5 z


*/
                        }
                    })
                }
            })
            
            Object.assign(request.groups[groupNum].shapes[shapeNum],nShape)
        })
    })
    console.log(request)
    return request
}

/* 
17
60
10
60
1070

2000


*/
/* 
use case
for pragrammatical adding of SVG

    import {nSvg,normalizeSvg} from "./svgGen.js"

    container.appendChild(nSvg(dataImage.path))
    normalizeSvg(dataImage.rotateRight)


    sampleSVG:{
        viewBox: "24 24", // max 4 num, missing nums will be replaced by 0s
        groups:[
            {
                shapes:[
                    {d:""},
                    styles:[{name:"",val:""}],
                    props:[{name:"",val:""}],
                    attributes:[{ name:"",val:""}]    
                    event:[{ name:"",val:""}]    
                }
                ],
                styles:[{name:"",val:""}],
                props:[{name:"",val:""}],
                attributes:[{ name:"",val:""}]  
                event:[{ name:"",val:""}]    
            }
        ],
        styles:[{name:"",val:""}],
        props:[{name:"",val:""}],
        attributes:[{ name:"",val:""}]  
        event:[{ name:"",val:""}]    
    },
*/
