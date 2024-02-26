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
    interface mediaTemplate{
        type?:string,
        src:string,
        sub?:string,
        cls:string,
    }

    interface svgTemplate{
        viewBox?:string,
        styles?:svgStyle[]
        groups:svgPaths[]
    }
    interface svgPaths{
        shapes:svgShape[]
        styles?:svgStyle[]
    }
    interface svgShape { 
        //svg.setAttributeNS only allows "string" as input :(
        type?:string,
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
        fill?:string,
        stroke?:string,
        styles?:svgStyle[]
    }
    interface svgStyle{
        name:string,
        val:string
    }
}
export function nSvg(request:svgTemplate){ 
    // ---------------------- SETUP SVG --------------
    let xmlns = "http://www.w3.org/2000/svg"
    let svg = document.createElementNS(xmlns, "svg");
    
    if(typeof request.viewBox == "string"){
        let length = request.viewBox.split(" ").length
        if(length != 4){
            if(length == 2 ){
                request.viewBox = "0 0 " + request.viewBox
            }
        }
    }

    svg.setAttributeNS(null, "viewBox", request.viewBox || "0 0 100 100");
    svg.setAttribute("xmlns", xmlns);
    // preserveAspectRatio?

    if (typeof request.styles != "undefined") { //set svg styles
        request.styles.forEach((style) => {
            svg.setAttributeNS(null,style.name,style.val)
        });
    }

    // ---------------------- SETUP GROUPS --------------
    request.groups.forEach((group) => {
        let cGroup = document.createElementNS(xmlns, "g");

        if (typeof group.styles != "undefined") { //set group styles
            group.styles.forEach((style) => {
                cGroup.setAttributeNS(null,style.name,style.val)
            });
        }
        group.shapes.forEach((shape,i) => { //set shapes
            let nShape:any;

            /*
             Object.keys(shape).forEach((key)=>{
                //converts any type `number` to `string` to allow setAttribute
                let cVal = shape[key as keyof typeof shape]
                
                if(typeof cVal == "number"){
                    Object.assign(shape,{[key]:cVal.toString()})
                }
            }) 
            */

            if (shape.type == "circle") {
                nShape = document.createElementNS(xmlns, "circle");
                nShape.setAttributeNS(null, "r", shape.r!);
                nShape.setAttributeNS(null, "cx", shape.cx!);
                nShape.setAttributeNS(null, "cy", shape.cy!);
            }
            else if (shape.type == "rect") {
                nShape = document.createElementNS(xmlns, "rect");
                nShape.setAttributeNS(null, "width", shape.width || "");
                nShape.setAttributeNS(null, "height", shape.height || "");
                alert("fix condition for rect")
                if (typeof shape.rx != "undefined") {
                    nShape.setAttributeNS(null, "rx", shape.rx || "");
                }
                if (typeof shape.ry != "undefined") {
                    nShape.setAttributeNS(null, "ry", shape.ry || "");
                }
                if (typeof shape.x != "undefined") {
                    nShape.setAttributeNS(null, "x", shape.x || "");
                }
                if (typeof shape.y != "undefined") {
                    nShape.setAttributeNS(null, "y", shape.y || "");
                }
            }
            else if (shape.type == "ellipse") {
                nShape = document.createElementNS(xmlns, "ellipse");
                nShape.setAttributeNS(null, "cx", shape.cx!);
                nShape.setAttributeNS(null, "cy", shape.cy!);
                nShape.setAttributeNS(null, "rx", shape.rx!);
                nShape.setAttributeNS(null, "ry", shape.ry!);
            }
            else if (shape.type == "line") {
                nShape = document.createElementNS(xmlns, "line");
                nShape.setAttributeNS(null, "x1", shape.x1!);
                nShape.setAttributeNS(null, "x2", shape.x2!);
                nShape.setAttributeNS(null, "y1", shape.y1!);
                nShape.setAttributeNS(null, "y2", shape.y2!);
            }
            else if (shape.type == "polyline") {
                nShape = document.createElementNS(xmlns, "polyline");
                nShape.setAttributeNS(null, "points", shape.points!);
            }
            else if (shape.type == "polygon") {
                nShape = document.createElementNS(xmlns, "polygon");
                nShape.setAttributeNS(null, "points", shape.points!);
            }
            else {
                nShape = document.createElementNS(xmlns, "path");
                nShape.setAttributeNS(null, "d", shape.d!);
            }
            //colors
            if (typeof shape.fill != "undefined") {
                nShape.setAttribute("fill", shape.fill);
            }
            if (typeof shape.stroke != "undefined") {
                nShape.setAttribute("stroke", shape.stroke);
            }
            if (typeof shape.styles != "undefined") { //set nShape styles
                shape.styles.forEach((style) => {
                    console.log(style)
                    // nShape.setAttributeNS(null,style.name,style.val)
                    nShape.style.setProperty(style.name,style.val)

                });
            }
            // shape.attribute
            // shape.attributeNS
            // shape.props
            alert("find way to add prop attr attrNS styles to elem")


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
                    
                    // let propVal = parseFloat(propVal)

                    if(hasWidthParam.includes(prop)){ nPropVal = normalizeWidth(propVal)
                    } else if (hasHeightParam.includes(prop)){nPropVal = normalizeHeight(propVal)
                    } else if (prefersSmallerSideParam.includes(prop)){
                        nPropVal = prevViewbox.width > prevViewbox.height ?
                            normalizeHeight(propVal):normalizeWidth(propVal)
                    } else if (hasBothParams.includes(prop)){

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
                            nPropVal = d
                            console.log(d)

                        }else if(prop == "x"){ // old `d` method
                            let d=""

                            // alert("do arr.split('') and update and segregate manually")
                            // console.log("METHOD INEFFECTIVE")

                            var regex = /[+-.]?[+-.]?\d+(\.\d+)?/g;
                            var tempCoords = propVal.match(regex)
                            // console.log(coords);
                            //fix -.2.5

                            let coords = [...tempCoords!]
                            tempCoords!.forEach((x,i)=>{
                                if(x.match(/\./g)?.length == 2){
                                    let pair = x.split(".")
                                    let coord2 = "." + pair[pair.length-1]
                                    pair.pop()
                                    let coord1 = pair.join(".")

                                    let offset = coords.length - tempCoords!.length
                                    coords.splice(i + offset,1,coord1)
                                    coords.splice(i + 1 + offset,0,coord2)
                                }
                            })
                            
                            var regex2 = /[a-z]/gi;
                            var letters = propVal.match(regex2)
                            // var letters = propVal.match(regex2)?.map(l=>l.toUpperCase())
                            console.log(letters);
                            
                            let i = 0 //for coords index
                            letters?.forEach((letter)=>{
                                let params= ""

                                if (["H","h"].includes(letter)){
                                    let x = normalizeWidth(coords![i++])
                                    params = " " + x
                                } else if (["V","v"].includes(letter)){
                                    let y = normalizeHeight(coords![i++])
                                    params = " " + y
                                } else if(["M","L","T","m","l","t"].includes(letter)){
                                    let x = normalizeWidth(coords![i++])
                                    let y = normalizeHeight(coords![i++])
                                    params = " " + x + " " + y
                                } else if(["S","Q","s","q"].includes(letter)){
                                    let x2 = normalizeWidth(coords![i++])
                                    let y2 = normalizeHeight(coords![i++])
                                    let x = normalizeWidth(coords![i++])
                                    let y = normalizeHeight(coords![i++])
                                    params = " " + x2 + " " + y2 + " " + x + " " + y
                                } else if (["C","c"].includes(letter)){
                                    let x2 = normalizeWidth(coords![i++])
                                    let y2 = normalizeHeight(coords![i++])
                                    let x1 = normalizeWidth(coords![i++])
                                    let y1 = normalizeHeight(coords![i++])
                                    let x = normalizeWidth(coords![i++])
                                    let y = normalizeHeight(coords![i++])
                                    params = " " + x2 + " " + y2 + " " + x1 + " " + y1 + " " + x + " " + y
                                } else if (["A","a"].includes(letter)){
                                    let x2 = normalizeWidth(coords![i++])
                                    let y2 = normalizeHeight(coords![i++])
                                    let angle = coords![i++]
                                    let largeArcFlag = coords![i++]
                                    let sweepFlag = coords![i++]
                                    let x = normalizeWidth(coords![i++])
                                    let y = normalizeHeight(coords![i++])
                                    params = " " + x2 + " " + y2 + " " + angle + " " + largeArcFlag + " " + sweepFlag + " " + x + " " + y
                                } else if (["Z","z"].includes(letter)){
                                    d = d! + "z"
                                    return
                                }

                                d = d! + " " + letter + params
                            })

                            nPropVal = d
                            /* 
                            M x,y (start)...
                            L x,y...
                            H x...
                            V y...
                            Z (end)...
                            C x1,y1 x2,y2 x,y...
                            S x2,y2 x,y...
                            Q x1,y2 x,y...
                            T x,y...
                            A x,y 0 0 0 x,y...
    


                             A 30 50 0 0 1 162.55 162.45
                             A 1  2  3 4 5 6      7
                             A rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, dx, dy
                            */
                            //  nPropVal = "final glued array"
                        } else if (prop = "points"){
                            propVal.split(" ").map(i=>i.split(",")).toString().split(",").forEach((i,pos)=>{
                                if((pos+1)%2){ nPropVal = normalizeWidth(i) + ","
                                } else nPropVal = normalizeHeight(i) + " "
                            })
                        }
                        


                        // alert("TO DO: make adjustment to accomodat viewbox 0 0 100 100")
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

    console.log(request)
}


