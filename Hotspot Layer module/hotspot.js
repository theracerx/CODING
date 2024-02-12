export class HotspotFrame extends HTMLElement {

    //AUTO SETUP
    newHSCont(){ //setup hotspots container
        let newHSCont = document.createElement("hotspots")
        this.prepend(newHSCont)
        return newHSCont
    }
    setupTargetEvents(){ //setup event to copy target size
        let targetElem = document.getElementById(this.getAttribute("target"))
            if(targetElem){
                targetElem.onload = ()=>{
                    console.log("updating hotspot-frame size due to new source")
                    this.fitHsLayerToTarget()
                }
            } else {
                throw new Error("MISSING TARGET ID")
            }

    }
    setupDefaultStyles(){ //setup default styles
        if(!document.getElementById("hotspotDefaultStyle")){
            //setup default styles
            let style = document.createElement("style")
            style.id = "hotspotDefaultStyle"
            style.type="text/css"
            style.innerHTML= `
                hotspot-frame{
                    display:block;
                    position:relative !important;
                }
                hotspots{
                    position:absolute;
                    // background-color:rgba(255,0,0,0.5);

                    & > svg {
                        position:absolute;
                        pointer-events:none !important;
                    }
                }
                .hsA{ //outdated
                    outline: none;
                    pointer-events: none;
                }
                .hsShape{
                    pointer-events: all !important;
                    vector-effect: non-scaling-stroke;
                }
                .hsContent {
                    pointer-events: all;
                }
            `
            /* cool styles to use
                transform-origin
                transform
            */
            if(!document.getElementById("hotspotDefaultStyle")){
                document.head.appendChild(style)
            }
        }
    }

    //MANUAL SETUP
    setupDefault(){ //for easy basic setup w/ window.hotspotStorage & window.hotspotPresets
        this.setupHSStorage()
        this.setupPresetStorage()
    }
    setupHSStorage(storage){
        if(storage){
            this.hotspotStorage = storage
        } else this.hotspotStorage = window.hotspotStorage
    }
    setupPresetStorage(storage){
        if(storage){
            this.hotspotPresets = storage
        } else this.hotspotPresets = window.hotspotPresets
    }
    
    // hotspot creation //add custom prop, attribute, style, events, simpleEvents, append, presets
    newHotspot(obj){
        return new Promise((resolve,reject)=>{
            let svg = document.createElementNS(this.xmlns, "svg")
            svg.setAttributeNS(null,"viewBox","0 0 100 100")
            svg.setAttributeNS(null,"width","100%")
            svg.setAttributeNS(null,"height","100%")

            // if(obj.role){
            //     svg.setAttributeNS(null,"role",obj.role)
            // }
            // if(obj.preserveAspectRatio){
            //     svg.setAttributeNS(null,"preserveAspectRatio","xMidYMid meet")
            // } else svg.setAttributeNS(null,"preserveAspectRatio","none")
            
            svg.setAttributeNS(null,"preserveAspectRatio","none")
            svg.setAttributeNS(null,"tabindex","-1")
            resolve(svg)
        })
    }
    configElemNS(target,profile){ //CALL THIS ONLY
        return new Promise(async(resolve,reject)=>{
            await this.addProps(target,profile.props)
            await this.addAttributesNS(target,profile.attributesNS)
            await this.addStyles(target,profile.styles)
            await this.addEvents(target,profile.events)
            await this.addChildNodes(target,profile.append)
            resolve()
        })
    }
    addElementNS(profile){
        return new Promise(async(resolve,reject)=>{
            let nElem = document.createElementNS(this.xmlns, profile.elementNS)
            await this.configElemNS(nElem,profile).then(()=>resolve(nElem))
        })
    }
    addProps(target,props){
        return new Promise((resolve,reject)=>{
            if(props){
                let arr = Object.keys(props)
                for(let i=0;i<arr.length;i++){
                    target[arr[i]] = props[arr[i]]
                }

                resolve()
            } else resolve()
        })
    }
    addAttributesNS(target,attributes){
        return new Promise((resolve,reject)=>{
            if(attributes){
                let arr = Object.keys(attributes)
                for(let i=0;i<arr.length;i++){
                    target.setAttributeNS(null,arr[i],attributes[arr[i]])
                }
                resolve()
            } else resolve()
        })
    }
    addStyles(target,styles){
        return new Promise((resolve,reject)=>{
            if(styles){
                let arr = Object.keys(styles)
                for(let i=0;i<arr.length;i++){
                    target.style[arr[i]] = styles[arr[i]]
                }
                resolve()
            } else resolve()
        })
    }
    addEvents(target,events){
        return new Promise(async(resolve,reject)=>{
            if(events){
                await this.addSimpleEvents(target,events)

                let arr = Object.keys(events)
                for(let i=0;i<arr.length;i++){
                    if(!["onOver", "onSelect", "onActive", "onLeave", "enableAllKeys", "disableKeys"].includes(arr[i])){
                        target.addEventListener(arr[i],events[arr[i]])
                    }
                }
                resolve()
            } else resolve()
        })
    }
    addSimpleEvents(elem,events){ //onOver, onSelect, onActive, onLeave, enableAllKeys, disableKeys
        return new Promise((resolve,reject)=>{
            let dfltFunc = (e)=>{console.log(e.type)};
            // let dfltFunc = ()=>{console.log()};
    
            events.onOver = events.onOver || dfltFunc;
            events.onSelect = events.onSelect || dfltFunc;
            events.onActive = events.onActive || dfltFunc;
            events.onLeave = events.onLeave || dfltFunc;
            events.enableAllKeys = events.enableAllKeys || false; //for onSelect fire event on Tab
            events.disableKeys = events.disableKeys || false; //for disabling Keyboard
                        
            let accessibilityFunc = { //obselete???
                overAnimCue: (event) => {
                    if (event.target.classList.contains("ui-btn")) {
                        event.target.parentElement.style.opacity = 1;
                    }
                },
                selectAnimCue: (event) => {
                    if (MISC.qs("svg", event.target)) {
                        MISC.qsa("svg", event.target).forEach((elem) => {
                            elem.style.padding = "10%";
                            elem.style.fill = "#ffa500";
                        });
                    }
                },
                activeAnimCue: (event) => { //needs update
                    /* if (MISC.qs("svg", event.target)) {
                        MISC.qsa("svg", event.target).forEach((elem) => {
                            elem.style.padding = "";
                            elem.style.fill = "";
                        });
                    } */
                },
                leaveAnimCue: (event) => { //needs update
                    /* if (MISC.qs("svg", event.target)) {
                        MISC.qsa("svg", event.target).forEach((elem) => {
                            elem.style.padding = "";
                            elem.style.fill = "";
                        });
                    } */
                }
            };
            let overflowFix = { //obselete???
                show: (event) => {
                    if (event.target.classList.contains("ui-btn")) {
                        event.target.parentElement.style.overflow = "visible";
                    }
                },
                hide: (event) => {
                    if (event.target.classList.contains("ui-btn")) {
                        event.target.parentElement.style.overflow = "";
                    }
                }
            };
    
            /* if (events.disableKeys == true) {
                MISC.setStyle(elem, {
                    pointerEvents: "all"
                });
                elem.tabIndex = -1;
            } */
    
            let isDisabled = (elem) => {
                if (elem.disabled == true && elem.tagName == "BUTTON") {
                    return true;
                } else return false;
            };
            let onOver = (event) => {
                if (isDisabled(event.target)) {
                    return false;
                }
                let func = events.onOver;
                if (["pointerover", "focus"].includes(event.type)) {
                    // overflowFix.show(event);
                    // accessibilityFunc.overAnimCue(event);
                    func(event);
                }
            };
            let onSelect = (event) => {
                if (isDisabled(event.target)) {
                    return false;
                }
                let func = events.onSelect;
                let isSelected = () => event.target.isSelected = true;
                if (event.type == "pointerdown" && event.button != 2) {
                    isSelected();
                    func(event);
                }
                else if (event.type == "keydown" && ["Enter", " "].includes(event.key)) {
                    isSelected();
                    // accessibilityFunc.selectAnimCue(event);
                    func(event);
                }
                else if (event.type == "keydown" && events.enableAllKeys == true) {
                    func(event);
                }
            };
            let onActive = (event) => {
                if (isDisabled(event.target)) {
                    return false;
                }
                let func = events.onActive;
                let isSelected = event.target.isSelected;
                let isNotSelected = () => event.target.isSelected = false;
                if (event.type == "pointerup" && event.button != 2 && isSelected) {
                    isNotSelected();
                    func(event);
                }
                else if (event.type == "keyup" && ["Enter", " "].includes(event.key) && isSelected) {
                    isNotSelected();
                    // accessibilityFunc.activeAnimCue(event);
                    func(event);
                }
            };
            let onLeave = (event) => {
                if (isDisabled(event.target)) {
                    return false;
                }
                let func = events.onLeave;
                if (["pointerleave", "focusout", "blur"].includes(event.type)) {
                    // overflowFix.hide(event);
                    // accessibilityFunc.leaveAnimCue(event);
                    func(event);
                }
            };
            
            elem.addEventListener("pointerover", onOver);
            elem.addEventListener("focus", onOver);
            elem.addEventListener("pointerdown", onSelect);
            elem.addEventListener("keydown", onSelect);
            elem.addEventListener("pointerup", onActive);
            elem.addEventListener("keyup", onActive);
            elem.addEventListener("pointerleave", onLeave);
            elem.addEventListener("focusOut", onLeave);
            elem.addEventListener("blur", onLeave);

            resolve()
        })
    }
    addChildNodes(target,children){
        return new Promise(async(resolve,reject)=>{
            if(children){
                for(let i=0;i<children.length;i++){
                    let childProfile = children[i]

                    if(childProfile.preset){
                        //preset
                        let preset = await this.addChkPreset(childProfile)
                        let nElem = await this.addElementNS(preset)
                        target.append(nElem)
                    } else if(childProfile.elementNS){
                        let nElem = await this.addElementNS(childProfile)
                        target.append(nElem)
                    }
                    
                }
                resolve()
            } else resolve()
        })
    }
    addChkPreset(profile){
        return new Promise ((resolve,reject)=>{

            let preset = this.hotspotPresets[profile.preset]

            if(preset){
                preset = preset(profile.presetArg)
                let nProfile = {...preset,...profile}
                nProfile.props = {...preset.props, ...profile.props}
                nProfile.attributesNS = {...preset.attributesNS, ...profile.attributesNS}
                nProfile.styles = {...preset.styles, ...profile.styles}
                nProfile.events = {...preset.events, ...profile.events}
                nProfile.append = {...preset.append, ...profile.append}
    
                resolve(nProfile)
            } else reject("Preset " + profile.preset + " not found!")
        })
    }

    //resize to fit hs container to target size
    fitHsLayerToTarget(){
        let targetElem = getComputedStyle(this.querySelector( `#${this.getAttribute("target")}`))
        this.hotspotContainer.style.width = targetElem.width
        this.hotspotContainer.style.height = targetElem.height
    }
    
    //hotspot spawn and despawn
    async load(trgtProfile){
        let profile = trgtProfile || this.getAttribute("load")
        
        if(profile && Array.isArray(this.hotspotStorage[profile]) && this.hotspotStorage[profile]){
            
            let hotspots = new DocumentFragment()
            console.log(this.hotspotStorage[profile].length)
            //svgs >>> svg
            for(let i=0; i < this.hotspotStorage[profile].length; i++){
                let cProfile = this.hotspotStorage[profile][i] //svg instruction
                let nHotspot = await this.newHotspot(cProfile) //default
                await this.configElemNS(nHotspot,cProfile)
                
                hotspots.append(nHotspot)
            }
            this.hotspotContainer.append(hotspots)
            this.fitHsLayerToTarget()
            
        } else throw new Error(`failed to load Array ${profile}`)
    }
    reset(){
        this.hotspotContainer.innerHTML = ""
    }

    constructor(){
        super()
        this.hotspotStorage = null
        this.hotspotPresets = null
        this.xmlns = "http://www.w3.org/2000/svg" //for svg content creation
        
        //Auto setup
        this.hotspotContainer = this.newHSCont() //cont
        this.setupTargetEvents() //event
        this.setupDefaultStyles() //style
    };
    static get observedAttributes() {
        return ['load','target'];
    }

    attributeChangedCallback(attr,oldVal,newVal){
        if(attr == "load" && this.hotspotStorage){ //load hotspot
            this.reset()
            this.load()
        } else if (attr == "target" && oldVal != null){ //change target 
            if(this.querySelector(`#${newVal}`)){
                this.fitHsLayerToTarget()
            } else {
                this.setAttribute("target",oldVal)
                throw new Error("new target is not found inside hotspot-frame")
            }
        } 

    };
} 

