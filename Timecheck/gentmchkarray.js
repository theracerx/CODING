export function genTimechkArray(obj){


    
    let arr = []
    let d = new Date()
    let HH = d.getHours() > 12 ? d.getHours() - 12 : d.getHours() == 0 ? 12 : d.getHours()
    let MM = d.getMinutes()

    //setup Part0
    arr.push(obj.part0)
    //setup Part1
    arr.push(obj.part1[Math.floor(Math.random() * obj.part1.length)])
    //setup Part2
    if(MM != 0){
        let rnd = Math.floor(Math.random() * 2) 
        /* 
            if rnd = 0, use all numbers ex 5 03
            instead of 3 minutes past 5 oclock
        */

        if(MM <= 15 && !rnd){ //ex 5:03 3 minutes past 5 oclock
            arr.push(obj.part2MinutePhrase[MM-1]) //3 minutes
            arr.push(Math.floor(Math.random() * 2) ? obj.part2Misc[0] : obj.part2Misc[2])//after || past
            arr.push(obj.part2HourPhrase[HH-1])//5 oclock
        } else if (MM >= 45 && !rnd){ //ex 5:53 7 minutes before 6 oclock
            arr.push(obj.part2MinutePhrase[59 - MM]) //7 minutes
            arr.push(obj.part2Misc[1])//before
            arr.push(obj.part2HourPhrase[HH == 12 ? 0 : HH + 1])//6 oclock (THIS IS CORRECT)
                //if 12:53 then it must be part2HourPhrase[0]
        } else { // for time mostly between 16-44 minutes
            arr.push(obj.part2Hours[HH-1])
            arr.push(obj.part2Minutes[MM-1])
        }
    } else arr.push(obj.part2HourPhrase[HH - 1]) //fixed for hourly update
    //setup Part3
    if(d.getHours() >= 5 && d.getHours() < 12){ //morning
        arr.push(obj.part3[2])
    } else if (d.getHours() >= 12 && d.getHours() < 18){ //afternoon
        arr.push(obj.part3[0])
    } else if (d.getHours() >= 18 && d.getHours() < 20){ //evening
        arr.push(obj.part3[1])
    } else { //night
        arr.push(obj.part3[3])
    }
    //setup Part4
    arr.push(obj.part4)

    return arr
}
