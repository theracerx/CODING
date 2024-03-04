let addPEAS = (elem, obj) => {
    if (obj.styles) { //set svg styles
        obj.styles.forEach((style) => {
            elem.setAttributeNS(null, style.name, style.val);
        });
    }
    if (obj.props) {
        obj.props.forEach((prop) => {
            Object.assign(elem, { [prop.name]: prop.val });
        });
    }
    if (obj.attributes) {
        obj.attributes.forEach((attr) => {
            // console.log(attr)
            elem.setAttribute(attr.name, attr.val);
        });
    }
    if (obj.events) {
        obj.events.forEach((event) => {
            elem.addEventListener(event.name, event.val);
        });
    }
};
export function nSvg(request) {
    // ---------------------- SETUP SVG --------------
    let xmlns = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(xmlns, "svg");
    if (typeof request.viewBox == "string") {
        let length = request.viewBox.split(" ").length;
        if (length != 4) {
            if (length < 4) {
                while (4 > length) {
                    request.viewBox = "0 " + request.viewBox;
                    length++;
                }
            }
        }
    }
    svg.setAttributeNS(null, "viewBox", request.viewBox || "0 0 100 100");
    svg.setAttribute("xmlns", xmlns);
    // preserveAspectRatio?
    addPEAS(svg, request);
    // ---------------------- SETUP GROUPS --------------
    request.groups.forEach((group) => {
        let cGroup = document.createElementNS(xmlns, "g");
        addPEAS(cGroup, group);
        group.shapes.forEach((shape) => {
            let nShape;
            Object.entries(shape).forEach(([key, val]) => {
                // console.log(shape) //obj
                // console.log(key) //shape["key"] = "value"
                if (key == "type") {
                    if (val.includes("circ")) {
                        nShape = document.createElementNS(xmlns, "circle");
                        nShape.setAttributeNS(null, "r", shape.r);
                        nShape.setAttributeNS(null, "cx", shape.cx);
                        nShape.setAttributeNS(null, "cy", shape.cy);
                    }
                    else if (val.includes("rect")) {
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
                    }
                    else if (val.includes("ellip")) {
                        nShape = document.createElementNS(xmlns, "ellipse");
                        nShape.setAttributeNS(null, "cx", shape.cx);
                        nShape.setAttributeNS(null, "cy", shape.cy);
                        nShape.setAttributeNS(null, "rx", shape.rx);
                        nShape.setAttributeNS(null, "ry", shape.ry);
                    }
                    else if (val.includes("line")) {
                        nShape = document.createElementNS(xmlns, "line");
                        nShape.setAttributeNS(null, "x1", shape.x1);
                        nShape.setAttributeNS(null, "x2", shape.x2);
                        nShape.setAttributeNS(null, "y1", shape.y1);
                        nShape.setAttributeNS(null, "y2", shape.y2);
                    }
                    else if (val.includes("polyl")) {
                        nShape = document.createElementNS(xmlns, "polyline");
                        nShape.setAttributeNS(null, "points", shape.points);
                    }
                    else if (val.includes("polyg")) {
                        nShape = document.createElementNS(xmlns, "polygon");
                        nShape.setAttributeNS(null, "points", shape.points);
                    }
                }
                else if (key == "d") {
                    nShape = document.createElementNS(xmlns, "path");
                    nShape.setAttributeNS(null, "d", shape.d);
                }
                else if (key == "fill") {
                    nShape.setAttribute("fill", val);
                }
                else if (key == "stroke") {
                    nShape.setAttribute("stroke", val);
                }
            });
            addPEAS(nShape, shape);
            cGroup.appendChild(nShape);
        });
        svg.appendChild(cGroup);
    });
    return svg;
}
export function normalizeSvg(request) {
    // let nObj:svgTemplate = {...request!}
    let prevViewbox = {};
    if (request.viewBox) {
        let arr = request.viewBox.split(" ");
        if (arr.length >= 2) {
            let adfa = arr[2] ? arr[0] : 0;
            prevViewbox.x = arr[2] ? parseFloat(arr[0]) : 0;
            prevViewbox.y = arr[3] ? parseFloat(arr[1]) : 0;
            prevViewbox.width = arr[2] ? parseFloat(arr[2]) : parseFloat(arr[0]);
            prevViewbox.height = arr[3] ? parseFloat(arr[3]) : parseFloat(arr[1]);
        }
        else
            throw Error("viewBox must have 2 or 4 values e.g. '100 100' OR '0 0 100 100'");
        request.viewBox = "0 0 100 100";
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
    request.groups.forEach((group, groupNum) => {
        group.shapes.forEach((shape, shapeNum) => {
            let keyNames = Object.keys(shape);
            keyNames.forEach((key) => {
                // {type:"rect",width:"8",height:"8",x:"10",rx:"2"},
                // 
                let hasWidthParam = [
                    "x",
                    "x1",
                    "x2",
                    "rx",
                    "cx",
                    "width",
                ];
                let hasHeightParam = [
                    "y",
                    "y1",
                    "y2",
                    "ry",
                    "cy",
                    "height"
                ];
                let prefersSmallerSideParam = [
                    "r"
                ];
                let hasBothParams = [
                    // "r",
                    "d",
                    "points"
                ];
                /*
                FIND WAY TO ASSIGN NVAL TO REQUEST(obj)
                
                goal
                get value of shape.prop
                then modify shape.prop to accomodate the viewbox 0 0 100 100
                then reassign new shape.prop value back to the request
                then return request obj
                */
                let nPropVal;
                let prop = key;
                let propVal = shape[prop];
                if (typeof propVal == "string") {
                    let normalizeWidth = (x) => ((parseFloat(x) / prevViewbox.width) * 100).toFixed(2);
                    let normalizeHeight = (y) => ((parseFloat(y) / prevViewbox.height) * 100).toFixed(2);
                    // let normalizeHeight = (y:string)=>(y)
                    // let normalizeWidth = (x:string)=>(x)
                    if (hasBothParams.includes(prop)) {
                        if (prop == "d") {
                            let isLetter = new RegExp(/[A-Za-z]/);
                            let isNum = new RegExp(/[0-9]/);
                            let isNum2 = false;
                            let isNega = false;
                            let hasDecimal = false;
                            let nArr = [];
                            propVal.split("").forEach((i) => {
                                if (isLetter.test(i)) {
                                    isNega = hasDecimal = isNum2 = false;
                                    nArr.push(i);
                                }
                                else if (i == "-") {
                                    if (!isNega) {
                                        isNega = !isNega;
                                    }
                                    nArr.push(i);
                                }
                                else if (i == "." && !hasDecimal) {
                                    hasDecimal = !hasDecimal;
                                    if (!isNum2) {
                                        nArr.push(i);
                                    }
                                    else
                                        nArr[nArr.length - 1] = nArr[nArr.length - 1] + i;
                                }
                                else if (isNum.test(i)) {
                                    if ([hasDecimal, isNum2, isNega].includes(true)) {
                                        nArr[nArr.length - 1] = nArr[nArr.length - 1] + i;
                                    }
                                    else {
                                        isNum2 = !isNum2;
                                        nArr.push(i);
                                    }
                                }
                                else {
                                    // console.log("this item was discarded: " + i + " !")
                                    isNega = hasDecimal = isNum2 = false;
                                }
                            });
                            // console.log(nArr.join(" "))
                            let prevLPos = 0;
                            let maxPos = 0;
                            let d = "";
                            let params = "";
                            nArr.forEach((i, pos) => {
                                if (isLetter.test(i)) {
                                    prevLPos = pos;
                                    if (["H", "h"].includes(i)) {
                                        let x = normalizeWidth(nArr[pos + 1]);
                                        params = i + x;
                                        maxPos = pos + 1;
                                    }
                                    else if (["V", "v"].includes(i)) {
                                        let y = normalizeHeight(nArr[pos + 1]);
                                        params = i + y;
                                        maxPos = pos + 1;
                                    }
                                    else if (["M", "L", "T", "m", "l", "t"].includes(i)) {
                                        let x = normalizeWidth(nArr[pos + 1]);
                                        let y = normalizeHeight(nArr[pos + 2]);
                                        params = i + x + " " + y;
                                        maxPos = pos + 2;
                                    }
                                    else if (["S", "Q", "s", "q"].includes(i)) {
                                        let x2 = normalizeWidth(nArr[pos + 1]);
                                        let y2 = normalizeHeight(nArr[pos + 2]);
                                        let x = normalizeWidth(nArr[pos + 3]);
                                        let y = normalizeHeight(nArr[pos + 4]);
                                        params = i + x2 + " " + y2 + " " + x + " " + y;
                                        maxPos = pos + 4;
                                    }
                                    else if (["C", "c"].includes(i)) {
                                        let x2 = normalizeWidth(nArr[pos + 1]);
                                        let y2 = normalizeHeight(nArr[pos + 2]);
                                        let x1 = normalizeWidth(nArr[pos + 3]);
                                        let y1 = normalizeHeight(nArr[pos + 4]);
                                        let x = normalizeWidth(nArr[pos + 5]);
                                        let y = normalizeHeight(nArr[pos + 6]);
                                        params = i + x2 + " " + y2 + " " + x1 + " " + y1 + " " + x + " " + y;
                                        maxPos = pos + 6;
                                    }
                                    else if (["A", "a"].includes(i)) {
                                        let x2 = normalizeWidth(nArr[pos + 1]);
                                        let y2 = normalizeHeight(nArr[pos + 2]);
                                        let angle = nArr[pos + 3];
                                        let largeArcFlag = nArr[pos + 4];
                                        let sweepFlag = nArr[pos + 5];
                                        let x = normalizeWidth(nArr[pos + 6]);
                                        let y = normalizeHeight(nArr[pos + 7]);
                                        params = i + x2 + " " + y2 + " " + angle + " " + largeArcFlag + " " + sweepFlag + " " + x + " " + y;
                                        maxPos = pos + 7;
                                    }
                                    else if (["Z", "z"].includes(i)) {
                                        maxPos = prevLPos = pos;
                                        d = d + i + " ";
                                        return;
                                    }
                                    // console.log("pos"+pos + ", " +params)
                                    d = d + params + " ";
                                }
                                else if (isNum.test(i) && pos <= maxPos) { //skip used items
                                    // console.log("pos"+ pos +", skipped " + i)
                                }
                                else { //duplicate command
                                    let l = nArr[prevLPos]; //prev letter
                                    if (["H", "h"].includes(l)) {
                                        let x = normalizeWidth(nArr[pos]);
                                        params = l + x;
                                        maxPos = pos;
                                    }
                                    else if (["V", "v"].includes(l)) {
                                        let y = normalizeHeight(nArr[pos]);
                                        params = l + y;
                                        maxPos = pos;
                                    }
                                    else if (["M", "L", "T", "m", "l", "t"].includes(l)) {
                                        let x = normalizeWidth(nArr[pos]);
                                        let y = normalizeHeight(nArr[pos + 1]);
                                        params = l + x + " " + y;
                                        maxPos = pos;
                                    }
                                    else if (["S", "Q", "s", "q"].includes(l)) {
                                        let x2 = normalizeWidth(nArr[pos]);
                                        let y2 = normalizeHeight(nArr[pos + 1]);
                                        let x = normalizeWidth(nArr[pos + 2]);
                                        let y = normalizeHeight(nArr[pos + 3]);
                                        params = l + x2 + " " + y2 + " " + x + " " + y;
                                        maxPos = pos + 3;
                                    }
                                    else if (["C", "c"].includes(l)) {
                                        let x2 = normalizeWidth(nArr[pos]);
                                        let y2 = normalizeHeight(nArr[pos + 1]);
                                        let x1 = normalizeWidth(nArr[pos + 2]);
                                        let y1 = normalizeHeight(nArr[pos + 3]);
                                        let x = normalizeWidth(nArr[pos + 4]);
                                        let y = normalizeHeight(nArr[pos + 5]);
                                        params = l + x2 + " " + y2 + " " + x1 + " " + y1 + " " + x + " " + y;
                                        maxPos = pos + 5;
                                    }
                                    else if (["A", "a"].includes(l)) {
                                        let x2 = normalizeWidth(nArr[pos]);
                                        let y2 = normalizeHeight(nArr[pos + 1]);
                                        let angle = nArr[pos + 2];
                                        let largeArcFlag = nArr[pos + 3];
                                        let sweepFlag = nArr[pos + 4];
                                        let x = normalizeWidth(nArr[pos + 5]);
                                        let y = normalizeHeight(nArr[pos + 6]);
                                        params = l + x2 + " " + y2 + " " + angle + " " + largeArcFlag + " " + sweepFlag + " " + x + " " + y;
                                        maxPos = pos + 6;
                                    }
                                    // console.log("pos"+ pos +", DUPLICATE " + params)
                                    d = d + params + " ";
                                }
                                // M 12 3 a 9 9 0 0 1 4.1 17 H 18 a 1 1 0 0 1 .1 2 H 18 h -4 a 1 1 0 0 1 -1 -.9 V 21 v -4 a 1 1 0 0 1 2 -.1 v .1 1.3 A 7 7 0 0 0 12 5 a 7 7 0 0 0 -7 7 1 1 0 1 1 -2 0 9 9 0 0 1 9 -9 z m 0 6 a 3 3 0 1 1 0 6 3 3 0 1 1 0 -6 z m 0 2 a 1 1 0 1 0 0 2 1 1 0 1 0 0 -2 z
                                // M 12 3 a 9 9 0 0 1 4.1 17 H 18 a 1 1 0 0 1 .1 2 H 18 h -4 a 1 1 0 0 1 -1 -.9 V 21 v -4 a 1 1 0 0 1 2 -.1 v .1 1.3 A 7 7 0 0 0 12 5 a 7 7 0 0 0 -7 7 1 1 0 1 1 -2 0 9 9 0 0 1 9 -9 z m 0 6 a 3 3 0 1 1 0 6 3 3 0 1 1 0 -6 z m 0 2 a 1 1 0 1 0 0 2 1 1 0 1 0 0 -2 z 
                            });
                            nPropVal = d;
                            // console.log(d)
                        }
                        else if (prop = "points") {
                            propVal.split(" ").map(i => i.split(",")).toString().split(",").forEach((i, pos) => {
                                if ((pos + 1) % 2) {
                                    nPropVal = normalizeWidth(i) + ",";
                                }
                                else
                                    nPropVal = normalizeHeight(i) + " ";
                            });
                        }
                    }
                }
                else if (typeof propVal == "number") {
                    let normalizeWidth = (x) => ((x / prevViewbox.width) * 100).toFixed(2);
                    let normalizeHeight = (y) => ((y / prevViewbox.height) * 100).toFixed(2);
                    // let normalizeHeight = (y:string)=>(y)
                    // let normalizeWidth = (x:string)=>(x)
                    if (hasWidthParam.includes(prop)) {
                        nPropVal = normalizeWidth(propVal);
                    }
                    else if (hasHeightParam.includes(prop)) {
                        nPropVal = normalizeHeight(propVal);
                    }
                    else if (prefersSmallerSideParam.includes(prop)) {
                        nPropVal = prevViewbox.width > prevViewbox.height ?
                            normalizeHeight(propVal) : normalizeWidth(propVal);
                    }
                }
                // console.log(nPropVal)
                Object.assign(request.groups[groupNum].shapes[shapeNum], { [prop]: nPropVal });
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
            });
        });
    });
    // console.log(request)
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
//# sourceMappingURL=svgGen.js.map