window.onresize = ()=>{
    let hotspots = document.getElementsByTagName("hotspot-frame")
    for(let i=0; i<hotspots.length; i ++){
        let targetID = hotspots[i].getAttribute("target")
        if(targetID){
            hotspots[i].fitHsLayerToTarget()
        }
    }
}

customElements.define("hotspot-frame",HotspotFrame)

/* DESCRIPTION
    a hotspot layer where you can spawn responsive hotspots 
    hotspots with custom prop, attributes, styles, and events

    can also work with video (iframe is considerable)
 */

/* USAGE

create `hsStorage` with format:
    objArr = {
        sampProfile:[
            attributesNS:{}
            props:{}
            styles:{}
            events:{}
            append:{
                preset:""
                attributesNS:{}
                props:{}
                styles:{}
                events:{}
            }
        ],
        ...
    }
create `hsPresets` with format:
    objArr = {
        func : ()=>{}
    }

create <hotspot-frame load="" target="">
`load` will be HS profile to render
`target` will be the id of the image to be used for rendering image

select `hotspot-frame`
then $0.setupHSStorage()  $0.setupPresetStorage() $0.load()

*/

/* USEFUL LINKS FOR SVG EDITING AND CREATION
online editor: https://www.photopea.com //DON'T FORGET to resize image to 100x100 when exporting
shapes to path converter: https://thednp.github.io/svg-path-commander/convert.html
*/

/* if viewBox is different and want to equalize with 100
    All x coords (100/viewBox X)
    All y coords (100/viewBox Y)
*/

/*  Extra notes on adding text

<text style="font-size: 5px;" x="50" y="50" text-anchor="middle" dominant-baseline="central">
    TEXT
</text>

<path id="p1" d="M250 50 A200,200,0,0,1,423.2050807568877,149.99999999999997" fill="#ddd" stroke="#ddd"></path>
<text style="font-size: 24px;">
<textPath xlink:href="#p1" startOffset="50%" text-anchor="middle">1test text</textPath>
</text>

*/