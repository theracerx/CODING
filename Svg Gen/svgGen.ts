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
        [key:string]:any
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
        [key:string]:any,
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
        type?:string,
        d?:string,
        points?:string,
        x1?:number,
        x2?:number,
        y1?:number,
        y2?:number,
        rx?:number,
        ry?:number,
        cx?:number,
        cy?:number,
        r?:number,
        x?:number,
        y?:number,
        width?:number,
        height?:number,
        blob?:svgBlob,
        fill?:string,
        stroke?:string,
        styles?:object
        props?:object
        attributes?:object
        events?:object
    }
}


let addPEAS = (elem:any, obj:svgShape)=>{
    if (obj.styles) { //set svg styles
        Object.entries(obj.styles).forEach(([key,val])=>{
            elem.setAttribute(key,val)
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
    c:number //complexity 1-4
    rnd:boolean
})=>{
    let isRNG = ()=>{
        if(obj.rnd){
            return Math.random() * (1 - 0.25) + .25
        } else return 1
    }
    let getXYCoord =(obj:{
        r:number
        deg:number
        x:number
        y:number
    })=>{
        let rng = obj.r * isRNG()!
        // let rng2 = obj.deg * (Math.random() * (1 - 0.9875) + 0.975)
        // let x = Math.round((obj.x + ((rng) *Math.sin((rng2 * Math.PI)/180)))*100)/100
        // let y = Math.round((obj.y - ((rng) *Math.cos((rng2 * Math.PI)/180)))*100)/100
        let x = Math.round((obj.x + ((rng) *Math.sin((obj.deg * Math.PI)/180)))*100)/100
        let y = Math.round((obj.y - ((rng) *Math.cos((obj.deg * Math.PI)/180)))*100)/100
        
        // console.log(rng1,rng2,"total:",(rng1+rng2).toFixed(2))
        return {x,y,deg:obj.deg,rng}
    }
    let getR = (obj:{ //get proper radius for proper Circle
        c:number
        r:number
    })=>{
        switch(obj.c){
            case 1: return obj.r *.77
            case 2: return obj.r *.55
            case 3: return obj.r *.4
            case 4: return obj.r *.33
        }
    }
    let getA1CoordDeg =(obj:{ //get proper degree for anchor coordinate to create a circle
        c:number
        prevDeg:number
        deg:number
    })=>{
        switch(obj.c){
            case 1: return obj.prevDeg + (obj.deg - obj.prevDeg)*.75
            case 2: return obj.prevDeg + (obj.deg - obj.prevDeg)*1
            case 3: return obj.prevDeg + (obj.deg - obj.prevDeg)*1.2
            case 4: return obj.prevDeg + (obj.deg - obj.prevDeg)*1.475
        }
    }
    let getA2CoordDeg =(obj:{ //get proper degree for anchor coordinate to create a circle
        c:number
        prevDeg:number
        deg:number
    })=>{
        switch(obj.c){
            case 1: return obj.prevDeg + (obj.deg - obj.prevDeg)*.25
            case 2: return obj.prevDeg + (obj.deg - obj.prevDeg)*0
            case 3: return obj.prevDeg + (obj.deg - obj.prevDeg)*-.2
            case 4: return obj.prevDeg + (obj.deg - obj.prevDeg)*-.475
        }
    }

    let startPoint = {x:obj.x, y:Math.round((obj.y - (obj.r*isRNG()))*100)/100}
    // console.log(startPoint)
    let d= "M " + startPoint.x + "," + startPoint.y + " "
    if([1,2,3,4].includes(obj.c)){
        //get number of circle points depending on complexity (min:3 max:6)
        let points = obj.c == 1 ? 3 : obj.c == 2 ? 4 : obj.c == 3 ? 5 : 6
        let space = 360/points
        let pos = 0
        let prevPoint = startPoint
        let prevDeg = 0

        while(pos != points){
            let deg = space * (pos + 1)
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
            
            let anchorRadius = getR({c:obj.c,r:obj.r})
            let a1Deg = getA1CoordDeg({c:obj.c,deg:deg,prevDeg:prevDeg})!
            let a2Deg = getA2CoordDeg({c:obj.c,deg:deg,prevDeg:prevDeg})!

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
            if(points == (pos + 1)){c = c + "z"}
            d = d + c + " "
            
            // console.log(c)

            prevPoint = cPoint //transfer coords of currentPoint
            prevDeg = deg //transfer deg of currentPoint
            pos++
        }
        
        // console.log(d)
        return d
    } else throw Error ("Blob complexity can only be 1-4")
}
export function nSvg(request:svgTemplate){ 
    // ---------------------- SETUP SVG --------------
    let xmlns = "http://www.w3.org/2000/svg"
    let svg = document.createElementNS(xmlns, "svg");
    
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
            let nShape:any;

            Object.entries(shape).forEach(([key,val])=>{
                // console.log(shape) //obj
                // console.log(key) //shape["key"] = "value"
                if(key == "type"){
                    if (val.includes("circ")) {
                        nShape = document.createElementNS(xmlns, "circle");
                        nShape.setAttributeNS(null, "r", shape.r!);
                        nShape.setAttributeNS(null, "cx", shape.cx!);
                        nShape.setAttributeNS(null, "cy", shape.cy!);
                    } else if (val.includes("rect")) {
                        nShape = document.createElementNS(xmlns, "rect");
                        nShape.setAttributeNS(null, "width", shape.width || "");
                        nShape.setAttributeNS(null, "height", shape.height || "");

                        if (shape.rx) {
                            nShape.setAttributeNS(null, "rx", shape.rx || "");
                        }
                        if (shape.ry) {
                            nShape.setAttributeNS(null, "ry", shape.ry || "");
                        }
                        if (shape.x) {
                            nShape.setAttributeNS(null, "x", shape.x || "");
                        }
                        if (shape.y) {
                            nShape.setAttributeNS(null, "y", shape.y || "");
                        }

                    } else if (val.includes("ellip")) {
                        nShape = document.createElementNS(xmlns, "ellipse");
                        nShape.setAttributeNS(null, "cx", shape.cx!);
                        nShape.setAttributeNS(null, "cy", shape.cy!);
                        nShape.setAttributeNS(null, "rx", shape.rx!);
                        nShape.setAttributeNS(null, "ry", shape.ry!);
                    } else if (val.includes("line")) {
                        nShape = document.createElementNS(xmlns, "line");
                        nShape.setAttributeNS(null, "x1", shape.x1!);
                        nShape.setAttributeNS(null, "x2", shape.x2!);
                        nShape.setAttributeNS(null, "y1", shape.y1!);
                        nShape.setAttributeNS(null, "y2", shape.y2!);
                    } else if (val.includes("polyl")) {
                        nShape = document.createElementNS(xmlns, "polyline");
                        nShape.setAttributeNS(null, "points", shape.points!);
                    } else if (val.includes("polyg")) {
                        nShape = document.createElementNS(xmlns, "polygon");
                        nShape.setAttributeNS(null, "points", shape.points!);
                    } else if (val.includes("blob")) {
                        nShape = document.createElementNS(xmlns, "path");
                        nShape.setAttribute("type", val);
                        nShape.setAttributeNS(null, "d", blobGen(shape.blob!));
                        Object.assign(nShape,{ //store blob request parameters
                            config:shape.blob!,
                            update:function(){
                                nShape.setAttribute("d",blobGen(this.config!) )
                            }
                        })
                    }
                } else if (key == "d"){
                    nShape = document.createElementNS(xmlns, "path");
                } else if (key == "fill"){
                    nShape.setAttribute("fill", val);
                } else if (key == "stroke"){
                    nShape.setAttribute("stroke", val);
                } 
            })
            addPEAS(nShape,shape)

            cGroup.appendChild(nShape);
        });
        svg.appendChild(cGroup);
    });

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
                    {type:"rect",width:"8",height:"8",rx:"2"},
                    {type:"rect",width:"8",height:"8",x:"10",rx:"2"},
                    {type:"rect",width:"8",height:"8",x:"10",y:"10",rx:"2"},
                    {type:"rect",width:"8",height:"8",y:"10",rx:"2"},
                ]
            }
        ]
    */
    /* group looks like this: obj
        {
            shape:[
                {type:"rect",width:"8",height:"8",rx:"2"},
                {type:"rect",width:"8",height:"8",x:"10",rx:"2"},
                {type:"rect",width:"8",height:"8",x:"10",y:"10",rx:"2"},
                {type:"rect",width:"8",height:"8",y:"10",rx:"2"},
            ]
        }
    */
    /* shapes look like this: arr
        [
            {type:"rect",width:"8",height:"8",rx:"2"},
            {type:"rect",width:"8",height:"8",x:"10",rx:"2"},
            {type:"rect",width:"8",height:"8",x:"10",y:"10",rx:"2"},
            {type:"rect",width:"8",height:"8",y:"10",rx:"2"},
        ]
     */
    /* shape look like this: obj
        {type:"rect",width:"8",height:"8",rx:"2"},
    */
    
    request.groups.forEach((group,groupNum) => {
        group.shapes.forEach((shape,shapeNum) => { //set shapes

            let keyNames = Object.keys(shape)
            
            keyNames.forEach((key: string)=>{
                // {type:"rect",width:"8",height:"8",x:"10",rx:"2"},
                // 

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

                /* 
                FIND WAY TO ASSIGN NVAL TO REQUEST(obj)
                
                goal
                get value of shape.prop
                then modify shape.prop to accomodate the viewbox 0 0 100 100
                then reassign new shape.prop value back to the request 
                then return request obj
                */
                let nPropVal
                let prop = key as keyof typeof shape
                let propVal = shape[prop]

                
                if(typeof propVal == "string"){

                    let normalizeWidth = (x:string)=>((parseFloat(x) / prevViewbox.width) * 100).toFixed(2)
                    let normalizeHeight = (y:string)=>((parseFloat(y) / prevViewbox.height) * 100).toFixed(2)
                    // let normalizeHeight = (y:string)=>(y)
                    // let normalizeWidth = (x:string)=>(x)
                    
                    
                    if (hasBothParams.includes(prop)){

                        if(prop == "d"){

                            let isLetter = new RegExp(/[A-Za-z]/)
                            let isNum = new RegExp(/[0-9]/)
                            let isNum2 = false
                            let isNega = false
                            let hasDecimal = false
                            let nArr:string[] = []
                            propVal.split("").forEach((i)=>{
                                if(isLetter.test(i)){
                                    isNega = hasDecimal = isNum2 = false
                                    nArr.push(i)
                                } else if (i=="-"){
                                    if(!isNega){isNega = !isNega}
                                    nArr.push(i)
                                } else if (i=="." && !hasDecimal ){
                                    hasDecimal = !hasDecimal
                                    if(!isNum2){nArr.push(i)}
                                    else  nArr[nArr.length-1] = nArr[nArr.length-1] + i
                                } else if (isNum.test(i)){
                                    if([hasDecimal,isNum2,isNega].includes(true)){
                                        nArr[nArr.length-1] = nArr[nArr.length-1] + i
                                    } else {
                                        isNum2 = !isNum2
                                        nArr.push(i)
                                    }
                                } else {
                                    // console.log("this item was discarded: " + i + " !")
                                    isNega = hasDecimal = isNum2 = false
                                }
                            })
                            // console.log(nArr.join(" "))

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
                            nPropVal = d
                            // console.log(d)

                        }
                        else if (prop = "points"){
                            propVal.split(" ").map(i=>i.split(",")).toString().split(",").forEach((i,pos)=>{
                                if((pos+1)%2){ nPropVal = normalizeWidth(i) + ","
                                } else nPropVal = normalizeHeight(i) + " "
                            })
                        }

                    }
                } else if (typeof propVal == "number"){
                    let normalizeWidth = (x:number)=>((x / prevViewbox.width) * 100).toFixed(2)
                    let normalizeHeight = (y:number)=>((y / prevViewbox.height) * 100).toFixed(2)
                    // let normalizeHeight = (y:string)=>(y)
                    // let normalizeWidth = (x:string)=>(x)

                    if(hasWidthParam.includes(prop)){ nPropVal = normalizeWidth(propVal)
                    } else if (hasHeightParam.includes(prop)){nPropVal = normalizeHeight(propVal)
                    } else if (prefersSmallerSideParam.includes(prop)){
                        nPropVal = prevViewbox.width > prevViewbox.height ?
                            normalizeHeight(propVal):normalizeWidth(propVal)
                    }
                }
           
                // console.log(nPropVal)
                Object.assign(request.groups[groupNum].shapes[shapeNum],{[prop]:nPropVal})

                /* 
                d?:string,
                points?:string,
                x1?:string,
                x2?:string,
                y1?:string,
                y2?:string,
                rx?:string,
                ry?:string,
                cx?:string,
                cy?:string,
                r?:string,
                x?:string,
                y?:string,
                width?:string,
                height?:string,
                */
            })
        
        })
    })

    // console.log(request)
}
export function genBlob234(obj:{
    x:number //centerX
    y:number //centerY
    r:number //radius
    c:number //complexity 1-4
    rnd:boolean
}){
    console.log("TO DO: TRY isPointInStroke for collision detection")
    console.log("TO DO: TRY isPointInStroke if stroke is none")
    console.log("TO DO: do viewbox as numbers []1,2,...]")
    /* 
    sampleSVG:{
        viewBox: "24 24", // max 4 num, missing nums will be replaced by 0s
        groups:[
            {
                blobs:[
                    {
                        x: number
                        y: number
                        r: number
                        c: number
                        rnd: boolean
                        styles:[{name:"",val:""}],
                        props:[{name:"",val:""}],
                        attributes:[{ name:"",val:""}]    
                        event:[{ name:"",val:""}]   
                    }
                ]
                shapes:[
                    {
                        d:"",
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
    
    let xmlns = "http://www.w3.org/2000/svg"
    let svg = document.createElementNS(xmlns, "svg");

    svg.setAttributeNS(null, "viewBox", "0 0 100 100");
    svg.setAttribute("xmlns", xmlns);
    svg.setAttribute("stroke", "black");
    svg.setAttribute("fill", "none");

    //gen path
    let nShape = document.createElementNS(xmlns, "path");
    nShape.setAttribute("stroke","white")
    nShape.setAttribute("fill","white")
    Object.assign(nShape,{
        config:obj,
        update:function(){
            nShape.setAttribute("d",blobGen(this.config!) )
        }
    })


    //for troubleshooting
    /* let guide2 = document.createElementNS(xmlns, "path");
    let guidePath = ""
    guide2.setAttribute("stroke","rgba(144,144,144,.5)")
    guide2.setAttribute("stroke","none")

    let guide = document.createElementNS(xmlns, "circle");
    guide.setAttribute("r","25")
    guide.setAttribute("cx","50")
    guide.setAttribute("cy","50") */

    /* GUIDE
        start first point between center and shortest side
        to check if it is a vertex of a circ do x^2 + y^2 = r^2
        to check if vertex complies its circ do (x-h)^2 + (y-k)^2 = r^2 (if origin is not 0,0)
        x = rSin(deg) , y = rCos(deg)
        get coordinates by using origin, angle and radius
        x= r*Math.sin((deg * Math.PI)/180) 
        y= r*Math.cos((deg * Math.PI)/180)

        let start = "M 50,50 L 50,25z"
        let p1 = "M 50,50 L 71.65,62.50z"
        let p2 = "M 50,50 L 28.35,62.50z"
        let p3 = "";
    */
    let blobGen =(obj:{
        x:number //centerX
        y:number //centerY
        r:number //radius
        c:number //complexity 1-4
        rnd:boolean
    })=>{
        let isRNG = ()=>{
            if(obj.rnd){
                return Math.random() * (1 - 0.25) + .25
            } else return 1
        }
        let getXYCoord =(obj:{
            r:number
            deg:number
            x:number
            y:number
        })=>{
            let rng = obj.r * isRNG()!
            // let rng2 = obj.deg * (Math.random() * (1 - 0.9875) + 0.975)
            // let x = Math.round((obj.x + ((rng) *Math.sin((rng2 * Math.PI)/180)))*100)/100
            // let y = Math.round((obj.y - ((rng) *Math.cos((rng2 * Math.PI)/180)))*100)/100
            let x = Math.round((obj.x + ((rng) *Math.sin((obj.deg * Math.PI)/180)))*100)/100
            let y = Math.round((obj.y - ((rng) *Math.cos((obj.deg * Math.PI)/180)))*100)/100
            
            // console.log(rng1,rng2,"total:",(rng1+rng2).toFixed(2))
            return {x,y,deg:obj.deg,rng}
        }
        let getR = (obj:{ //get proper radius for proper Circle
            c:number
            r:number
        })=>{
            switch(obj.c){
                case 1: return obj.r *.77
                case 2: return obj.r *.55
                case 3: return obj.r *.4
                case 4: return obj.r *.33
            }
        }
        let getA1CoordDeg =(obj:{ //get proper degree for anchor coordinate to create a circle
            c:number
            prevDeg:number
            deg:number
        })=>{
            switch(obj.c){
                case 1: return obj.prevDeg + (obj.deg - obj.prevDeg)*.75
                case 2: return obj.prevDeg + (obj.deg - obj.prevDeg)*1
                case 3: return obj.prevDeg + (obj.deg - obj.prevDeg)*1.2
                case 4: return obj.prevDeg + (obj.deg - obj.prevDeg)*1.475
            }
        }
        let getA2CoordDeg =(obj:{ //get proper degree for anchor coordinate to create a circle
            c:number
            prevDeg:number
            deg:number
        })=>{
            switch(obj.c){
                case 1: return obj.prevDeg + (obj.deg - obj.prevDeg)*.25
                case 2: return obj.prevDeg + (obj.deg - obj.prevDeg)*0
                case 3: return obj.prevDeg + (obj.deg - obj.prevDeg)*-.2
                case 4: return obj.prevDeg + (obj.deg - obj.prevDeg)*-.475
            }
        }

        let startPoint = {x:obj.x, y:obj.y - (obj.r*isRNG())}
        // console.log(startPoint)
        let d= "M " + startPoint.x + "," + startPoint.y + " "
        if([1,2,3,4].includes(obj.c)){
            //get number of circle points depending on complexity (min:3 max:6)
            let points = obj.c == 1 ? 3 : obj.c == 2 ? 4 : obj.c == 3 ? 5 : 6
            let space = 360/points
            let pos = 0
            let prevPoint = startPoint
            let prevDeg = 0

            while(pos != points){
                let deg = space * (pos + 1)
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
                
                let anchorRadius = getR({c:obj.c,r:obj.r})
                let a1Deg = getA1CoordDeg({c:obj.c,deg:deg,prevDeg:prevDeg})!
                let a2Deg = getA2CoordDeg({c:obj.c,deg:deg,prevDeg:prevDeg})!

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
                if(points == (pos + 1)){c = c + "z"}
                d = d + c + " "
                
                // console.log(c)

                prevPoint = cPoint //transfer coords of currentPoint
                prevDeg = deg //transfer deg of currentPoint
                pos++
            }
            
            // console.log(d)
            return d
        } else throw Error ("Blob complexity can only be 1-4")
    }
    // let d = blobGen({r:25,x:50,y:50,c:1,rnd:true})
    // let d = blobGen({r:25,x:50,y:50,c:1,rnd:false})
    // let d = blobGen({r:25,x:50,y:50,c:2,rnd:true})
    // let d = blobGen({r:25,x:50,y:50,c:2,rnd:false})
    // let d = blobGen({r:25,x:50,y:50,c:3,rnd:false})
    // let d = blobGen({r:25,x:50,y:50,c:4,rnd:true})
    // let d = blobGen({r:25,x:50,y:50,c:4,rnd:false})
    

    nShape.setAttributeNS(null, "d", blobGen(obj));
    svg.appendChild(nShape)

    //for troubleshooting
    // guide2.setAttributeNS(null, "d", guidePath);
    // svg.appendChild(guide)
    // svg.appendChild(guide2)
    return svg
}

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
