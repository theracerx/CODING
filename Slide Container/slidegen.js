export class SlideGen extends HTMLElement {
    config = {
        slideBtns: true,
        miniSlideBtns: true,
    };
    totalSlides = 0;
    slideParam = {}; //overall param for all slides
    slideParams = []; // each param for each slide (slide param 1 == index 0)
    slideArr = []; //container for all slides
    miniSlideBtnArr = []; //container for all slides miniBtns
    miniBtnIcons = [];
    currentSlide = 0;
    slideSpace = 0;
    animDur = ".5s";
    // animDur = ".625s"
    //UI Color
    uiColor = {
        50: "#edfcf5",
        100: "#d3f8e5",
        200: "#abefd1",
        300: "#74e1b7",
        400: "#3ccb99",
        500: "#18b180",
        600: "#0c8f68",
        700: "#0a7256",
        800: "#0a5b45",
        900: "#094b3a",
        950: "#042a21",
    };
    //main nodes
    mainCont = document.createElement("ul");
    slideCont = document.createElement("div");
    prevBtn = document.createElement("button");
    nextBtn = this.prevBtn.cloneNode();
    miniSlideBtns = this.mainCont.cloneNode();
    //button nodes
    prevImg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    nextImg = this.prevImg.cloneNode();
    prevImgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    nextImgPath = this.prevImgPath.cloneNode();
    //misc data
    navBtnPath = "M45.34,51.1l12.13,12.13c1.16,1.16,1.16,3.05,0,4.22l-0.02,0.02c-1.16,1.16-3.05,1.16-4.22,0L37.87,52.11c-1.16-1.16-1.16-3.05,0-4.22l15.36-15.36c1.16-1.16,3.05-1.16,4.22,0l0.02,0.02c1.16,1.16,1.16,3.05,0,4.22L45.34,48.9C44.73,49.51,44.73,50.49,45.34,51.1z";
    svgConfig = {
        attributes: {
            x: "0px",
            y: "0px",
            "viewBox": "0 0 100 100",
            "xml:space": "preserve"
        }
    };
    svgContStyleConfig = {
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        position: "absolute",
        height: "80%",
        width: "8.5%",
        // background:"none",
        background: this.uiColor[500],
        // opacity:.75,
        transition: "background " + this.animDur + " ease",
        "z-index": 1,
        "pointer-events": "all",
        overflow: "hidden", //hide outline focus of svg
        border: "0px"
    };
    miniSlideBtnsConfig = {
        display: "flex",
        "justify-content": "space-evenly",
        "align-items": "center",
        position: "absolute",
        height: "10%",
        width: "auto",
        "max-width": "80%",
        // background:"lightgray",
        opacity: .75,
        "margin": 0,
        "padding": 0,
        "z-index": 1,
        "pointer-events": "all",
        overflow: "hidden", //hide outline focus of svg
        border: "0px"
    };
    prevBtnFunc = (offset, temp) => {
        if (temp && typeof offset == "number") {
            // console.log(this.slideCont.yDeg + offset)
            this.addPEAS(this.slideCont, {
                styles: {
                    rotate: "y " + (this.slideCont.yDeg + offset) + "deg"
                }
            });
        }
        else {
            // console.log("--------------------")
            if (offset && typeof offset == "number") {
                this.slideCont.yDeg += offset;
            }
            else
                this.slideCont.yDeg += this.slideSpace;
            this.addPEAS(this.slideCont, {
                styles: {
                    rotate: "y " + this.slideCont.yDeg + "deg"
                }
            });
            for (let i = 0; i < this.slideArr.length; i++) {
                let cDeg = parseFloat(this.slideArr[i].coordConfig.coordDeg);
                if (offset && typeof offset == "number") {
                    // console.log("slide"+i,cDeg, "===>", cDeg + offset)
                    this.slideArr[i].coordConfig.adjustCircCoordNRotation(cDeg + offset);
                }
                else {
                    // console.log("slide"+i,cDeg, "===>", cDeg + this.slideSpace)  
                    this.slideArr[i].coordConfig.adjustCircCoordNRotation(cDeg + this.slideSpace);
                }
            }
        }
    };
    nextBtnFunc = (offset, temp) => {
        if (temp && typeof offset == "number") {
            // console.log(this.slideCont.yDeg - offset)
            this.addPEAS(this.slideCont, {
                styles: {
                    rotate: "y " + (this.slideCont.yDeg - offset) + "deg"
                }
            });
        }
        else {
            // console.log("--------------------")
            if (offset && typeof offset == "number") {
                this.slideCont.yDeg -= offset;
            }
            else
                this.slideCont.yDeg -= this.slideSpace;
            this.addPEAS(this.slideCont, {
                styles: {
                    rotate: "y " + this.slideCont.yDeg + "deg"
                }
            });
            for (let i = 0; i < this.slideArr.length; i++) {
                let cDeg = parseFloat(this.slideArr[i].coordConfig.coordDeg);
                if (offset && typeof offset == "number") {
                    // console.log("slide"+i,cDeg, "===>", cDeg - offset)
                    this.slideArr[i].coordConfig.adjustCircCoordNRotation(cDeg - offset);
                }
                else {
                    // console.log("slide"+i,cDeg, "===>", cDeg - this.slideSpace)
                    this.slideArr[i].coordConfig.adjustCircCoordNRotation(cDeg - this.slideSpace);
                }
            }
        }
    };
    constructor() {
        super(); // element created 
    }
    connectedCallback() {
        // browser calls this method when the element is added to the document //
        // (can be called many times if an element is repeatedly added/removed)
    }
    disconnectedCallback() {
        // browser calls this method when the element is removed from the document 
        // (can be called many times if an element is repeatedly added/removed) 
    }
    static get observedAttributes() {
        return [ /* array of attribute names to monitor for changes */];
    }
    // attributeChangedCallback(name, oldValue, newValue) { 
    // called when one of attributes listed above is modified 
    // }
    adoptedCallback() {
        // called when the element is moved to a new document 
        // (happens in document.adoptNode, very rarely used) 
    }
    // async setupSlideContainer(paramAll:slideParam,paramArr:slideParam[]){
    async setupSlideContainer(obj) {
        console.log("find way to clone div to slide");
        console.log("PROCESSING INPUT and SAVING CONFIG to customElement");
        //save configs for totalSlides, slideParams, slideParam
        this.totalSlides = obj.templateArr.length;
        this.slideParam = obj.template;
        this.miniBtnIcons = obj.miniBtnIcons;
        //temp config setup
        if (obj.config.slideBtns == false)
            this.config.slideBtns = false;
        if (obj.config.miniSlideBtns == false)
            this.config.miniSlideBtns = false;
        for (let i = 0; i < this.totalSlides; i++) {
            console.log(obj.templateArr[i]);
            this.slideParams.push(obj.templateArr[i]);
        }
        console.log("UPDATING customElement");
        this.addPEAS(this, {
            styles: {
                display: "flex",
                position: "relative",
                "flex-wrap": "nowrap",
                "justify-content": "center",
                "align-items": "center",
                "background-color": "#1a1a1e",
                "overflow": "hidden",
                "transform-style": "preserve-3d"
            }
        });
        // this.setupMainContainer()
        if (!this.config.slideBtns) {
            this.setupMiniSlideBtns();
        }
        else
            this.setupSlideBtns();
    }
    setupSlideBtns() {
        //setup svgPath
        this.addPEAS(this.prevImgPath, { attributes: { d: this.navBtnPath } });
        this.addPEAS(this.nextImgPath, { attributes: { d: this.navBtnPath } });
        this.prevImg.append(this.prevImgPath);
        this.nextImg.append(this.nextImgPath);
        //setup svg
        this.addPEAS(this.prevImg, { ...this.svgConfig,
            styles: {
                "scale": "2",
                // background:this.uiColor[500],
                "fill": this.uiColor[50],
                "animation": "myAnim 10s ease-out 0s infinite normal none"
            }
        });
        this.addPEAS(this.nextImg, { ...this.svgConfig,
            styles: {
                "scale": "2",
                // background:this.uiColor[500],
                "rotate": "y 180deg",
                "fill": this.uiColor[50],
                // "border-radius":"999px",
                "animation": "myAnim 10s ease-out 0s infinite normal none"
            }
        });
        this.prevBtn.append(this.prevImg);
        this.nextBtn.append(this.nextImg);
        //setup svgCont
        this.addPEAS(this.prevBtn, {
            props: {
                loop: "",
                looping: false,
                onSelect: () => {
                    this.addPEAS(this.prevBtn, { styles: { "background": this.uiColor[700], scale: "1 .95 1" } });
                    this.prevBtn.isDown = true;
                    this.prevBtn.loop = setInterval(() => {
                        if (this.prevBtn.isDown) {
                            this.prevBtnFunc();
                            this.prevBtn.looping = true;
                        }
                        else
                            clearInterval(this.prevBtn.loop);
                    }, 350);
                },
                onActive: () => {
                    this.addPEAS(this.prevBtn, { styles: { "background": this.uiColor[500], scale: "1 1 1" } });
                    if (!this.prevBtn.looping && this.prevBtn.isDown)
                        this.prevBtnFunc();
                    clearInterval(this.prevBtn.loop);
                    this.prevBtn.looping = this.prevBtn.isDown = false;
                }
            },
            styles: { ...this.svgContStyleConfig, left: "0%",
                "border-radius": "0 999px 999px 0",
                scale: "1 1 1",
                cursor: "pointer"
                //  animation:" myAnim 10s ease 0s infinite normal forwards"
            },
            events: {
                pointerdown: () => { this.prevBtn.onSelect(); },
                pointerup: () => { this.prevBtn.onActive(); },
                pointerleave: () => { this.prevBtn.onActive(); }
            }
        });
        this.addPEAS(this.nextBtn, {
            props: {
                loop: "",
                looping: false,
                onSelect: () => {
                    this.addPEAS(this.nextBtn, { styles: { "background": this.uiColor[700], scale: "1 .95 1" } });
                    this.nextBtn.isDown = true;
                    this.nextBtn.loop = setInterval(() => {
                        if (this.nextBtn.isDown) {
                            this.nextBtnFunc();
                            this.nextBtn.looping = true;
                        }
                        else
                            clearInterval(this.nextBtn.loop);
                    }, 350);
                },
                onActive: () => {
                    this.addPEAS(this.nextBtn, { styles: { "background": this.uiColor[500], scale: "1 1 1" } });
                    if (!this.nextBtn.looping && this.nextBtn.isDown)
                        this.nextBtnFunc();
                    this.nextBtn.isDown = this.nextBtn.looping = false;
                    clearInterval(this.nextBtn.loop);
                }
            },
            styles: { ...this.svgContStyleConfig, right: "0%",
                "border-radius": "999px 0 0 999px",
                scale: "1 1 1",
                cursor: "pointer"
                //  animation:" myAnim 10s ease 0s infinite normal forwards"
            },
            events: {
                pointerdown: () => { this.nextBtn.onSelect(); },
                pointerup: () => { this.nextBtn.onActive(); },
                pointerleave: () => { this.nextBtn.onActive(); }
            }
        });
        this.append(this.prevBtn);
        this.append(this.nextBtn);
        //make container for Each slide
        this.setupMiniSlideBtns();
    }
    setupMiniSlideBtns() {
        //setup miniSlideBtns
        this.addPEAS(this.miniSlideBtns, {
            styles: { ...this.miniSlideBtnsConfig,
                bottom: "0%",
                //   "border-radius":"999px 999px 0 0",
            }
        });
        this.append(this.miniSlideBtns);
        for (let i = 0; i < this.totalSlides; i++) {
            //gen mini slide btns
            let miniBtnCont = document.createElement("div");
            let miniBtn;
            if (this.miniBtnIcons && this.miniBtnIcons[i]) {
                miniBtn = document.createElement("img");
                miniBtn.icons = this.miniBtnIcons[i];
                miniBtn.src = miniBtn.icons.off;
                miniBtn.active = false;
                this.addPEAS(miniBtn, {
                    props: {
                        turnOn: () => {
                            miniBtn.src = miniBtn.icons.on;
                            miniBtn.active = true;
                            this.addPEAS(miniBtn, {
                                styles: {
                                    "background": this.uiColor[500],
                                    border: "7px solid " + this.uiColor[500]
                                }
                            });
                        },
                        turnOff: () => {
                            miniBtn.src = miniBtn.icons.off;
                            miniBtn.active = false;
                            this.addPEAS(miniBtn, {
                                styles: {
                                    "background": this.uiColor[700],
                                    border: "7px solid " + this.uiColor[700]
                                }
                            });
                        }
                    },
                    styles: {
                        "width": "auto",
                        "height": "90%",
                        // "border-radius":"999px",
                        "margin": "0 .25rem",
                        // "border":"0px solid " + this.uiColor[700],
                        "background": this.uiColor[700],
                        "box-sizing": "content-box",
                        transition: "all " + this.animDur + " cubic-bezier(0.68, -0.6, 0.32, 1.6)", //background, border
                    },
                    attributes: {
                        "data-count": i
                    }
                });
            }
            else {
                miniBtn = document.createElement("button");
                this.addPEAS(miniBtn, {
                    props: {
                        turnOn: () => {
                            this.addPEAS(miniBtn, {
                                styles: {
                                    "background": this.uiColor[500],
                                    border: "7px solid " + this.uiColor[500]
                                }
                            });
                        },
                        turnOff: () => {
                            this.addPEAS(miniBtn, {
                                styles: {
                                    "background": this.uiColor[700],
                                    border: "0px solid " + this.uiColor[700]
                                }
                            });
                        }
                    },
                    styles: {
                        "height": "14px",
                        "border-radius": "999px",
                        "margin": "0 1.5rem",
                        "border": "0px solid " + this.uiColor[700],
                        "background": this.uiColor[700],
                        "box-sizing": "content-box",
                        transition: "all " + this.animDur + " cubic-bezier(0.68, -0.6, 0.32, 1.6)", //background, border
                    },
                    attributes: {
                        "data-count": i
                    }
                });
            }
            this.addPEAS(miniBtnCont, {
                props: {
                    navigate: () => {
                        let trgtPos = parseFloat(miniBtn.dataset.count);
                        let activePos = this.currentSlide;
                        // console.log("vvvvvvvvvvvvvvvvvvv")
                        if (trgtPos == activePos) { //do nothing
                        }
                        else if (trgtPos > activePos) { //go to higher index
                            // console.log("higher index")
                            if ((trgtPos - activePos) > ((activePos + this.totalSlides) - trgtPos)) { // 4  5
                                let offset = ((activePos + this.totalSlides) - trgtPos) * this.slideSpace;
                                // console.log("left +",offset)
                                this.prevBtnFunc(offset);
                            }
                            else { // 1  5
                                let offset = (trgtPos - activePos) * this.slideSpace;
                                // console.log("right -",offset)
                                this.nextBtnFunc(offset);
                            }
                        }
                        else if (trgtPos < activePos) { // go to lower index
                            // console.log("lower index")
                            if (((this.totalSlides - activePos) + trgtPos) < (activePos - trgtPos)) { // 4 5
                                let offset = ((this.totalSlides - activePos) + trgtPos) * this.slideSpace;
                                // console.log("right -",offset)
                                this.nextBtnFunc(offset);
                            }
                            else { //1 5
                                let offset = (activePos - trgtPos) * this.slideSpace;
                                // console.log("left +",offset)
                                this.prevBtnFunc(offset);
                            }
                        }
                    }
                },
                styles: {
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center",
                    cursor: "pointer"
                },
                events: {
                    onOver: () => {
                        if (miniBtn.active) {
                            this.addPEAS(miniBtn, {
                                styles: {
                                    "scale": 1,
                                }
                            });
                        }
                        else {
                            this.addPEAS(miniBtn, {
                                styles: {
                                    "scale": 1.1,
                                    "background": this.uiColor[500],
                                    border: "7px solid " + this.uiColor[500]
                                }
                            });
                        }
                    },
                    onSelect: () => {
                        miniBtn.isDown = true;
                        this.addPEAS(miniBtn, {
                            styles: {
                                "scale": .9,
                            }
                        });
                    },
                    onActive: () => {
                        if (miniBtn.isDown)
                            miniBtnCont.navigate();
                        miniBtn.isDown = false;
                        this.addPEAS(miniBtn, {
                            styles: {
                                "scale": 1,
                            }
                        });
                    },
                    onLeave: () => {
                        if (!miniBtn.active) {
                            this.addPEAS(miniBtn, {
                                styles: {
                                    "background": this.uiColor[700],
                                    border: "7px solid " + this.uiColor[700]
                                }
                            });
                        }
                        this.addPEAS(miniBtn, {
                            styles: {
                                "scale": 1,
                            }
                        });
                    }
                }
            });
            this.miniSlideBtnArr.push(miniBtn);
            miniBtnCont.append(miniBtn);
            this.miniSlideBtns.append(miniBtnCont);
        }
        this.setupSlides();
    }
    setupSlides() {
        this.addPEAS(this.slideCont, {
            styles: {
                width: "100%",
                height: "100%",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
                "transform-style": "preserve-3d",
                // transition:"rotate "+ this.animDur +" cubic-bezier(0.68, -0.6, 0.32, 1.6)",
                transition: "rotate " + this.animDur + " ease",
                "rotate": "y 0deg"
            },
            props: {
                yDeg: 0
            }
        });
        this.append(this.slideCont);
        //apply slideParam (param for all Slides) & gen miniSlideBtn
        for (let i = 0; i < this.totalSlides; i++) {
            let slide = document.createElement("div");
            //apply default param stykes
            this.addPEAS(slide, {
                props: {
                    isDown: false,
                    prevDeg: 0,
                    prevXCoord: 0,
                    prevBounds: 0,
                    navigate: () => {
                        let trgtPos = parseFloat(slide.dataset.count);
                        let activePos = this.currentSlide;
                        if (trgtPos == activePos) { //do nothing
                        }
                        else if (trgtPos > activePos) { //go to higher index
                            // console.log("higher index")
                            if ((trgtPos - activePos) > ((activePos + this.totalSlides) - trgtPos)) { // 4  5
                                // console.log("left")
                                let offset = ((activePos + this.totalSlides) - trgtPos) * this.slideSpace;
                                this.prevBtnFunc(offset);
                            }
                            else { // 1  5
                                // console.log("right")
                                let offset = (trgtPos - activePos) * this.slideSpace;
                                this.nextBtnFunc(offset);
                            }
                        }
                        else if (trgtPos < activePos) { // go to lower index
                            // console.log("lower index")
                            if (((this.totalSlides - activePos) + trgtPos) < (activePos - trgtPos)) { // 4 5
                                // console.log("right")
                                let offset = ((this.totalSlides - activePos) + trgtPos) * this.slideSpace;
                                this.nextBtnFunc(offset);
                            }
                            else { //1 5
                                // console.log("left")
                                let offset = (activePos - trgtPos) * this.slideSpace;
                                this.prevBtnFunc(offset);
                            }
                        }
                    },
                    reset: (e) => {
                        let d = slide.prevXCoord - e.clientX;
                        if (d > 0) {
                            this.nextBtnFunc(0, true);
                        }
                        else if (d < 0) {
                            this.prevBtnFunc(0, true);
                        }
                    },
                    turnOff: () => { this.addPEAS(slide, { styles: { opacity: 0.5 } }); },
                    turnOn: () => { this.addPEAS(slide, { styles: { opacity: 1 } }); },
                },
                styles: {
                    position: "absolute",
                    "backface-visibility": "hidden",
                    transition: "opacity " + this.animDur + " ease",
                    "user-select": "none",
                    // "border-left": "93.47px solid pink",
                    // "border-right": "93.47px solid pink"
                },
                attributes: {
                    "data-count": i
                },
                events: {
                    onSelect: (e) => {
                        this.addPEAS(this.slideCont, {
                            styles: {
                                "transition-duration": "0s"
                            }
                        });
                        slide.prevXCoord = e.clientX;
                        slide.prevBounds = slide.getBoundingClientRect();
                    },
                    onSelectMove: (e) => {
                        slide.isDown = true;
                        let d = slide.prevXCoord - e.clientX;
                        let deg = this.slideSpace * (Math.abs(d) / (slide.prevBounds.width));
                        // console.log(deg)
                        if (d > 0) {
                            this.nextBtnFunc(deg, true);
                        }
                        else if (d < 0) {
                            this.prevBtnFunc(deg, true);
                        }
                    },
                    onActive: (e) => {
                        this.addPEAS(this.slideCont, {
                            styles: {
                                "transition-duration": this.animDur
                            }
                        });
                        let d = slide.prevXCoord - e.clientX;
                        let limit = slide.prevBounds.width * .33;
                        if (d > 0 && d > limit && slide.isDown) {
                            this.nextBtnFunc();
                        }
                        else if (d < 0 && d < -limit && slide.isDown) {
                            this.prevBtnFunc();
                        }
                        else
                            slide.reset(e);
                        slide.isDown = false;
                    },
                    onLeave: (e) => {
                        this.addPEAS(this.slideCont, {
                            styles: {
                                "transition-duration": this.animDur
                            }
                        });
                        let d = slide.prevXCoord - e.clientX;
                        let limit = slide.prevBounds.width * .4;
                        if (d > 0 && d > limit && slide.isDown) {
                            this.nextBtnFunc();
                        }
                        else if (d < 0 && d < -limit && slide.isDown) {
                            this.prevBtnFunc();
                        }
                        else
                            slide.reset(e);
                        slide.isDown = false;
                    }
                }
            });
            this.addPEAS(slide, this.slideParam);
            this.slideArr.push(slide);
            this.slideCont.append(slide);
        }
        //apply slideParams (custom param for each Slide)
        for (let i = 0; i < this.slideArr.length; i++) {
            this.addPEAS(this.slideArr[i], this.slideParams[i]);
            if (this.slideParams[i].target) {
                let target = this.slideParams[i].target;
                if (target?.charAt(0) == "#") {
                    this.slideArr[i].append(document.getElementById(target.substring(1)));
                }
                else if (target?.charAt(0) == ".") {
                    this.slideArr[i].append(document.getElementsByClassName(target.substring(1))[0]);
                }
            }
        }
        this.setupCarousel();
    }
    setupCarousel() {
        let evenSpaceInDeg = this.slideSpace = (360 / this.totalSlides);
        // let evenSpaceInDeg:any = this.slideSpace =  (360/this.totalSlides).toFixed(2)
        let distanceFromCenter = (() => {
            /*
            ask ChatGpt
                "isosceles triangle has a vertex of 72 deg and a base of 589.5cm, find the length of the equal sides"
            */
            let w = this.slideArr[0].getBoundingClientRect().width;
            let hypothenus = (w / 2) / (Math.cos(((180 - evenSpaceInDeg) * .5 * Math.PI) / 180));
            let height = Math.sqrt(Math.pow(hypothenus, 2) - Math.pow(w / 2, 2));
            return height;
        })();
        let posArr = []; //slidePosArr
        for (let i = 0; i < this.slideArr.length; i++) {
            posArr.push(i);
            let adjustCircCoordNRotation = (deg, move) => {
                if (typeof deg == "number")
                    this.slideArr[i].coordConfig.coordDeg = deg.toFixed(2);
                let obj = this.slideArr[i].coordConfig;
                let x = Math.round((obj.centerX + ((obj.radius) * Math.sin((obj.coordDeg * Math.PI) / 180))) * 100) / 100;
                let y = -1 * Math.round((obj.centerY - ((obj.radius) * Math.cos((obj.coordDeg * Math.PI) / 180))) * 100) / 100;
                //-1 was added as an inverse solution for z-axis in 3d plain
                if (move) {
                    this.addPEAS(this.slideArr[i], {
                        styles: {
                            // translate: x + "px",
                            // translate: x + "px 0px " + y + "px",
                            // rotate: "y " + obj.coordDeg + "deg",
                            "transform-origin": "center",
                            transform: "translate3d(" + x + "px, 0px, " + y + "px) rotateY(" + (obj.coordDeg * 1) + "deg)"
                        }
                    });
                }
                // console.log(Math.round(obj.coordDeg%360))
                if (Math.round(obj.coordDeg % 360) == 0) {
                    this.currentSlide = parseFloat(this.slideArr[i].dataset.count);
                    this.slideArr[i].dataset.active = true;
                    this.slideArr[i].turnOn();
                    this.miniSlideBtnArr[this.currentSlide].turnOn();
                }
                else {
                    this.slideArr[i].dataset.active = false;
                    this.slideArr[i].turnOff();
                    this.miniSlideBtnArr[this.slideArr[i].dataset.count].turnOff();
                }
            };
            if (i == 0)
                this.slideArr[i].dataset.active = true;
            this.slideArr[i].coordConfig = {
                radius: distanceFromCenter,
                centerX: 0,
                centerY: 0,
                coordDeg: i * evenSpaceInDeg,
                adjustCircCoordNRotation: adjustCircCoordNRotation,
            };
            adjustCircCoordNRotation(this.slideArr[i].coordConfig.coordDeg, true);
        }
    }
    testdelay(txt) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (txt)
                    console.log("finished delay on: " + txt);
                resolve();
            }, 1500);
        });
    }
    addPEAS(elem, obj) {
        if (obj.styles) { //set svg styles
            Object.entries(obj.styles).forEach(([key, val]) => {
                elem.style.setProperty(key, val);
            });
        }
        if (obj.props) {
            Object.entries(obj.props).forEach(([key, val]) => {
                Object.assign(elem, { [key]: val });
            });
        }
        if (obj.attributes) {
            Object.entries(obj.attributes).forEach(([key, val]) => {
                elem.setAttribute(key, val);
            });
        }
        if (obj.events) {
            elem.eventStatus = {
                over: false,
                overMove: false,
                select: false,
                selectMove: false,
                active: false,
                leave: true,
                onOver: (e) => {
                    if (elem.eventStatus.leave == true) {
                        elem.eventStatus.over = true; //reset by leave
                        elem.eventStatus.leave = false; //reset by leave
                        if (e.type == "pointerover") {
                            elem.eventStatus.overFunc(e);
                        }
                        else if (e.type == "focus") {
                            elem.eventStatus.overFunc(e);
                        }
                    }
                    // console.log(elem.eventStatus.over)
                },
                onOverMove: (e) => {
                    if (elem.eventStatus.over == true) {
                        if (elem.eventStatus.select == false) {
                            elem.eventStatus.overMove = true; //reset by select | leave
                            if (e.type == "pointermove") {
                                elem.eventStatus.overMoveFunc(e);
                            }
                        }
                        else
                            elem.eventStatus.overMove = false;
                    }
                },
                onSelect: (e) => {
                    if (elem.eventStatus.over == true) {
                        if (e.type == "pointerdown" && e.button != 2) {
                            elem.eventStatus.select = true; //reset by active | leave
                            elem.eventStatus.selectFunc(e);
                        }
                        else if (e.type == "keydown" && ["Enter", " "].includes(e.key)) {
                            elem.eventStatus.select = true; //reset by active | leave
                            elem.eventStatus.selectFunc(e);
                        }
                    }
                },
                onSelectMove: (e) => {
                    if (elem.eventStatus.select == true) {
                        if (e.type == "pointermove") {
                            elem.eventStatus.selectMove = true; //reset by active
                            elem.eventStatus.selectMoveFunc(e);
                        }
                    }
                    else {
                        elem.eventStatus.selectMove = false;
                    }
                },
                onActive: (e) => {
                    if (elem.eventStatus.select = true && elem.eventStatus.over == true) {
                        elem.eventStatus.select = false;
                        elem.eventStatus.selectMove = false;
                        if (e.type == "pointerup" && e.button != 2) {
                            elem.eventStatus.activeFunc(e);
                        }
                        else if (e.type == "keyup" && ["Enter", " "].includes(e.key)) {
                            elem.eventStatus.activeFunc(e);
                        }
                    }
                },
                onLeave: (e) => {
                    if (elem.eventStatus.over == true && elem.eventStatus.leave == false) {
                        elem.eventStatus.over = false;
                        elem.eventStatus.overMove = false;
                        elem.eventStatus.select = false;
                        elem.eventStatus.selectMove = false;
                        elem.eventStatus.leave = true;
                        if (e.type == "pointerout") {
                            elem.eventStatus.leaveFunc(e);
                        }
                        else if (e.type == "focusout") {
                            elem.eventStatus.leaveFunc(e);
                        }
                    }
                },
                overFunc: () => { },
                overMoveFunc: () => { },
                selectFunc: () => { },
                selectMoveFunc: () => { },
                activeFunc: () => { },
                leaveFunc: () => { },
            };
            Object.entries(obj.events).forEach(([key, val]) => {
                if (["onOver", "onOverMove", "onSelect", "onSelectMove", "onActive", "onLeave"].includes(key)) {
                    //just replace default callback func
                    if (key == "onOver") {
                        elem.eventStatus.overFunc = val;
                    }
                    else if (key == "onOverMove") {
                        elem.eventStatus.overMoveFunc = val;
                    }
                    else if (key == "onSelect") {
                        elem.eventStatus.selectFunc = val;
                    }
                    else if (key == "onSelectMove") {
                        elem.eventStatus.selectMoveFunc = val;
                    }
                    else if (key == "onActive") {
                        elem.eventStatus.activeFunc = val;
                    }
                    else if (key == "onLeave") {
                        elem.eventStatus.leaveFunc = val;
                    }
                }
                else
                    elem.addEventListener(key, val);
            });
            elem.addEventListener("pointerover", elem.eventStatus.onOver);
            elem.addEventListener("focus", elem.eventStatus.onOver);
            elem.addEventListener("pointermove", elem.eventStatus.onOverMove);
            elem.addEventListener("pointerdown", elem.eventStatus.onSelect);
            elem.addEventListener("keydown", elem.eventStatus.onSelect);
            elem.addEventListener("pointermove", elem.eventStatus.onSelectMove);
            elem.addEventListener("pointerup", elem.eventStatus.onActive);
            elem.addEventListener("keyup", elem.eventStatus.onActive);
            elem.addEventListener("pointerout", elem.eventStatus.onLeave);
            elem.addEventListener("focusout", elem.eventStatus.onLeave);
        }
    }
}
customElements.define("slide-cont", SlideGen);
/*
.parent {
display: grid;
grid-template-columns: repeat(3, 33%);
grid-template-rows: 100%;
grid-column-gap: 0px;
grid-row-gap: 0px;
}



*/ 
//# sourceMappingURL=slidegen.js.map