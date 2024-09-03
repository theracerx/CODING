export class AudioRadio extends HTMLElement {
    cStation = 0; //index of current active Station
    stations; //no value because will be added later
    stationPlayers; //no value because will be added later
    radioReady = new Event("radioReady");
    onready = () => { };
    radioPlay = new Event("radioPlay");
    onplay = () => { };
    radioPause = new Event("radioPause");
    onpause = () => { };
    radioWait = new Event("radioWait");
    onwait = () => { };
    radioTimeUpdate = new Event("radioTimeUpdate");
    ontimeupdate = () => { };
    radioEnd = new Event("radioEnd");
    onend = () => { };
    isInterupted = false;
    radioDurationChange = new Event("radioDurationChange");
    ondurationchange = () => { };
    radioRateChange = new Event("radioRateChange");
    onratechange = () => { };
    radioLoadStart = new Event("radioLoadStart");
    onloadstart = () => { };
    radioVolumeChange = new Event("radioVolumeChange");
    onvolumechange = () => { };
    constructor() {
        super();
        this.stations = [];
        this.stationPlayers = [];
    }
    connectedCallback() { }
    disconnectedCallback() { }
    static get observedAttributes() {
        return ["station", "autostart"];
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        // called when one of attributes listed above is modified
        if (attr == "station") {
            // console.log("------------------STATION CHANGE DETECTED------------------")
            let stations = this.stations.length - 1;
            if (oldValue != newValue && oldValue != null) {
                if (oldValue > stations || oldValue < 0) {
                    // console.log("station change ignored")
                    return;
                }
                else if (newValue <= stations && newValue >= 0) {
                    // console.log("station change applied")
                    this.cStation = newValue;
                    this.stationPlayers[oldValue].pause();
                    this.stationPlayers[newValue].play();
                }
                else {
                    this.setAttribute("station", oldValue);
                    console.warn("Please select the correct stationID index. Total stations: " + this.stations.length);
                }
            }
            else {
                // console.log("station change ignored")
            }
            // console.log("------------------STATION CHANGE END------------------")
        }
        else if (attr == "autostart") { }
    }
    adoptedCallback() { }
    // setupRadio > setupStation > shuffleAllStationTypes
    /*  stations = [
            {
                name:"Station1",
                music:[audArray],
                commercial:[audArray],
            }
        ]
    */
    async setupRadio(obj) {
        // setupRadio(stations:station[],obj?:radioControls){ //targets an element
        // this.stations = stations
        document.addEventListener("radioReady", this.onready);
        //wait for each audioElem generation
        await (() => {
            return new Promise(async (resolve, reject) => {
                for (let i = 0; i < this.stations.length; i++) {
                    let station = this.stations[i];
                    await this.setupStation(station);
                }
                resolve();
            });
        })();
        console.log("TODO: add download radio station??chk inline comment");
        /*
            to get audio name just split on audio format like ".mp3" or ".opus"
            folder1/sample.mp3?gain=0.23".split(".mp3")

            purpose of download is to give users access to play radio locally since web hosting has limited data
        */
        console.log("TODO: seasonal filter like add `?season=christmas` or `?time=9-13`");
        //check total audioElem generated
        if (this.getElementsByTagName("audio").length == this.stations.length) {
            // console.log("audio files ready")
            let initialStation = this.getAttribute("station");
            this.cStation = initialStation | Math.round(Math.random() * (this.stations.length - 1));
            this.setAttribute("station", this.cStation.toString());
            this.setupRadioControls(obj);
            this.resume(); //plays active Radio
            document.dispatchEvent(this.radioReady);
        }
        else
            throw new Error("audio elements doesn't match number of");
    }
    async setupStation(station) {
        return new Promise(async (resolve) => {
            let audio = Object.assign(document.createElement("audio"), {
                //------------------------ INITIAL PROPS------------------------------
                id: station.name + "Station",
                controls: true, //to remove
                station: { queue: [], played: [], ...station },
                // station: {...station},
                stationBackup: station,
                // --------------------- INDEX SYSTEM ---------------------
                // detects which catergories are available
                // apply necessary stats like "ID", "MAX"
                chk: {
                    music: station.music ? true : false,
                    commercial: station.commercial ? true : false,
                    musicIntroSeq: station.musicIntroSeq ? true : false,
                    musicOutroSeq: station.musicOutroSeq ? true : false,
                    sponsorship: station.sponsorship ? true : false,
                },
                stats: {
                    musicIDMax: station.music ? station.music.length - 1 : undefined,
                    commercialIDMax: station.commercial ? station.commercial.length - 1 : undefined,
                    musicIntroSeqIDMax: station.musicIntroSeq ? station.musicIntroSeq.length : undefined,
                    musicOutroSeqIDMax: station.musicOutroSeq ? station.musicOutroSeq.length - 1 : undefined,
                    sponsorshipIDMax: station.sponsorship ? station.sponsorship.length - 1 : undefined,
                    nextCommercialIn: station.commercial || station.sponsorship ? //for initial display
                        Math.round(Math.random()) ? 1 : 0
                        : undefined
                },
                updateStats: (src, type) => {
                    /*
                        document the src
                        update stats
                    */
                    audio.station.played.unshift(src);
                    audio.removeDuplicates(src);
                    if (type) {
                        audio.station[type].shift();
                        // if(type == "queue") audio.station.queue.shift()
                        if (type != "queue")
                            audio.stats[type + "IDMax"]--; //since "queue doesn't have stats"
                        if (type == "music")
                            audio.stats.nextCommercialIn--;
                    }
                },
                removeDuplicates: (src) => {
                    //Note: Only removes music type, since commercials are queued once
                    if (audio.chk.music) {
                        let musicArr = audio.station.music;
                        let before = musicArr.length;
                        for (let i = 0; i < musicArr.length; i++) {
                            let match = false;
                            let target = musicArr[i];
                            if (typeof target == "object") {
                                if (target.intro == src) {
                                    match = true;
                                }
                                else if (target.music == src) {
                                    match = true;
                                }
                                else if (target.sequence && target.sequence.includes(src)) {
                                    match = true;
                                }
                                else if (target.outro == src) {
                                    match = true;
                                }
                            }
                            else if (target == src) {
                                match = true;
                            }
                            if (match) {
                                console.log("duplicates removed");
                                audio.station.music.splice(i, 1);
                                audio.stats.musicIDMax--;
                            }
                        }
                        let after = musicArr.length;
                        console.log({ src: src, before: before, after: after });
                    }
                    // console.log(audio.stats)
                },
                //------------------------- PLAY SYSTEM -----------------------------
                // randomizePlay is used to decide when to play each category and reset/shuffle if max reached
                // console.log("TO DO: fix rate of commercial played vs music")
                randomizePlay: async (standby) => {
                    return new Promise(async (resolve) => {
                        let routes = {
                            force: () => {
                                console.log(audio.id + " -----------------Force Route-----------------");
                                audio.src = audio.station.queue[0];
                                audio.updateStats(audio.station.queue[0], "queue");
                            },
                            music: async () => {
                                console.log(audio.id + " -----------------Music Route-----------------");
                                if (audio.stats.musicIDMax <= 0) {
                                    console.log(">>>>>>>>>>>>>>>>>Music Reset<<<<<<<<<<<<<<<<<");
                                    await audio.shuffleStationType("music");
                                }
                                let src = prepAttachment(audio.station.music[0]);
                                audio.updateStats(src, "music");
                            },
                            commercial: async () => {
                                console.log(audio.id + " -----------------Commercial Route-----------------");
                                if (audio.stats.commercialIDMax <= 0) {
                                    console.log(">>>>>>>>>>>>>>>>>Commercial Reset<<<<<<<<<<<<<<<<<");
                                    await audio.shuffleStationType("commercial");
                                }
                                let src = prepAttachment(audio.station.commercial[0]);
                                audio.updateStats(src, "commercial");
                            }
                        };
                        let prepAttachment = (target) => {
                            return new Promise((resolve) => {
                                let src;
                                if (typeof target == "string") {
                                    audio.src = src = target;
                                }
                                else if (typeof target == "object") {
                                    let obj = target;
                                    if (obj.intro && typeof obj.intro == "string") {
                                        audio.src = src = obj.intro;
                                        if (obj.music)
                                            audio.queueAudio(obj.music);
                                        if (obj.sequence && Array.isArray(obj.sequence))
                                            obj.sequence.forEach((i) => { audio.queueAudio(i); });
                                        if (obj.outro)
                                            audio.queueAudio(obj.outro);
                                    }
                                    else if (obj.music && typeof obj.music == "string") {
                                        audio.src = src = obj.music;
                                        if (obj.outro)
                                            audio.queueAudio(obj.outro);
                                    }
                                    else if (obj.sequence && Array.isArray(obj.sequence)) {
                                        obj.sequence.forEach((item, index) => {
                                            if (index == 0) {
                                                audio.src = src = item;
                                            }
                                            else
                                                audio.queueAudio(obj.outro);
                                        });
                                        if (obj.outro)
                                            audio.queueAudio(obj.outro);
                                    }
                                }
                                resolve(src);
                            });
                        };
                        audio.nowPlaying = {
                            currentTime: new Date().getTime() / 1000,
                        };
                        //chk if station has commercial then select commercial
                        if (audio.station.queue.length > 0) {
                            routes.force();
                        }
                        else if (audio.stats.nextCommercialIn == 0) {
                            await routes.commercial();
                            audio.stats.nextCommercialIn = (() => {
                                let min, max;
                                if (!audio.stationBackup.commercialFreq) {
                                    max = 2;
                                    min = 1;
                                }
                                else {
                                    max = audio.stationBackup.commercialFreq.max || 2;
                                    min = audio.stationBackup.commercialFreq.min || 1;
                                    if (max <= min) {
                                        max = min + 1;
                                    }
                                }
                                return Math.round(Math.random() * (max - min)) + min;
                            })();
                        }
                        else
                            await routes.music();
                        if (!standby) {
                            audio.load();
                            audio.play();
                        }
                    });
                },
                queueAudio: (req) => {
                    if (Array.isArray(req)) {
                        req.forEach((item) => {
                            audio.station.queue.push(item);
                        });
                    }
                    else
                        audio.station.queue.push(req);
                },
                //------------------------- RESET SYSTEM -----------------------------
                // for all or specific reshuffle
                // overwrites audio.station by using new array from audio.stationBackup
                selectRandomFromArr: (arr) => {
                    return arr[Math.round(Math.random() * (arr.length - 1))];
                },
                selectRandomsFromArr: (arr, num) => {
                    let nArr = [];
                    let tempArr = [...arr];
                    if (num && num < arr.length) {
                        for (let i = 0; i < num; i++) {
                            let item = audio.selectRandomFromArr(tempArr);
                            tempArr.splice(tempArr.indexOf(item), 1);
                            nArr.push(item);
                        }
                        return nArr;
                    }
                    else {
                        console.error({
                            targetArr: tempArr,
                            numOfRandoms: num
                        });
                        throw new Error("cannot get more randoms than what is available");
                    }
                },
                shuffleStationType: (type) => {
                    return new Promise(async (resolve) => {
                        let times = Math.floor(Math.random() * 1 * 3) + 1;
                        let list = Object.values(audio.stationBackup[type]);
                        // console.log("----------------original copy " + list.length + "------------------")
                        if (list) {
                            let tempList = [];
                            let chkType = (obj) => {
                                /*
                                    intro
                                    music
                                    sequence
                                    outro
                                    
                                    intro:music
                                    intro:music[]
                                    intro[]:music
    
                                    outro:music
                                    outro:music[]
                                    outro[]:music
                                    
                                    
                                    intro:music:outro
    
                                    intro[]:music:outro
                                    intro:music[]:outro
                                    intro:music:outro[]
    
                                    intro[]:music[]:outro
                                    intro:music[]:outro[]
                                    intro[]:music:outro[]
    
                                    intro[]:music[]:outro[]
    
                                    intro:sequence[]:outro
    
                                    intro[]:sequence[]:outro
                                    intro:sequence[]:outro[]
                                    intro[]:sequence[]:outro[]
                                    
                                */
                                let type = {
                                    intro: "", //string, array, undefined
                                    music: "", //string, array, undefined
                                    sequence: "", //string, array, undefined
                                    outro: "", //string, array, undefined
                                };
                                if (typeof obj.intro == "string") {
                                    type.intro = "string";
                                }
                                else if (Array.isArray(obj.intro)) {
                                    type.intro = "array";
                                }
                                else
                                    type.intro = undefined;
                                if (typeof obj.music == "string") {
                                    type.music = "string";
                                }
                                else if (Array.isArray(obj.music)) {
                                    type.music = "array";
                                }
                                else
                                    type.music = undefined;
                                if (typeof obj.sequence == "string") {
                                    type.sequence = undefined;
                                    throw new Error("sequence cannot be STRING");
                                }
                                else if (Array.isArray(obj.sequence)) {
                                    type.sequence = "array";
                                }
                                else
                                    type.sequence = undefined;
                                if (typeof obj.outro == "string") {
                                    type.outro = "string";
                                }
                                else if (Array.isArray(obj.outro)) {
                                    type.outro = "array";
                                }
                                else
                                    type.outro = undefined;
                                if (type.music == undefined && type.sequence == undefined) {
                                    throw new Error("music and sequence cannot be both empty!");
                                }
                                return type;
                            };
                            let processType = (obj, objType) => {
                                return new Promise((resolve) => {
                                    //if an array exists
                                    if (objType.intro == "array" || objType.music == "array" || objType.outro == "array") {
                                        // console.log("object with array/s detected")
                                        //find longest array first
                                        let arrLength = {
                                            intro: 0, music: 0, outro: 0, longest: "none"
                                        };
                                        //set length
                                        if (objType.intro == "array") {
                                            arrLength.intro = obj.intro.length;
                                        }
                                        if (objType.music == "array") {
                                            arrLength.music = obj.music.length;
                                        }
                                        if (objType.outro == "array") {
                                            arrLength.outro = obj.outro.length;
                                        }
                                        /* probability
                                        intro   music   outro
                                        1       2       3x
                                        1       3       2x
                                        2       1       3x
                                        3       1       2x
                                        3       2       1x
                                        2       3       1x
    
                                        1       0       0xintro
                                        0       1       0xmusic
                                        0       0       1xoutro
                                        2       1       2x
                                        2       2       1x
                                        1       2       2x
                                        */
                                        //determine longest arr
                                        if (arrLength.intro > arrLength.music) {
                                            if (arrLength.outro > arrLength.intro) {
                                                arrLength.longest = "outro";
                                            }
                                            else
                                                arrLength.longest = "intro";
                                        }
                                        else if (arrLength.music > arrLength.intro) {
                                            if (arrLength.outro > arrLength.music) {
                                                arrLength.longest = "outro";
                                            }
                                            else
                                                arrLength.longest = "music";
                                        }
                                        else if (arrLength.intro > 0) {
                                            arrLength.longest = "intro";
                                        }
                                        else if (arrLength.music > 0) {
                                            arrLength.longest = "music";
                                        }
                                        else if (arrLength.outro > 0) {
                                            arrLength.longest = "outro";
                                        }
                                        //process longest arr
                                        let tempObjArr = [];
                                        if (arrLength.longest == "intro") {
                                            //fill tempObjArr with longest arr
                                            for (let i = 0; i < obj.intro.length; i++) {
                                                tempObjArr.push({
                                                    intro: obj.intro[i]
                                                });
                                            }
                                            for (let i = 0; i < tempObjArr.length; i++) {
                                                //decide for music or sequence
                                                if (objType.sequence != undefined) {
                                                    let seqArr = [];
                                                    for (let x = 0; x < obj.sequence.length; x++) {
                                                        if (Array.isArray(obj.sequence[x])) {
                                                            seqArr.push(audio.selectRandomFromArr(obj.sequence[x]));
                                                        }
                                                        else
                                                            seqArr.push(obj.sequence[x]);
                                                    }
                                                    Object.assign(tempObjArr[i], { ["sequence"]: seqArr });
                                                }
                                                else {
                                                    if (objType.music == "array") {
                                                        Object.assign(tempObjArr[i], { ["music"]: audio.selectRandomFromArr(obj.music) });
                                                    }
                                                    else if (objType.music == "string") {
                                                        Object.assign(tempObjArr[i], { ["music"]: obj.music });
                                                    }
                                                }
                                                if (objType.outro == "array") {
                                                    Object.assign(tempObjArr[i], { ["outro"]: audio.selectRandomFromArr(obj.outro) });
                                                }
                                                else if (objType.outro == "string") {
                                                    Object.assign(tempObjArr[i], { ["outro"]: obj.outro });
                                                }
                                            }
                                        }
                                        else if (arrLength.longest == "outro") {
                                            //fill tempObjArr with longest arr
                                            for (let i = 0; i < obj.outro.length; i++) {
                                                tempObjArr.push({
                                                    outro: obj.outro[i]
                                                });
                                            }
                                            for (let i = 0; i < tempObjArr.length; i++) {
                                                //decide for music or sequence
                                                if (objType.sequence != undefined) {
                                                    let seqArr = [];
                                                    for (let x = 0; x < obj.sequence.length; x++) {
                                                        if (Array.isArray(obj.sequence[x])) {
                                                            seqArr.push(audio.selectRandomFromArr(obj.sequence[x]));
                                                        }
                                                        else
                                                            seqArr.push(obj.sequence[x]);
                                                    }
                                                    Object.assign(tempObjArr[i], { ["sequence"]: seqArr });
                                                }
                                                else {
                                                    if (objType.music == "array") {
                                                        Object.assign(tempObjArr[i], { ["music"]: audio.selectRandomFromArr(obj.music) });
                                                    }
                                                    else if (objType.music == "string") {
                                                        Object.assign(tempObjArr[i], { ["music"]: obj.music });
                                                    }
                                                }
                                                if (objType.intro == "array") {
                                                    Object.assign(tempObjArr[i], { ["intro"]: audio.selectRandomFromArr(obj.intro) });
                                                }
                                                else if (objType.intro == "string") {
                                                    Object.assign(tempObjArr[i], { ["intro"]: obj.intro });
                                                }
                                            }
                                        }
                                        else if (arrLength.longest == "music") {
                                            //fill tempObjArr with longest arr
                                            for (let i = 0; i < obj.music.length; i++) {
                                                tempObjArr.push({
                                                    music: obj.music[i]
                                                });
                                            }
                                            for (let i = 0; i < tempObjArr.length; i++) {
                                                if (objType.intro == "array") {
                                                    Object.assign(tempObjArr[i], { ["intro"]: audio.selectRandomFromArr(obj.intro) });
                                                }
                                                else if (objType.intro == "string") {
                                                    Object.assign(tempObjArr[i], { ["intro"]: obj.intro });
                                                }
                                                if (objType.outro == "array") {
                                                    Object.assign(tempObjArr[i], { ["outro"]: audio.selectRandomFromArr(obj.outro) });
                                                }
                                                else if (objType.outro == "string") {
                                                    Object.assign(tempObjArr[i], { ["outro"]: obj.outro });
                                                }
                                            }
                                        }
                                        // console.log({
                                        //     before:obj,
                                        //     after:tempObjArr
                                        // })
                                        resolve(tempObjArr);
                                    }
                                    else {
                                        // console.log("dflt obj added")
                                        let tempObj = {};
                                        if (objType.intro) {
                                            Object.assign(tempObj, { ["intro"]: obj.intro });
                                        }
                                        if (objType.music || objType.sequence) {
                                            if (objType.music) {
                                                Object.assign(tempObj, { ["music"]: obj.music });
                                            }
                                            else
                                                Object.assign(tempObj, { ["sequence"]: obj.sequence });
                                        }
                                        if (objType.outro) {
                                            Object.assign(tempObj, { ["outro"]: obj.outro });
                                        }
                                        resolve([tempObj]);
                                    }
                                });
                            };
                            for (let i = 0; i < list.length; i++) {
                                if (typeof list[i] == "object") {
                                    /*
                                    type={
                                        intro:"",//string, array, undefined
                                        music:"",//string, array, undefined
                                        sequence:"",//string, array, undefined
                                        outro:"",//string, array, undefined
                                    }
                                    */
                                    let objType = chkType(list[i]);
                                    let objArr = await processType(list[i], objType);
                                    // console.log("objArr",objArr.length)
                                    // console.log(objArr)
                                    // console.log("tempList",tempList.length)
                                    tempList = [...tempList, ...objArr];
                                }
                                else if (typeof list[i] == "string") {
                                    tempList.push(list[i]);
                                }
                                else
                                    throw new Error("item cannot be array");
                            }
                            // console.log("----------------procesed copy " + tempList.length + "------------------")
                            //shuffle at random times
                            for (let a = times; a > 0; a--) {
                                await audio.shuffleArray(tempList);
                            }
                            Object.assign(audio.stats, { [type + "IDMax"]: tempList.length });
                            Object.assign(audio.station, { [type]: [...tempList] });
                            // console.log(list)
                        }
                        else
                            throw new Error("select appropriate station type to shuffle");
                        resolve();
                    });
                },
                shuffleAllStationTypes: () => {
                    return new Promise(async (resolve) => {
                        // console.log("SHUFFLING START:")
                        if (audio.chk.music) {
                            // console.log("music")
                            await audio.shuffleStationType("music");
                        }
                        if (audio.chk.commercial) {
                            // console.log("commercial")
                            await audio.shuffleStationType("commercial");
                        }
                        // console.log("SHUFFLING END:")
                        resolve();
                    });
                },
                shuffleArray: (array) => {
                    return new Promise((resolve, reject) => {
                        for (let i = array.length - 1; i >= 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [array[i], array[j]] = [array[j], array[i]];
                        }
                        resolve(array);
                    });
                },
                preventRepeatAfterShuffle: (array, type) => {
                    return new Promise((resolve, reject) => {
                        let item1 = audio.station.played[0] || null;
                        let item2 = audio.station.played[1] || null;
                        if (item1) {
                            console.log("item1 active");
                            if (["music", "musicOutroSeq", "musicIntroSeq"].includes(type)) {
                                console.log(array[0].music);
                                if ([item1, item2].includes(array[0].music)) {
                                    console.log("matchfound sending to back");
                                    //    return array.push(array.splice(0, 1)[0]);
                                    resolve(array.push(array.splice(0, 1)[0]));
                                }
                                else
                                    resolve(array);
                                // } else return array
                            }
                            resolve();
                            // } else return array;
                        }
                        else
                            resolve(array);
                    });
                },
                //------------------------- EVENT SYSTEM -----------------------------
                // chk current time first and see if audio.nowPlaying has expired
                playStation: (e) => {
                    if (this.isInterupted) {
                        e.stopImmediatePropagation();
                    }
                    audio.dispatchEvent(this.radioPlay);
                    // console.log("PLAYING")
                    let cTime = (new Date().getTime()) / 1000;
                    let timePassed = cTime - audio.nowPlaying.currentTime;
                    audio.currentTime = timePassed + audio.currentTime;
                },
                pauseStation: (e) => {
                    if (this.isInterupted) {
                        e.stopImmediatePropagation();
                    }
                    audio.dispatchEvent(this.radioPause);
                    // console.log("PAUSING")
                    audio.nowPlaying = {
                        currentTime: new Date().getTime() / 1000, //will be used to subtract current Time and added
                    };
                },
                endStation: () => {
                    // console.log("ENDED")
                    if (!audio.paused)
                        return; //prevent current player to trigger on end event onvolumechange
                    if (audio != radio.stationPlayers[radio.cStation])
                        return; //prevent inactive players to trigger on end event onvolumechange
                    // console.log("TRIGGERED")
                    audio.dispatchEvent(this.radioEnd);
                    audio.nowPlaying = {
                        currentTime: new Date().getTime() / 1000, //will be used to subtract current Time and added
                    };
                    // let delay = (Math.floor(Math.random() * 3) + 1) * 500
                    let prevStation = this.cStation;
                    let delay = audio.station.gapless ? 0 : (Math.floor(Math.random() * 3) + 1) * 1000;
                    // let delay = audio.station.gapless ? 0 : (Math.floor(Math.random() * 3) + 1) * 500
                    // console.log("delayed for:" + delay + "ms")
                    setTimeout(() => {
                        if (prevStation != this.cStation)
                            return;
                        if (audio.currentTime == audio.duration && !this.isInterupted) {
                            // console.log("nextStationAudio fired")
                            audio.nextStationAudio();
                        }
                    }, delay);
                },
                waitStation: () => {
                    // console.log("WAITING")
                    audio.dispatchEvent(this.radioWait);
                },
                timeUpdateStation: () => {
                    // console.log("TIME UPDATING")
                    audio.dispatchEvent(this.radioTimeUpdate);
                },
                durationChangeStation: () => {
                    audio.dispatchEvent(this.radioDurationChange);
                },
                rateChangeStation: () => {
                    audio.dispatchEvent(this.radioRateChange);
                },
                loadStartStation: () => {
                    audio.dispatchEvent(this.radioLoadStart);
                },
                volumeChangeStation: () => {
                    audio.dispatchEvent(this.radioVolumeChange);
                },
                nextStationAudio: async () => {
                    if (!this.isInterupted) {
                        await audio.randomizePlay();
                    }
                },
            });
            //default events for the player
            audio.addEventListener("play", audio.playStation);
            audio.addEventListener("pause", audio.pauseStation);
            audio.addEventListener("wait", audio.waitStation);
            audio.addEventListener("timeupdate", audio.timeUpdateStation);
            audio.addEventListener("ended", audio.endStation);
            audio.addEventListener("durationchange", audio.endStation);
            audio.addEventListener("ratechange", audio.endStation);
            audio.addEventListener("loadstart", audio.endStation);
            audio.addEventListener("volumechange", audio.endStation);
            //events for the radio
            audio.addEventListener("radioPlay", this.onplay);
            audio.addEventListener("radioPause", this.onpause);
            audio.addEventListener("radioWait", this.onwait);
            audio.addEventListener("radioTimeUpdate", this.ontimeupdate);
            audio.addEventListener("radioEnd", this.onend);
            audio.addEventListener("radioDurationChange", this.ondurationchange);
            audio.addEventListener("radioRateChange", this.onratechange);
            audio.addEventListener("radioLoadStart", this.onloadstart);
            audio.addEventListener("radioVolumeChange", this.onvolumechange);
            this.appendChild(audio);
            this.stationPlayers.push(audio); //saves to list of player stations in radio-player
            // ------------------- INITIAL SETUP FIRED -------------------
            await audio.shuffleAllStationTypes();
            // console.log("INITIAL SETUP COMPLETE, ADDING STANDBY AUDIO")
            audio.randomizePlay(true);
            resolve();
            // setTimeout(()=>{resolve()},3000)
        });
    }
    setupRadioControls(obj) {
        /*
            if no buttons provided then generate
            if provided then apply events
            
        */
        let nextBtn, prevBtn, stationName, volume, muteBtn;
        let controlCont = document.createElement("div");
        let unusedElem = document.createElement("p");
        if (obj) {
            nextBtn = obj.nxtBtn || unusedElem;
            prevBtn = obj.prevBtn || unusedElem;
            stationName = obj.stationName || unusedElem;
            volume = obj.volBtn || unusedElem;
            muteBtn = obj.muteBtn || unusedElem;
            this.appendChild(prevBtn);
            this.appendChild(stationName);
            this.appendChild(nextBtn);
            this.appendChild(muteBtn);
            this.appendChild(volume);
        }
        else {
            nextBtn = Object.assign(document.createElement("button"), {
                textContent: ">"
            });
            prevBtn = Object.assign(document.createElement("button"), {
                textContent: "<"
            });
            stationName = Object.assign(document.createElement("strong"), {
                textContent: this.stations[this.cStation].name
            });
            volume = Object.assign(document.createElement("input"), {
                type: "range",
                min: 0,
                max: 100,
                value: 100
            });
            muteBtn = Object.assign(document.createElement("img"), {
                on: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPg0KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik0xOCA5LjAwMDA5QzE4LjYyNzcgOS44MzU3NSAxOC45OTk2IDEwLjg3NDUgMTguOTk5NiAxMi4wMDAxQzE4Ljk5OTYgMTMuMTI1NyAxOC42Mjc3IDE0LjE2NDQgMTggMTUuMDAwMU02LjYgOS4wMDAwOUg3LjUwMTJDOC4wNTIxMyA5LjAwMDA5IDguMzI3NTkgOS4wMDAwOSA4LjU4Mjg1IDguOTMxNDFDOC44MDkwMyA4Ljg3MDU2IDkuMDIyNzUgOC43NzA0NiA5LjIxNDI5IDguNjM1NjZDOS40MzA0NyA4LjQ4MzUzIDkuNjA2ODEgOC4yNzE5MSA5Ljk1OTUxIDcuODQ4NjhMMTIuNTg1NCA0LjY5NzU4QzEzLjAyMTEgNC4xNzQ3NiAxMy4yMzg5IDMuOTEzMzUgMTMuNDI5MiAzLjg4NjE0QzEzLjU5NCAzLjg2MjU4IDEzLjc1OTcgMy45MjI1OCAxMy44NzEyIDQuMDQ2MTdDMTQgNC4xODg4OSAxNCA0LjUyOTE3IDE0IDUuMjA5NzNWMTguNzkwNEMxNCAxOS40NzEgMTQgMTkuODExMyAxMy44NzEyIDE5Ljk1NEMxMy43NTk3IDIwLjA3NzYgMTMuNTk0IDIwLjEzNzYgMTMuNDI5MiAyMC4xMTRDMTMuMjM5IDIwLjA4NjggMTMuMDIxMSAxOS44MjU0IDEyLjU4NTQgMTkuMzAyNkw5Ljk1OTUxIDE2LjE1MTVDOS42MDY4MSAxNS43MjgzIDkuNDMwNDcgMTUuNTE2NiA5LjIxNDI5IDE1LjM2NDVDOS4wMjI3NSAxNS4yMjk3IDguODA5MDMgMTUuMTI5NiA4LjU4Mjg1IDE1LjA2ODhDOC4zMjc1OSAxNS4wMDAxIDguMDUyMTMgMTUuMDAwMSA3LjUwMTIgMTUuMDAwMUg2LjZDNi4wMzk5NSAxNS4wMDAxIDUuNzU5OTIgMTUuMDAwMSA1LjU0NjAxIDE0Ljg5MTFDNS4zNTc4NSAxNC43OTUyIDUuMjA0ODcgMTQuNjQyMiA1LjEwODk5IDE0LjQ1NDFDNSAxNC4yNDAyIDUgMTMuOTYwMSA1IDEzLjQwMDFWMTAuNjAwMUM1IDEwLjA0IDUgOS43NjAwMSA1LjEwODk5IDkuNTQ2MDlDNS4yMDQ4NyA5LjM1NzkzIDUuMzU3ODUgOS4yMDQ5NSA1LjU0NjAxIDkuMTA5MDhDNS43NTk5MiA5LjAwMDA5IDYuMDM5OTUgOS4wMDAwOSA2LjYgOS4wMDAwOVoiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjwvc3ZnPg==",
                off: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPg0KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik0xNiA5LjUwMDA5TDIxIDE0LjUwMDFNMjEgOS41MDAwOUwxNiAxNC41MDAxTTQuNiA5LjAwMDA5SDUuNTAxMkM2LjA1MjEzIDkuMDAwMDkgNi4zMjc1OSA5LjAwMDA5IDYuNTgyODUgOC45MzE0MUM2LjgwOTAzIDguODcwNTYgNy4wMjI3NSA4Ljc3MDQ2IDcuMjE0MjkgOC42MzU2NkM3LjQzMDQ3IDguNDgzNTMgNy42MDY4MSA4LjI3MTkxIDcuOTU5NTEgNy44NDg2OEwxMC41ODU0IDQuNjk3NThDMTEuMDIxMSA0LjE3NDc2IDExLjIzODkgMy45MTMzNSAxMS40MjkyIDMuODg2MTRDMTEuNTk0IDMuODYyNTggMTEuNzU5NyAzLjkyMjU4IDExLjg3MTIgNC4wNDYxN0MxMiA0LjE4ODg5IDEyIDQuNTI5MTcgMTIgNS4yMDk3M1YxOC43OTA0QzEyIDE5LjQ3MSAxMiAxOS44MTEzIDExLjg3MTIgMTkuOTU0QzExLjc1OTcgMjAuMDc3NiAxMS41OTQgMjAuMTM3NiAxMS40MjkyIDIwLjExNEMxMS4yMzkgMjAuMDg2OCAxMS4wMjExIDE5LjgyNTQgMTAuNTg1NCAxOS4zMDI2TDcuOTU5NTEgMTYuMTUxNUM3LjYwNjgxIDE1LjcyODMgNy40MzA0NyAxNS41MTY2IDcuMjE0MjkgMTUuMzY0NUM3LjAyMjc1IDE1LjIyOTcgNi44MDkwMyAxNS4xMjk2IDYuNTgyODUgMTUuMDY4OEM2LjMyNzU5IDE1LjAwMDEgNi4wNTIxMyAxNS4wMDAxIDUuNTAxMiAxNS4wMDAxSDQuNkM0LjAzOTk1IDE1LjAwMDEgMy43NTk5MiAxNS4wMDAxIDMuNTQ2MDEgMTQuODkxMUMzLjM1Nzg1IDE0Ljc5NTIgMy4yMDQ4NyAxNC42NDIyIDMuMTA4OTkgMTQuNDU0MUMzIDE0LjI0MDIgMyAxMy45NjAxIDMgMTMuNDAwMVYxMC42MDAxQzMgMTAuMDQgMyA5Ljc2MDAxIDMuMTA4OTkgOS41NDYwOUMzLjIwNDg3IDkuMzU3OTMgMy4zNTc4NSA5LjIwNDk1IDMuNTQ2MDEgOS4xMDkwOEMzLjc1OTkyIDkuMDAwMDkgNC4wMzk5NSA5LjAwMDA5IDQuNiA5LjAwMDA5WiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPC9zdmc+"
            });
            muteBtn.src = muteBtn.on;
            controlCont.style.maxWidth = "20rem";
            controlCont.style.maxHeight = "4rem";
            controlCont.style.display = "flex";
            controlCont.style.justifyContent = "center";
            controlCont.style.alignItems = "center";
            muteBtn.style.height = "2rem";
            controlCont.appendChild(prevBtn);
            controlCont.appendChild(stationName);
            controlCont.appendChild(nextBtn);
            controlCont.appendChild(muteBtn);
            controlCont.appendChild(volume);
            this.appendChild(controlCont);
        }
        let onNextBtn = () => {
            if (this.isInterupted)
                return;
            let limit = this.stations.length - 1;
            if ((this.cStation + 1) > limit) {
                this.stationPlayers[this.cStation].pause();
                this.cStation = 0;
                this.stationPlayers[this.cStation].play();
                stationName.textContent = this.stations[this.cStation].name;
            }
            else {
                this.stationPlayers[this.cStation].pause();
                this.stationPlayers[this.cStation + 1].play();
                stationName.textContent = this.stations[this.cStation + 1].name;
                this.cStation = this.cStation + 1;
            }
        };
        let onPrevBtn = () => {
            if (this.isInterupted)
                return;
            let limit = this.stations.length - 1;
            if ((this.cStation - 1) < 0) {
                this.stationPlayers[this.cStation].pause();
                this.stationPlayers[limit].play();
                stationName.textContent = this.stations[limit].name;
                this.cStation = limit;
            }
            else {
                this.stationPlayers[this.cStation].pause();
                this.stationPlayers[this.cStation - 1].play();
                stationName.textContent = this.stations[this.cStation - 1].name;
                this.cStation = this.cStation - 1;
            }
        };
        let onVolumeChange = () => {
            if (muteBtn.src == muteBtn.off) {
                muteBtn.src = muteBtn.on;
            }
            radio.stationPlayers.forEach((player) => {
                player.volume = volume.value / 100;
                player.muted = false;
            });
        };
        let onMuteBtn = () => {
            if (muteBtn.src == muteBtn.on) {
                muteBtn.value = this.stationPlayers[this.cStation].volume;
                muteBtn.src = muteBtn.off;
                radio.stationPlayers.forEach((player) => {
                    player.muted = true;
                });
            }
            else {
                muteBtn.src = muteBtn.on;
                radio.stationPlayers.forEach((player) => {
                    player.muted = false;
                });
            }
        };
        prevBtn.addEventListener("click", onPrevBtn);
        nextBtn.addEventListener("click", onNextBtn);
        muteBtn.addEventListener("click", onMuteBtn);
        volume.addEventListener("input", onVolumeChange);
    }
    interrupt() {
        this.isInterupted = true;
        // console.log("INTERRUPTED INTERRUPTED INTERRUPTED INTERRUPTED INTERRUPTED")
        // console.log("FULL STOP PLEASE")
        if (!this.stationPlayers[this.cStation].paused) {
            this.stationPlayers[this.cStation].pause();
        }
    }
    resume() {
        this.isInterupted = false;
        let station = this.stationPlayers[this.cStation];
        if (station.currentTime >= station.duration) {
            console.log("resume nextStationAudio fired");
            station.nextStationAudio();
        }
        else {
            console.log("resume playing");
            station.play();
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
}
customElements.define("radio-player", AudioRadio);
//locate and generate "START" button
const radio = document.getElementsByTagName("radio-player")[0];
let btnOptions = {
    0: () => { return radio.getElementsByTagName("button")[0]; },
    1: () => { return radio.getElementsByTagName("input")[0].setAttribute("type", "button"); },
    2: () => { return document.getElementsByClassName("radioStartBtn")[0]; },
    3: () => {
        let target = document.createElement("button");
        target.textContent = "Start";
        radio.appendChild(target);
        return target;
    },
    addTrigger: (target) => {
        target.addEventListener("pointerup", () => {
            if (Array.isArray(radio.stations) && radio.stations.length > 0) {
                radio.setupRadio();
                target.remove();
            }
            else
                throw new Error("<radio-player>.stations must not be empty");
        });
    }
};
if (radio.getElementsByTagName("button")[0]) { //if bnt
    btnOptions.addTrigger(btnOptions[0]());
}
else if (radio.getElementsByTagName("input")[0]) { //if input
    btnOptions.addTrigger(btnOptions[1]());
}
else { //if none or has cls "radioStarBtn"
    if (document.getElementsByClassName("radioStartBtn")[0]) {
        btnOptions.addTrigger(btnOptions[2]());
    }
    else {
        btnOptions.addTrigger(btnOptions[3]());
    }
}
/*
WORKFLOW
create <radio-player> tag
fire setupRadio()
    fires setupStation()
        creates <audio> tag
            add bind audio files added
            shuffle
        appends <audio> tag to <radio-player> tag

*/
/* HOW TO USE

NOTE:player will only play same "music" audio once per shuffle
1.Create a <radio-player></radio-player> tag
2.Add a property "stations":[Array of Station]
    stations = [
        {
            name:"Station1",
            music:{intro[]?,music[]?,sequence[]?,outro[]?},
            commercial:{intro[]?,music[]?,sequence[]?,outro[]?},
            commercialFreq:{min:1,max:2}
            gapless: true
        }
    ]
 3. setupRadio() //starts everything but will be executed by btn generated

*/
/*
    let synth = window.speechSynthesis
    let voices = synth.getVoices()
    const update = new SpeechSynthesisUtterance()
    update.text = "testing"
    synth.speak(update)
*/
//# sourceMappingURL=radio.js.map