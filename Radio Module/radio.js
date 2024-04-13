export class AudioRadio extends HTMLElement {
    cStation = 0;
    stations; //no value because will be added later
    stationPlayers; //no value because will be added later
    radioReady = new Event("radioReady");
    onRadioReady = () => { };
    radioPlay = new Event("radioPlay");
    onRadioPlay = () => { };
    radioPause = new Event("radioPause");
    onRadioPause = () => { };
    radioWait = new Event("radioWait");
    onRadioWait = () => { };
    radioEnd = new Event("radioEnd");
    onRadioEnd = () => { };
    isInterupted = false;
    constructor() {
        super();
        // this.cStation = 0
        this.stations = [];
        this.stationPlayers = [];
        // this.radioReady = new Event("radioReady")
        // this.onRadioReady = ()=>{}
        // this.radioPlay = new Event("radioPlay")
        // this.onRadioPlay = ()=>{}
        // this.radioPause = new Event("radioPause")
        // this.onRadioPause = ()=>{}
        // this.radioWait = new Event("radioWait")
        // this.onRadioWait = ()=>{}
        // this.radioEnd = new Event("radioEnd")
        // this.onRadioEnd = ()=>{}
        // this.isInterupted = false
    }
    connectedCallback() { }
    disconnectedCallback() { }
    static get observedAttributes() {
        return [ /* array of attribute names to monitor for changes */];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // called when one of attributes listed above is modified
    }
    adoptedCallback() { }
    /*  stations = [
            {
                name:"Station1",
                music:[audArray],
                commercial:[audArray],
                commercialSeq:[audArray],
                musicSeq:[audArray],
                commercialFreq:{min:1,max:2}
            }
        ]
    */
    setupRadio(obj) {
        // setupRadio(stations:station[],obj?:radioControls){ //targets an element
        // this.stations = stations
        document.addEventListener("radioReady", this.onRadioReady);
        //wait for each audioElem generation
        this.stations.forEach(async (station) => { await this.setupStation(station); });
        //check total audioElem generated
        if (this.getElementsByTagName("audio").length == this.stations.length) {
            console.log("audio files ready");
            this.cStation = Math.round(Math.random() * (this.stations.length - 1));
            this.setupRadioControls(obj);
            this.resume();
            document.dispatchEvent(this.radioReady);
        }
        else
            throw new Error("audio elements doesn't match number of");
    }
    setupStation(station) {
        return new Promise((resolve, reject) => {
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
                    commercialSeq: station.commercialSeq ? true : false,
                    musicSeq: station.musicSeq ? true : false,
                },
                stats: {
                    musicIDMax: station.music ? station.music.length - 1 : undefined,
                    commercialIDMax: station.commercial ? station.commercial.length - 1 : undefined,
                    commercialSeqIDMax: station.commercialSeq ? station.commercialSeq.length : undefined,
                    musicSeqIDMax: station.musicSeq ? station.musicSeq.length - 1 : undefined,
                    nextCommercialIn: (station.music || station.commercialSeq) ? //for initial display
                        Math.round(Math.random()) ? 1 : 0
                        : undefined
                },
                //------------------------- PLAY SYSTEM -----------------------------
                // randomizePlay is used to decide when to play each category and reset/shuffle if max reached
                // console.log("TO DO: fix rate of commercial played vs music")
                randomizePlay: (standby) => {
                    let forceRoute = () => {
                        audio.src = audio.station.queue[0];
                        audio.removeDuplicates(audio.station.queue[0]);
                        audio.station.queue.shift();
                        // console.log("force Route")
                    };
                    let musicRoute = () => {
                        // console.log("music Route")
                        if (audio.stats.musicIDMax <= 0) {
                            audio.shuffleStation("music");
                        }
                        audio.src = audio.station.music[0];
                        audio.removeDuplicates(audio.station.music[0]);
                        audio.stats.nextCommercialIn--;
                    };
                    let commercialRoute = () => {
                        // console.log("commercial Route")
                        if (audio.stats.commercialIDMax <= 0) {
                            audio.shuffleStation("commercial");
                        }
                        audio.src = audio.station.commercial[0];
                        audio.removeDuplicates(audio.station.commercial[0]);
                    };
                    let commercialSeqRoute = () => {
                        // console.log("commercialSeq Route")
                        /*
                            play obj.intro //ads
                            then match obj.music //music
                        */
                        if (audio.stats.commercialSeqIDMax <= 0) {
                            audio.shuffleStation("commercialSeq");
                        }
                        //play ad
                        audio.src = audio.station.commercialSeq[0].intro;
                        //set music on queue
                        audio.addQueue(audio.station.commercialSeq[0], "music");
                        //remove similar ad
                        audio.removeDuplicates(audio.station.commercialSeq[0].intro);
                    };
                    let musicSeqRoute = () => {
                        // console.log("musicSeq Route")
                        /*
                            play obj.intro //music
                            then match obj.commercial //ads
                        */
                        if (audio.stats.musicSeqIDMax <= 0) {
                            audio.shuffleStation("musicSeq");
                        }
                        //play music
                        audio.src = audio.station.musicSeq[0].music;
                        //set ads on queue
                        audio.addQueue(audio.station.musicSeq[0], "outro");
                        //remove similar music
                        audio.removeDuplicates(audio.station.musicSeq[0].music);
                    };
                    //chk if station has commercial then select commercial
                    if (audio.station.queue.length > 0) {
                        forceRoute();
                    }
                    else if (audio.stats.nextCommercialIn == 0) {
                        if (audio.chk.commercial && audio.chk.commercialSeq) {
                            Math.round(Math.random()) ? commercialRoute() : commercialSeqRoute();
                        }
                        else if (audio.chk.commercial) {
                            commercialRoute();
                        }
                        else if (audio.chk.commercialSeq) {
                            commercialSeqRoute();
                        }
                        else
                            throw new Error("something went wrong playing commercial");
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
                    else {
                        if (audio.chk.musicSeq) {
                            Math.round(Math.random()) ? musicRoute() : musicSeqRoute();
                        }
                        else
                            musicRoute();
                    }
                    audio.nowPlaying = {
                        currentTime: new Date().getTime() / 1000,
                    };
                    if (!standby) {
                        audio.load();
                        audio.play();
                    }
                },
                removeDuplicates: (src) => {
                    audio.station.played.unshift(src);
                    let musicArr = audio.station.music;
                    for (let i = 0; i < musicArr.length; i++) {
                        if (musicArr[i] == src) {
                            audio.station.music.splice(i, 1);
                            audio.stats.musicIDMax--;
                            // console.log("match found")
                            break;
                        }
                    }
                    if (audio.chk.commercial) {
                        let commercialArr = audio.station.commercial;
                        for (let i = 0; i < commercialArr.length; i++) {
                            if (commercialArr[i] == src) {
                                audio.station.commercial.splice(i, 1);
                                audio.stats.commercialIDMax--;
                                break;
                            }
                        }
                    }
                    if (audio.chk.musicSeq) { //music then ads || intro, commercial
                        let musicSeqArr = audio.station.musicSeq;
                        for (let i = musicSeqArr.length - 1; i >= 0; i--) {
                            if (musicSeqArr[i].music == src || musicSeqArr[i].outro == src) {
                                audio.station.musicSeq.splice(i, 1);
                                audio.stats.musicSeqIDMax--;
                            }
                        }
                    }
                    if (audio.chk.commercialSeq) { //ads then music || intro, music
                        let commercialSeqArr = audio.station.commercialSeq;
                        for (let i = commercialSeqArr.length - 1; i >= 0; i--) {
                            if (commercialSeqArr[i].music == src || commercialSeqArr[i].intro == src) {
                                audio.station.commercialSeq.splice(i, 1);
                                audio.stats.commercialSeqIDMax--;
                            }
                        }
                    }
                    // console.log(audio.stats)
                },
                addQueue: (list, type) => {
                    console.log("fix data types of addQueue {intro,audio,outro}");
                    let req;
                    if (type) {
                        req = list[type];
                    }
                    else
                        req = list;
                    audio.station.played.length = 10; //preserves record of played audio
                    if (typeof req == "string") {
                        audio.station.queue.push(req);
                    }
                    else if (Array.isArray(req)) {
                        console.log(req);
                        let backupAud;
                        if (list.max && list.max > 1) { //get number between 1 and req.max
                            console.log("length now LIMITED");
                            backupAud = req[Math.floor(Math.random() * list.max) + 1];
                            req.length = Math.floor(Math.random() * list.max) + 1;
                        }
                        if (!list.repeat && list.length != 1) { //remove dupes
                            console.log("REMOVED DUPLICATES");
                            for (let i = req.length - 1; i >= 0; i--) {
                                if (audio.station.played.includes(req[i])) {
                                    req.splice(i, 1);
                                }
                            }
                            if (req.length == 0) { //add backupAud incase of no aud remaining
                                alert("LIST IS EMPTY!!!");
                                console.log("backup ADDED");
                                req.push(backupAud);
                            }
                        }
                        if (list.random) { //shuffle array
                            console.log("randomized");
                            audio.shuffleArray(req);
                        }
                        if (list.end) { // add outro 
                            console.log("end added");
                            if (Array.isArray(list.end)) {
                                req.push(list.end[Math.floor(Math.random() * list.end.length)]);
                            }
                            else if (typeof list.end == "string") {
                                req.push(list.end);
                            }
                        }
                        for (let i = req.length - 1; i >= 0; i--) { //remove undefined items
                            if (req[i] == undefined) {
                                console.log("undefined removed!");
                                req.splice(i, 1);
                            }
                        }
                        console.log(req);
                        audio.station.queue = [...req, ...audio.station.queue];
                    }
                },
                //------------------------- RESET SYSTEM -----------------------------
                // for all or specific reshuffle
                // overwrites audio.station by using new array from audio.stationBackup
                shuffleStation: (type) => {
                    let times = Math.floor(Math.random() * 1 * 3) + 1;
                    // let list2 =  type == "music" ? audio.stationBackup["music"] :
                    //             type == "commercial" ? audio.stationBackup["commercial"] :
                    //             type == "commercialSeq" ? audio.stationBackup["commercialSeq"] :
                    //             type == "musicSeq" ? audio.stationBackup["musicSeq"] : undefined
                    let list = Object.values(audio.stationBackup[type]);
                    if (list) {
                        for (let a = times; a > 0; a--) {
                            // console.log("shuffled station")
                            for (let i = list.length - 1; i >= 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [list[i], list[j]] = [list[j], list[i]];
                            }
                        }
                        Object.assign(audio.stats, { [type + "IDMax"]: list.length });
                        Object.assign(audio.station, { [type]: [...list] });
                    }
                    else
                        throw new Error("select appropriate station type to shuffle");
                },
                shuffleStations: () => {
                    let times = Math.floor(Math.random() * 1 * 3) + 1;
                    let keys = Object.keys(audio.station);
                    // let values = Object.values(audio.station)
                    for (let i = 0; i < keys.length; i++) {
                        let list = audio.stationBackup[keys[i]];
                        if (Array.isArray(list)) { //only shuffles MUSIC, COMMERCIAL, COMMERCIALSEQ, MUSICSEQ
                            for (let a = times; a > 0; a--) {
                                // console.log("shuffled stations")
                                for (let i = list.length - 1; i >= 0; i--) {
                                    const j = Math.floor(Math.random() * (i + 1));
                                    [list[i], list[j]] = [list[j], list[i]];
                                }
                            }
                            Object.assign(audio.stats, { [keys[i] + "IDMax"]: audio.stationBackup[keys[i]].length - 1 });
                            Object.assign(audio.station, { [keys[i]]: [...list] });
                        }
                    }
                },
                shuffleArray: (array) => {
                    for (let i = array.length - 1; i >= 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                },
                //------------------------- EVENT SYSTEM -----------------------------
                // chk current time first and see if audio.nowPlaying has expired
                playStation: (e) => {
                    if (this.isInterupted) {
                        e.stopImmediatePropagation();
                    }
                    audio.dispatchEvent(this.radioPlay);
                    console.log("PLAYING");
                    let cTime = (new Date().getTime()) / 1000;
                    let timePassed = cTime - audio.nowPlaying.currentTime;
                    audio.currentTime = timePassed + audio.currentTime;
                },
                pauseStation: (e) => {
                    if (this.isInterupted) {
                        e.stopImmediatePropagation();
                    }
                    audio.dispatchEvent(this.radioPause);
                    console.log("PAUSING");
                    audio.nowPlaying = {
                        currentTime: new Date().getTime() / 1000, //will be used to subtract current Time and added
                    };
                },
                endStation: () => {
                    console.log("ENDED");
                    audio.dispatchEvent(this.radioEnd);
                    audio.nowPlaying = {
                        currentTime: new Date().getTime() / 1000, //will be used to subtract current Time and added
                    };
                    let delay = (Math.floor(Math.random() * 2) + 1) * 250;
                    console.log("delayed for:" + delay + "ms");
                    setTimeout(() => {
                        if (audio.currentTime == audio.duration && !this.isInterupted) {
                            console.log("nextStationAudio fired");
                            audio.nextStationAudio();
                        }
                    }, delay);
                },
                waitStation: () => {
                    console.log("WAITING");
                    audio.dispatchEvent(this.radioWait);
                },
                nextStationAudio: () => {
                    if (!this.isInterupted) {
                        audio.randomizePlay();
                    }
                },
            });
            audio.addEventListener("play", audio.playStation);
            audio.addEventListener("pause", audio.pauseStation);
            audio.addEventListener("ended", audio.endStation);
            audio.addEventListener("wait", audio.waitStation);
            audio.addEventListener("radioPlay", this.onRadioPlay);
            audio.addEventListener("radioPause", this.onRadioPause);
            audio.addEventListener("radioWait", this.onRadioWait);
            audio.addEventListener("radioEnd", this.onRadioEnd);
            this.appendChild(audio);
            this.stationPlayers.push(audio); //saves to list of player stations in radio-player
            // ------------------- INITIAL SETUP FIRED -------------------
            audio.shuffleStations();
            audio.randomizePlay(true);
            // console.log(station)
            resolve();
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
                this.stationPlayers[this.cStation].volume = volume.value / 100;
                stationName.textContent = this.stations[this.cStation].name;
            }
            else {
                this.stationPlayers[this.cStation].pause();
                this.stationPlayers[this.cStation + 1].play();
                this.stationPlayers[this.cStation + 1].volume = volume.value / 100;
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
                this.stationPlayers[limit].volume = volume.value / 100;
                stationName.textContent = this.stations[limit].name;
                this.cStation = limit;
            }
            else {
                this.stationPlayers[this.cStation].pause();
                this.stationPlayers[this.cStation - 1].play();
                this.stationPlayers[this.cStation - 1].volume = volume.value / 100;
                stationName.textContent = this.stations[this.cStation - 1].name;
                this.cStation = this.cStation - 1;
            }
        };
        let onVolumeChange = () => {
            // console.log(volume.value)
            this.stationPlayers[this.cStation].volume = volume.value / 100;
        };
        let onMuteBtn = () => {
            if (muteBtn.src == muteBtn.on) {
                muteBtn.value = this.stationPlayers[this.cStation].volume;
                this.stationPlayers[this.cStation].volume = 0;
                muteBtn.src = muteBtn.off;
            }
            else {
                this.stationPlayers[this.cStation].volume = muteBtn.value;
                muteBtn.src = muteBtn.on;
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
        // console.log("RESUME PLEASE")
        this.isInterupted = false;
        let station = this.stationPlayers[this.cStation];
        // console.log("RESUMED RESUMED RESUMED RESUMED RESUMED RESUMED RESUMED RESUMED")
        if (station.currentTime >= station.duration) {
            console.log("nextStationAudio fired");
            station.nextStationAudio();
        }
        else
            station.play();
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
HOW TO USE

1.Create a <radio-player></radio-player> tag
2.Add a property "stations":[Array of Station]
    stations = [
        {
            name:"Station1",
            music:[URLArray],
            commercial:[URLArray],
            commercialSeq:[audArray],
            musicSeq:[audArray],
            commercialFreq:{min:1,max:2}
        }
    ]



*/
/*
let synth = window.speechSynthesis
let voices = synth.getVoices()
const update = new SpeechSynthesisUtterance()
update.text = "testing"
synth.speak(update)
*/
//# sourceMappingURL=radio.js.map