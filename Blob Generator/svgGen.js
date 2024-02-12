export function nSvg(request) {
    // ---------------------- SETUP SVG --------------
    let xmlns = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(xmlns, "svg");
    svg.setAttributeNS(null, "viewBox", request.viewBox || "0 0 100 100");
    svg.setAttributeNS(null, "xmlns", xmlns);
    // preserveAspectRatio?
    if (typeof request.styles != "undefined") { //set svg styles
        request.styles.forEach((style) => {
            svg.setAttributeNS(null, style.name, style.val);
        });
    }
    // ---------------------- SETUP GROUPS --------------
    request.groups.forEach((group) => {
        let cGroup = document.createElementNS(xmlns, "g");
        if (typeof group.styles != "undefined") { //set group styles
            group.styles.forEach((style) => {
                cGroup.setAttributeNS(null, style.name, style.val);
            });
        }
        group.shapes.forEach((shape) => {
            let nShape;
            if (shape.type == "circle") {
                nShape = document.createElementNS(xmlns, "circle");
                nShape.setAttributeNS(null, "r", shape.r);
                nShape.setAttributeNS(null, "cx", shape.cx);
                nShape.setAttributeNS(null, "cy", shape.cy);
            }
            else if (shape.type == "rect") {
                nShape = document.createElementNS(xmlns, "rect");
                nShape.setAttributeNS(null, "width", shape.width || "");
                nShape.setAttributeNS(null, "height", shape.height || "");
                alert("fix condition for rect");
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
                nShape.setAttributeNS(null, "cx", shape.cx);
                nShape.setAttributeNS(null, "cy", shape.cy);
                nShape.setAttributeNS(null, "rx", shape.rx);
                nShape.setAttributeNS(null, "ry", shape.ry);
            }
            else if (shape.type == "line") {
                nShape = document.createElementNS(xmlns, "line");
                nShape.setAttributeNS(null, "x1", shape.x1);
                nShape.setAttributeNS(null, "x2", shape.x2);
                nShape.setAttributeNS(null, "y1", shape.y1);
                nShape.setAttributeNS(null, "y2", shape.y2);
            }
            else if (shape.type == "polyline") {
                nShape = document.createElementNS(xmlns, "polyline");
                nShape.setAttributeNS(null, "points", shape.points);
            }
            else if (shape.type == "polygon") {
                nShape = document.createElementNS(xmlns, "polygon");
                nShape.setAttributeNS(null, "points", shape.points);
            }
            else {
                nShape = document.createElementNS(xmlns, "path");
                nShape.setAttributeNS(null, "d", shape.d);
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
                    nShape.setAttributeNS(null, style.name, style.val);
                });
            }
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
        if (arr.length == 4) {
            prevViewbox.x = arr[0];
            prevViewbox.y = arr[1];
            prevViewbox.width = arr[2];
            prevViewbox.height = arr[3];
        }
        else
            throw Error("viewBox must have 4 values e.g. '0 0 100 100'");
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
                    "r",
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
                    // let propVal = parseFloat(propVal)
                    if (hasWidthParam.includes(prop)) {
                        nPropVal = (parseFloat(propVal) / prevViewbox.width) * 100;
                    }
                    else if (hasHeightParam.includes(prop)) {
                        nPropVal = (parseFloat(propVal) / prevViewbox.height) * 100;
                    }
                    else if (prefersSmallerSideParam.includes(prop)) {
                        alert("TO DO: make adjustment to accomodat viewbox 0 0 100 100");
                    }
                    else if (hasBothParams.includes(prop)) {
                        alert("TO DO: make adjustment to accomodat viewbox 0 0 100 100");
                    }
                }
                Object.assign(request.groups[groupNum].shapes[shapeNum], { [prop]: nPropVal });
                /*
                90
                12
                220
                40346.45


                
                
                
                */
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
                // width?:string,
                // height?:string,
                */
            });
            if (shape.type == "circle") {
                nShape.setAttributeNS(null, "r", shape.r);
                nShape.setAttributeNS(null, "cx", shape.cx);
                nShape.setAttributeNS(null, "cy", shape.cy);
            }
            else if (shape.type == "rect") {
                nShape = document.createElementNS(xmlns, "rect");
                nShape.setAttributeNS(null, "width", shape.width || "");
                nShape.setAttributeNS(null, "height", shape.height || "");
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
                nShape.setAttributeNS(null, "cx", shape.cx);
                nShape.setAttributeNS(null, "cy", shape.cy);
                nShape.setAttributeNS(null, "rx", shape.rx);
                nShape.setAttributeNS(null, "ry", shape.ry);
            }
            else if (shape.type == "line") {
                nShape = document.createElementNS(xmlns, "line");
                nShape.setAttributeNS(null, "x1", shape.x1);
                nShape.setAttributeNS(null, "x2", shape.x2);
                nShape.setAttributeNS(null, "y1", shape.y1);
                nShape.setAttributeNS(null, "y2", shape.y2);
            }
            else if (shape.type == "polyline") {
                nShape = document.createElementNS(xmlns, "polyline");
                nShape.setAttributeNS(null, "points", shape.points);
            }
            else if (shape.type == "polygon") {
                nShape = document.createElementNS(xmlns, "polygon");
                nShape.setAttributeNS(null, "points", shape.points);
            }
            else {
                nShape = document.createElementNS(xmlns, "path");
                nShape.setAttributeNS(null, "d", shape.d);
            }
            //colors
            if (typeof shape.fill != "undefined") {
                nShape.setAttribute("fill", shape.fill);
            }
            if (typeof shape.stroke != "undefined") {
                nShape.setAttribute("stroke", shape.stroke);
            }
            if (typeof shape.styles != "undefined") { //set shape styles
                shape.styles.forEach((style) => {
                    shape.setAttributeNS(null, style.name, style.val);
                });
            }
            cGroup.appendChild(nShape);
        });
        svg.appendChild(cGroup);
    });
}
//# sourceMappingURL=svgGen.js.map