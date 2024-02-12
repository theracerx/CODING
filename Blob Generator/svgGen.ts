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
    interface svgShape{
        [key:string]:any
        styles?:svgStyle[]
    }
    interface svgStyle{
        name:string,
        val:string
    }
}
export function nSvg(request:svgTemplate){ 
    console.log("TEST3")
    console.log("TEST3")
    // ---------------------- SETUP SVG --------------
    let xmlns = "http://www.w3.org/2000/svg"
    let svg = document.createElementNS(xmlns, "svg");

    svg.setAttributeNS(null, "viewBox", request.viewBox || "0 0 100 100");

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
        group.shapes.forEach((shape) => { //set shapes
            let nShape;
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
                    shape.setAttributeNS(null,style.name,style.val)
                });
            }
            cGroup.appendChild(nShape);
        });
        svg.appendChild(cGroup);
    });

    return svg;
}
