//for normalizing audio without modifying the src but by use of AudioContext gain node only


normalizeGainFinder
    1.  Place link to be normalized on SRC textbar, then Submit or press Enter
    2.  Compare difference of Original and Normalized Version
    3.  You can modify gain on the Gain textBar, then Submit or press Enter
    4.  You can now copy the new URL to be used on your normalizePlayer audio TAG Element

normalizePlayer
    1. Import "addNormalizePlayer" from "./normalizeplayer.js":

            import {addNormalizePlayer} from "./normalizeplayer.js"
    
    2. Then do "addNormalizePlayer()"
    3. Select the audio Element of your choice

            let audioElem = document.getElementbyId("player")

    4. Then do use method "setupNormalizedPlayer"

            audioElem.setupNormalizedPlayer()
                        OR
            audioElem.setupNormalizedPlayer(customAudioContext)
    
    5. Don't forget to use the URL copied from normalizeGainFinder

           <audio id="player" src="sample.mp3?gain=2.45" controls>

    6. The player would set default gain to 1 if it is missing in URL
