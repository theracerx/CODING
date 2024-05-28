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
                musicIntroSeq:[audArray],
                musicOutroSeq:[audArray],
                commercialFreq:{min:1,max:2}
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
        console.log("TODO: add custom base audio level on start");
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
                        if (type != "queue")
                            audio.stats[type + "IDMax"]--; //since "queue doesn't have stats"
                        if (["music", "musicIntroSeq", "musicOutroSeq"].includes(type))
                            audio.stats.nextCommercialIn--;
                    }
                },
                //------------------------- PLAY SYSTEM -----------------------------
                // randomizePlay is used to decide when to play each category and reset/shuffle if max reached
                // console.log("TO DO: fix rate of commercial played vs music")
                randomizePlay: async (standby) => {
                    return new Promise(async (resolve) => {
                        let forceRoute = () => {
                            console.log("-----------------Force Route-----------------");
                            audio.src = audio.station.queue[0];
                            audio.updateStats(audio.station.queue[0], "queue");
                        };
                        let musicRoute = async () => {
                            console.log("-----------------Music Route-----------------");
                            if (audio.stats.musicIDMax <= 0) {
                                console.log(">>>>>>>>>>>>>>>>>Music Reset<<<<<<<<<<<<<<<<<");
                                await audio.shuffleStationType("music");
                            }
                            let src = audio.station.music[0];
                            audio.src = audio.station.music[0];
                            audio.updateStats(src, "music");
                        };
                        let commercialRoute = async () => {
                            console.log("-----------------Commercial Route-----------------");
                            if (audio.stats.commercialIDMax <= 0) {
                                console.log(">>>>>>>>>>>>>>>>>Commercial Reset<<<<<<<<<<<<<<<<<");
                                await audio.shuffleStationType("commercial");
                            }
                            let src = audio.station.commercial[0];
                            audio.src = src;
                            audio.updateStats(src, "commercial");
                        };
                        let musicIntroSeqRoute = async () => {
                            console.log("-----------------musicIntroSeq Route-----------------");
                            if (audio.stats.musicIntroSeqIDMax <= 0) {
                                console.log(">>>>>>>>>>>>>>>>>musicIntroSeq Reset<<<<<<<<<<<<<<<<<");
                                await audio.shuffleStationType("musicIntroSeq");
                            }
                            let src = audio.station.musicIntroSeq[0];
                            audio.src = src.intro.toString();
                            audio.queueAudio(src.music);
                            audio.updateStats(src.intro, "musicIntroSeq");
                        };
                        let musicOutroSeqRoute = () => {
                            return new Promise(async (resolve) => {
                                console.log("-----------------musicOutroSeq Route-----------------");
                                if (audio.stats.musicOutroSeqIDMax == 0) {
                                    console.log(">>>>>>>>>>>>>>>>>musicOutroSeq Reset<<<<<<<<<<<<<<<<<");
                                    await audio.shuffleStationType("musicOutroSeq");
                                }
                                //play music
                                let src = audio.station.musicOutroSeq[0];
                                audio.src = src.music.toString();
                                audio.queueAudio(src.outro);
                                audio.updateStats(src.music, "musicOutroSeq");
                                resolve();
                            });
                        };
                        let sponsorshipRoute = async () => {
                            console.log("-----------------sponsorship Route-----------------");
                            if (audio.stats.musicIntroSeqIDMax <= 0) {
                                console.log(">>>>>>>>>>>>>>>>>sponsorship Reset<<<<<<<<<<<<<<<<<");
                                await audio.shuffleStationType("sponsorship");
                            }
                            let src = audio.station.sponsorship[0];
                            // console.log("SPONSOR TIME")
                            // console.log(src)
                            audio.src = src.intro.toString();
                            audio.queueAudio(src.sponsor);
                            if (src.end) {
                                audio.queueAudio(src.end);
                            }
                            audio.updateStats(src.intro, "sponsorship");
                        };
                        audio.nowPlaying = {
                            currentTime: new Date().getTime() / 1000,
                        };
                        //chk if station has commercial then select commercial
                        if (audio.station.queue.length > 0) {
                            forceRoute();
                        }
                        else if (audio.stats.nextCommercialIn == 0) {
                            let cond1 = audio.chk.commercial;
                            let cond2 = audio.chk.sponsorship;
                            let cond3 = Math.round(Math.random());
                            if (cond1 && cond2 && cond3) {
                                await (audio.selectRandomFromArr([commercialRoute, sponsorshipRoute]))();
                            }
                            else if (cond1 && cond2) {
                                await commercialRoute();
                            }
                            else {
                                cond1 ? await commercialRoute() : await sponsorshipRoute();
                            }
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
                            let cond1 = audio.chk.music;
                            let cond2 = audio.chk.musicIntroSeq;
                            let cond3 = audio.chk.musicOutroSeq;
                            if (cond1 && cond2 && cond3) {
                                await (audio.selectRandomFromArr([musicRoute, musicIntroSeqRoute, musicOutroSeqRoute]))();
                            }
                            else if (cond1 && cond2) {
                                await (audio.selectRandomFromArr([musicRoute, musicIntroSeqRoute]))();
                            }
                            else if (cond1 && cond3) {
                                await (audio.selectRandomFromArr([musicRoute, musicOutroSeqRoute]))();
                            }
                            else if (cond2 && cond3) {
                                await (audio.selectRandomFromArr([musicIntroSeqRoute, musicOutroSeqRoute]))();
                            }
                            else {
                                cond1 ?
                                    await musicRoute() :
                                    cond2 ?
                                        await musicIntroSeqRoute() : await musicOutroSeqRoute();
                            }
                        }
                        if (!standby) {
                            audio.load();
                            audio.play();
                        }
                    });
                },
                removeDuplicates: (src) => {
                    //Note: Only removes music type
                    if (audio.chk.music) {
                        let musicArr = audio.station.music;
                        for (let i = 0; i < musicArr.length; i++) {
                            if (musicArr[i] == src) {
                                audio.station.music.splice(i, 1);
                                audio.stats.musicIDMax--;
                                // console.log("match found")
                                break;
                            }
                        }
                    }
                    if (audio.chk.musicOutroSeq) { //music then ads || intro, commercial
                        let musicOutroSeqArr = audio.station.musicOutroSeq;
                        for (let i = musicOutroSeqArr.length - 1; i >= 0; i--) {
                            if (musicOutroSeqArr[i].music == src) {
                                audio.station.musicOutroSeq.splice(i, 1);
                                audio.stats.musicOutroSeqIDMax--;
                            }
                        }
                    }
                    if (audio.chk.musicIntroSeq) { //ads then music || intro, music
                        let musicIntroSeqArr = audio.station.musicIntroSeq;
                        for (let i = musicIntroSeqArr.length - 1; i >= 0; i--) {
                            if (musicIntroSeqArr[i].music == src) {
                                audio.station.musicIntroSeq.splice(i, 1);
                                audio.stats.musicIntroSeqIDMax--;
                            }
                        }
                    }
                    // console.log(audio.stats)
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
                        // let list2 =  type == "music" ? audio.stationBackup["music"] :
                        //             type == "commercial" ? audio.stationBackup["commercial"] :
                        //             type == "musicIntroSeq" ? audio.stationBackup["musicIntroSeq"] :
                        //             type == "musicOutroSeq" ? audio.stationBackup["musicOutroSeq"] : undefined
                        // console.log(type)
                        // console.log(audio.station.name)
                        // console.log(audio.stationBackup)
                        // console.log(audio.stationBackup.musicIntroSeq)
                        let list = Object.values(audio.stationBackup[type]);
                        // let list:any[] = [...audio.stationBackup[type]]
                        // console.log(list)
                        if (list) {
                            for (let a = times; a > 0; a--) {
                                // console.log("shuffled station")
                                for (let i = list.length - 1; i >= 0; i--) {
                                    const j = Math.floor(Math.random() * (i + 1));
                                    [list[i], list[j]] = [list[j], list[i]];
                                }
                            }
                            // console.log(list)
                            if (type == "musicOutroSeq") {
                                /* goal make sure each music has its own outro
    
                                    [outro1,outro2] : music1
                                    outro1 : [music1,music2]
    
                                    [outro1,outro2,outro3] : [music1,music2]
                                    [outro1,outro2] : [music1,music2,music3]
                                    [outro1,outro2] : [music1,music2]
                                */
                                let musicOutroSeqArr = [...list];
                                list.length = 0;
                                let methods = {
                                    outroStrMusicStr: (obj) => {
                                        list.push({
                                            music: obj.music,
                                            outro: obj.outro
                                        });
                                    },
                                    outroStrMusicArr: (obj) => {
                                        let musicArr = [...obj.music];
                                        musicArr.forEach((music) => {
                                            list.push({
                                                music: music,
                                                outro: obj.outro
                                            });
                                        });
                                    },
                                    outroArrMusicStr: (obj) => {
                                        let outroArr = [...obj.outro];
                                        list.push({
                                            music: obj.music,
                                            outro: audio.selectRandomFromArr(outroArr)
                                        });
                                    },
                                    outroArrMusicArrOpt1: (obj) => {
                                        let musicArr = [...obj.music];
                                        let outroArr = [...obj.outro];
                                        musicArr.forEach((music) => {
                                            list.push({
                                                music: music,
                                                outro: audio.selectRandomFromArr(outroArr)
                                            });
                                        });
                                    },
                                    outroArrMusicArrOpt2: (obj) => {
                                        let musicArr = [...obj.music];
                                        let outroArr = [...obj.outro];
                                        musicArr.forEach((music) => {
                                            let nObj = {
                                                music: music,
                                                outro: audio.selectRandomFromArr(outroArr)
                                            };
                                            list.push(nObj);
                                            outroArr.splice(outroArr.indexOf(nObj.outro), 1);
                                        });
                                    }
                                };
                                musicOutroSeqArr.forEach((obj) => {
                                    if (!Array.isArray(obj.music)) {
                                        if (Array.isArray(obj.outro)) {
                                            methods.outroArrMusicStr(obj); //[outro1,outro2] : music1
                                        }
                                        else
                                            methods.outroStrMusicStr(obj); // outro1 : music1
                                    }
                                    else {
                                        if (!Array.isArray(obj.outro)) { //outro1 : [music1,music2]
                                            methods.outroStrMusicArr(obj);
                                        }
                                        else {
                                            let mL = obj.music.length;
                                            let oL = obj.outro.length;
                                            if (oL < mL) { // [outro1,outro2] : [music1,music2,music3]
                                                methods.outroArrMusicArrOpt1(obj);
                                            }
                                            else if (oL > mL || oL == mL) { // [outro1,outro2,outro3] : [music1,music2] OR [outro1,outro2] : [music1,music2]
                                                methods.outroArrMusicArrOpt2(obj);
                                            }
                                        }
                                    }
                                });
                                await audio.shuffleArray(list);
                                await audio.preventRepeatAfterShuffle(list, type);
                                await audio.verifyArray(list, type);
                            }
                            else if (type == "musicIntroSeq") {
                                /* goal make sure each intro has its own music

                                    intro[],music[],end?[],repeat?,random?,max?
    
                                    [intro1,intro2] : music1
                                    intro1 : [music1,music2]
    
                                    [intro1,intro2,intro3] : [music1,music2]
                                    [intro1,intro2] : [music1,music2,music3]
                                    [intro1,intro2] : [music1,music2]
                                */
                                let musicIntroSeqArr = [...list];
                                list.length = 0;
                                let methods = {
                                    introStrMusicStr: (obj) => {
                                        list.push({
                                            music: obj.music,
                                            intro: obj.intro
                                        });
                                    },
                                    introStrMusicArr: (obj) => {
                                        let musicArr = [...obj.music];
                                        musicArr.forEach((music) => {
                                            list.push({
                                                music: music,
                                                intro: obj.intro
                                            });
                                        });
                                    },
                                    introArrMusicStr: (obj) => {
                                        let introArr = [...obj.intro];
                                        list.push({
                                            music: obj.music,
                                            intro: audio.selectRandomFromArr(introArr)
                                        });
                                    },
                                    introArrMusicArrOpt1: (obj) => {
                                        let musicArr = [...obj.music];
                                        let introArr = [...obj.intro];
                                        musicArr.forEach((music) => {
                                            list.push({
                                                music: music,
                                                intro: audio.selectRandomFromArr(introArr)
                                            });
                                        });
                                    },
                                    introArrMusicArrOpt2: (obj) => {
                                        let musicArr = [...obj.music];
                                        let introArr = [...obj.intro];
                                        musicArr.forEach((music) => {
                                            let nObj = {
                                                music: music,
                                                intro: audio.selectRandomFromArr(introArr)
                                            };
                                            list.push(nObj);
                                            introArr.splice(introArr.indexOf(nObj.intro), 1);
                                        });
                                    }
                                };
                                musicIntroSeqArr.forEach((obj) => {
                                    if (!Array.isArray(obj.music)) {
                                        if (Array.isArray(obj.intro)) {
                                            methods.introArrMusicStr(obj); //[intro1,intro2] : music1
                                        }
                                        else
                                            methods.introStrMusicStr(obj); //intro1 : music1
                                    }
                                    else {
                                        //normal intro:music assignment
                                        if (!Array.isArray(obj.intro)) { // intro1 : [music1,music2]
                                            methods.introStrMusicArr(obj);
                                        }
                                        else {
                                            let mL = obj.music.length;
                                            let iL = obj.intro.length;
                                            if (iL < mL) { // [intro1,intro2] : [music1,music2,music3]
                                                methods.introArrMusicArrOpt1(obj);
                                            }
                                            else if (iL > mL || iL == mL) { // [intro1,intro2,intro3] : [music1,music2] OR [intro1,intro2] : [music1,music2]
                                                methods.introArrMusicArrOpt2(obj);
                                            }
                                        }
                                    }
                                });
                                await audio.shuffleArray(list);
                                await audio.preventRepeatAfterShuffle(list, type);
                                await audio.verifyArray(list, type);
                            }
                            else if (type == "sponsorship") {
                                let sponsorhipArr = [...list];
                                list.length = 0;
                                let methods = {
                                    introStrSponsorStr: (obj) => {
                                        list.push({
                                            sponsor: obj.sponsor,
                                            intro: obj.intro,
                                            end: Array.isArray(obj.end) ? audio.selectRandomFromArr(obj.end) : obj.end
                                        });
                                    },
                                    introArrSponsorStr: (obj) => {
                                        let introArr = [...obj.intro];
                                        list.push({
                                            sponsor: obj.sponsor,
                                            intro: audio.selectRandomFromArr(introArr),
                                            end: Array.isArray(obj.end) ? audio.selectRandomFromArr(obj.end) : obj.end
                                        });
                                    },
                                    introStrSponsorArr: (obj) => {
                                        let sponsorArr = [...obj.sponsor];
                                        let sL = obj.sponsor.length;
                                        if (obj.max) {
                                            if (obj.max <= sL) {
                                                let limit = Math.floor(Math.random() * obj.max) + 1;
                                                let limitedSponsorArr = audio.selectRandomsFromArr(sponsorArr, limit);
                                                let nObj = {
                                                    sponsor: limitedSponsorArr,
                                                    intro: obj.intro,
                                                    end: Array.isArray(obj.end) ? audio.selectRandomFromArr(obj.end) : obj.end
                                                };
                                                list.push(nObj);
                                            }
                                            else { //ignores obj.max
                                                console.log("obj.max ignored");
                                                let limit = Math.floor(Math.random() * sL) + 1;
                                                let limitedSponsorArr = audio.selectRandomsFromArr(sponsorArr, limit);
                                                let nObj = {
                                                    sponsor: limitedSponsorArr,
                                                    intro: obj.intro,
                                                    end: Array.isArray(obj.end) ? audio.selectRandomFromArr(obj.end) : obj.end
                                                };
                                                list.push(nObj);
                                            }
                                        }
                                        else {
                                            list.push({
                                                sponsor: obj.sponsor,
                                                intro: obj.intro,
                                                end: Array.isArray(obj.end) ? audio.selectRandomFromArr(obj.end) : obj.end
                                            });
                                        }
                                    },
                                    introArrSponsorArrOpt1: (obj) => {
                                        let sponsorArr = [...obj.sponsor];
                                        let introArr = [...obj.intro];
                                        let iL = introArr.length;
                                        let sL = sponsorArr.length;
                                        let defaultFunc = () => {
                                            introArr.forEach((intro) => {
                                                let nObj = {
                                                    sponsor: audio.selectRandomsFromArr(sponsorArr, Math.floor(sL / iL)),
                                                    intro: intro,
                                                    end: Array.isArray(obj.end) ? audio.selectRandomFromArr(obj.end) : obj.end
                                                };
                                                list.push(nObj);
                                                nObj.sponsor.forEach((sponsor) => {
                                                    sponsorArr.splice(sponsorArr.indexOf(sponsor), 1);
                                                });
                                            });
                                        };
                                        // [intro1,intro2]:[music1,music2,music3]
                                        // if obj.max > SL && (max * iL) <= sL GOOD
                                        // if obj.max < SL BAD
                                        if (obj.max) {
                                            if (obj.max <= sL && (obj.max * iL) <= sL) {
                                                introArr.forEach((intro) => {
                                                    let nObj = {
                                                        sponsor: audio.selectRandomsFromArr(sponsorArr, obj.max),
                                                        intro: intro,
                                                        end: Array.isArray(obj.end) ? audio.selectRandomFromArr(obj.end) : obj.end
                                                    };
                                                    list.push(nObj);
                                                    nObj.sponsor.forEach((sponsor) => {
                                                        sponsorArr.splice(sponsorArr.indexOf(sponsor), 1);
                                                    });
                                                });
                                            }
                                            else {
                                                console.log("obj.max ignored");
                                                console.error({
                                                    obj: obj,
                                                    issue: "obj.max must be less than or equal obj.sponsor.length",
                                                    issue2: "obj.max must be distribute to each intro to have equal sponsors",
                                                    issue3: "obj.max times intro must be less than or equal to sponsorArr"
                                                });
                                                defaultFunc();
                                            }
                                        }
                                        else
                                            defaultFunc();
                                    },
                                    introArrSponsorArrOpt2: (obj) => {
                                        // [intro1,intro2,intro3] : [music1,music2]
                                        let sponsorArr = [...obj.sponsor];
                                        let introArr = [...obj.intro];
                                        let sL = obj.sponsor.length;
                                        let defaultFunc = () => {
                                            let limit = Math.floor(Math.random() * sL) + 1;
                                            let limitedIntroArr = audio.selectRandomsFromArr(introArr, Math.floor(Math.random() * sL) + 1);
                                            limitedIntroArr.forEach((intro) => {
                                                let nObj = {
                                                    sponsor: audio.selectRandomsFromArr(sponsorArr, Math.floor(sL / limit)),
                                                    intro: intro,
                                                    end: Array.isArray(obj.end) ? audio.selectRandomFromArr(obj.end) : obj.end
                                                };
                                                list.push(nObj);
                                                nObj.sponsor.forEach((sponsor) => {
                                                    sponsorArr.splice(sponsorArr.indexOf(sponsor), 1);
                                                });
                                            });
                                        };
                                        defaultFunc();
                                    },
                                    introArrSponsorArrOpt3: (obj) => {
                                        let introArr = [...obj.intro];
                                        let sponsorArr = [...obj.sponsor];
                                        introArr.forEach((intro) => {
                                            let nObj = {
                                                sponsor: audio.selectRandomFromArr(sponsorArr),
                                                intro: intro,
                                                end: Array.isArray(obj.end) ? audio.selectRandomFromArr(obj.end) : obj.end
                                            };
                                            list.push(nObj);
                                            nObj.sponsor.forEach((sponsor) => {
                                                sponsorArr.splice(sponsorArr.indexOf(sponsor), 1);
                                            });
                                        });
                                    },
                                };
                                sponsorhipArr.forEach((obj) => {
                                    /*
                                        intro:string | string[]
                                        music:string | string[]
                                        end?:string | string[]
                                        repeat?:any
                                        random?:any
                                        max?:any
                                    */
                                    if (!Array.isArray(obj.sponsor)) {
                                        if (Array.isArray(obj.intro)) {
                                            methods.introArrSponsorStr(obj); //[intro1,intro2] : music1
                                        }
                                        else
                                            methods.introStrSponsorStr(obj); //intro1 : music1
                                    }
                                    else {
                                        // intro, sponsor[], end || end[]
                                        if (!Array.isArray(obj.intro)) {
                                            methods.introStrSponsorArr(obj);
                                        }
                                        else { //intro[], sponsor[], end || end[]
                                            let sL = obj.sponsor.length;
                                            let iL = obj.intro.length;
                                            if (iL < sL) { // [intro1,intro2]:[music1,music2,music3]
                                                methods.introArrSponsorArrOpt1(obj);
                                            }
                                            else if (iL > sL) { // [intro1,intro2,intro3] : [music1,music2]
                                                methods.introArrSponsorArrOpt2(obj);
                                            }
                                            else if (iL == sL) { // [intro1,intro2] : [music1,music2]
                                                methods.introArrSponsorArrOpt3(obj);
                                            }
                                        }
                                    }
                                });
                                await audio.shuffleArray(list);
                                await audio.preventRepeatAfterShuffle(list, type);
                                await audio.verifyArray(list, type);
                            }
                            Object.assign(audio.stats, { [type + "IDMax"]: list.length });
                            Object.assign(audio.station, { [type]: [...list] });
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
                        if (audio.chk.musicOutroSeq) {
                            // console.log("musicOutroSeq")
                            await audio.shuffleStationType("musicOutroSeq");
                        }
                        if (audio.chk.musicIntroSeq) {
                            // console.log("musicIntroSeq")
                            await audio.shuffleStationType("musicIntroSeq");
                        }
                        if (audio.chk.sponsorship) {
                            // console.log("sponsorhip")
                            await audio.shuffleStationType("sponsorship");
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
                verifyArray: (array, type) => {
                    return new Promise((resolve) => {
                        if (type == "musicOutroSeq") {
                            array.forEach((item) => {
                                if (!item.music) {
                                    alert("Incomplete obj detected");
                                    console.log(item);
                                }
                                else if (!item.outro) {
                                    alert("Incomplete obj detected");
                                    console.log(item);
                                }
                            });
                        }
                        else if (type == "musicIntroSeq") {
                            array.forEach((item) => {
                                if (!item.music) {
                                    alert("Incomplete obj detected");
                                    console.log(item);
                                }
                                else if (!item.intro) {
                                    alert("Incomplete obj detected");
                                    console.log(item);
                                }
                            });
                        }
                        else if (type == "sponsorship") {
                            array.forEach((item) => {
                                if (!item.sponsor) {
                                    alert("Incomplete obj detected");
                                    console.log(item);
                                }
                                else if (!item.intro) {
                                    alert("Incomplete obj detected");
                                    console.log(item);
                                }
                            });
                        }
                        resolve();
                    });
                },
                removeDuplicatesTEST4dcrOutroBingCrosby: (array, type) => {
                    let indexs = [];
                    array.forEach((item, i) => {
                        // let trgt = item[type]
                        array.forEach((item2, i2) => {
                            if (item2[type] == item[type]) {
                            }
                        });
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

1.Create a <radio-player></radio-player> tag
2.Add a property "stations":[Array of Station]
    stations = [
        {
            name:"Station1",
            music:string[],
            commercial:string[],
            musicIntroSeq:[
                intro:string | string[],
                music:string | string[]
            ],
            musicOutroSeq:[
                music:string | string[]
                outro:string | string[]
            ],
            sponsorship:[
                intro:string | string[]
                sponsor:string | string[]
                end?:string | string[]
                max?:any //restricts amount of sponsors
            ],
            commercialFreq:{min:1,max:2}
            gapless: true
        }
    ]
    
    NOTE:player will only play same "music" audio once per shuffle
*/
/*
    let synth = window.speechSynthesis
    let voices = synth.getVoices()
    const update = new SpeechSynthesisUtterance()
    update.text = "testing"
    synth.speak(update)
*/
/*


850
60
30
10
3
1153




*/ 
//# sourceMappingURL=radio.js.map