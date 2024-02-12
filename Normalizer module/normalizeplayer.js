export function addNormalizePlayer(){ 
    //url change during playEvent fixed
    //fixed stacking of connect and disconnect node (only create eventListener once)
    let props = {
        async setupNormalizedPlayer(audioCtx){ //call this only

            // console.log(this.useAudioCtx())
            this.audioCtx = await this.useAudioCtx(audioCtx)
            this.srcNode = this.audioCtx.createMediaElementSource(this)
            this.gainNode = this.audioCtx.createGain()

            // this.addEventListener("emptied",()=>{console.log("fully emptied")})
            // this.addEventListener("loadstart",()=>{console.log("loading start")})
            this.addEventListener("play",this.connectNode)
            this.addEventListener("pause",this.disconnectNode)
        },
        useAudioCtx(ctx){
            return new Promise((resolve,reject)=>{
                if(!(ctx instanceof AudioContext)){
                    if(window.dfltAudioCtx){ //if universal AudCtx exist
                        resolve(window.dfltAudioCtx)
                    } else {
                        window.dfltAudioCtx = new AudioContext()
                        resolve(window.dfltAudioCtx)
                    }
                } else {
                    resolve (ctx)
                }
            })
        },
        connectNode(){
            // console.log("connecting node")
            this.gainNode.gain.value = this.getGainFromURL()
            this.srcNode.connect(this.gainNode)
            this.gainNode.connect(this.audioCtx.destination)
        },
        disconnectNode(){
            // console.log("disconnecting node")
            this.gainNode.gain.value = 1
            this.srcNode.disconnect(this.gainNode)
            this.gainNode.disconnect(this.audioCtx.destination)
        },
        getGainFromURL(){ //prevents playEvent error when URL change applied
            let url = new URL(this.src)
            let params = url.searchParams
            let gain = parseFloat(params.get("gain")) || 1
            return gain
        },
        audioCtx:null,
        srcNode:null,
        gainNode:null,
    }
    Object.assign(Audio.prototype,props)
}

/* 
Note:

if "this" is not showing... then do props={func(){}} and not props={func:()={}}
*/