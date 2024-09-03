let apiKey = "?apikey=iogqQtJaninRs4gfaSzNZ9FEXBXdPScb" //remove AAAAA at end
let locKey = "/781273"

let apiReq = {
  hourlyForecast12hrs: "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour" + locKey + apiKey + "&metric=true",
  indices1Day: "http://dataservice.accuweather.com/indices/v1/daily/1day" + locKey + apiKey,
  daily5dayForecast: "http://dataservice.accuweather.com/forecasts/v1/daily/5day" + locKey + apiKey + "&details=true&metric=true",
  currentCondition:"http://dataservice.accuweather.com/currentconditions/v1" + locKey + apiKey +"&details=true",
  get12HrlyForecast:async()=>{
    let apiResp = await fetch(apiReq.hourlyForecast12hrs)
    let res = await apiResp.json()
    let arr = []

    res.forEach(obj=>{
      arr.push({
        time:new Date(obj.DateTime).getHours(),
        iconSrc: "https://www.awxcdn.com/adc-assets/images/weathericons/" + obj.WeatherIcon+ ".svg",
        status:obj.IconPhrase,
        temperature: Math.round(obj.Temperature.Value) + "\u00B0",
        rainChance: obj.PrecipitationProbability + "\u0025"
      })
    })

    return arr //return a promise... to access files 
  },
  get5DayForecast:async()=>{
    let apiResp = await fetch(apiReq.daily5dayForecast)
    let res = await apiResp.json()
    let arr = []

    res.DailyForecasts.forEach(obj=>{
      let d = new Date(obj.Date)
      let MMDD = (d.getMonth()+1) + "-" + d.getDate()
      let date = d.toLocaleDateString(undefined,{weekday:"long"})
    
      arr.push({
        MMDD:MMDD,
        date:date,
        iconSrc:"https://www.awxcdn.com/adc-assets/images/weathericons/" + obj.Day.Icon + ".svg",
        status: obj.Day.IconPhrase,
        temperature: obj.Temperature.Maximum.Value,
        rainChance: obj.Day.PrecipitationProbability
      })
    })

    return arr //return a promise... to access files 
  },
  getCurrentCondition:async()=>{
    let apiResp = await fetch(apiReq.currentCondition)
    let res = await apiResp.json()
    let obj = {
      status: res[0].WeatherText,
      iconSrc: "https://www.awxcdn.com/adc-assets/images/weathericons/" + res[0].WeatherIcon+ ".svg",
      temp: Math.round(res[0].Temperature.Metric.Value) + "\u00B0" ,
      heatIndex: Math.round(res[0].RealFeelTemperature.Metric.Value) + "\u00B0",
      windSpeed: apiReq.getBeaufortScale(res[0].Wind.Speed.Metric.Value) ,
      uvStrength: res[0].UVIndexText,
      cloudCoverage: res[0].CloudCover + "\u0025"
    }
    console.log(obj)
    return obj
  },
  get1DayIndices:async ()=>{
    let apiResp = await fetch(apiReq.indices1Day)
    let res = await apiResp.json()

    console.log(res)
    let health = []
    let outdoor = []
    let addIndice = (obj,arr,name)=>{
      arr.push({
        name:name?name:obj.Name,
        status:obj.Category,
      })
    }
  
    for(let i=0;i<res.length;i++){
      let obj = res[i]
      
      //health
      if(obj.ID == 18) addIndice(obj,health,"Dust & Dander") //Dust & Dander chances
      if(obj.ID == 21) addIndice(obj,health,"Arthritis Pain") //Arthritis Pain chances
      if(obj.ID == 23) addIndice(obj,health,"Asthma") //Asthma chances
      if(obj.ID == 25) addIndice(obj,health,"Common Cold") //Common Cold chances
      if(obj.ID == 26) addIndice(obj,health,"Flu") //Flu chances
      if(obj.ID == 27) addIndice(obj,health,"Migraine Headache") //Migraine Headache chances
      if(obj.ID == 30) addIndice(obj,health,"Sinus Headache") //Sinus Headache chances
      if(obj.ID == 41) addIndice(obj,health,"Dehydration") //Thirst / Dehydration chances
      //outdoor
      if(obj.ID == 2) addIndice(obj,outdoor,"Excercise")  //excercise cond
      if(obj.ID == 12) addIndice(obj,outdoor,"Star visibility") //star visibility cond
      if(obj.ID == 17) addIndice(obj,outdoor,"Mosquito activity") //mosquito activity cond
      if(obj.ID == 24) addIndice(obj,outdoor,"Outdoor BBQ") //outdoor bbq cond
      if(obj.ID == 28) addIndice(obj,outdoor,"Lawn mowing") //lawn mowing cond
      if(obj.ID == 29) addIndice(obj,outdoor,"Outdoor activity") //outdoor activity cond
      if(obj.ID == 40) addIndice(obj,outdoor,"Transportation") //transportation cond
      if(obj.ID == 50) addIndice(obj,outdoor,"Clothes Drying") //clothes drying cond
    }

    console.log(health)
    console.log(outdoor)

    return {
      health:health,
      outdoor:outdoor
    }
  },
  getBeaufortScale:(i)=>{ 
    //minified version
    if (i <= 5){ return    "Calm"
    } else if (i <= 49){ return   "Breeze"
    } else if (i <= 88){ return   "Gale"
    } else if (i <= 117){ return  "Storm"
    } else if (i >= 118){ return  "Typhoon" }

    //accurate version
    // if(i<1){ return "Calm"
    // } else if (i <= 5){ return    "Light Air"
    // } else if (i <= 11){ return   "Light Breeze"
    // } else if (i <= 19){ return   "Gentle Breeze"
    // } else if (i <= 28){ return   "Moderate Breeze"
    // } else if (i <= 38){ return   "Fresh Breeze"
    // } else if (i <= 49){ return   "Strong Breeze"
    // } else if (i <= 61){ return   "Moderate Gale"
    // } else if (i <= 74){ return   "Gale"
    // } else if (i <= 88){ return   "Strong Gale"
    // } else if (i <= 102){ return  "Storm"
    // } else if (i <= 117){ return  "Violent Storm"
    // } else if (i >= 118){ return  "Hurricane" }
  },
}
setupWeather
/* 
  apiReq.get12HrlyForecast
  apiReq.get5DayForecast
  apiReq.get1DayIndices
  apiReq.getCurrentCondition
*/




/* CURRENT CONDITIONS
  WeatherText
  WeatherIcon
  Temperature.Metric.Value
  RealFeelTemperature.Metric.Value //Heat Index
  ApparentTemperature.Metric.Value //outdoorRelativeHumidity
  Wind.Speed.Metric.Status // Beaufort Scale
  UVIndex
  UVIndexText
  CloudCover
  
  ???Wind.Speed.Metric.Value
  ??????IndoorRelativeHumidity
  ??????WindChillTemperature.Metric.Value //perceived wind temp upon skin contact
*/
/* DAILY FORECAST
  Headline.EffectiveEpochDate
  Headline.Severity //0 = Unknown 1 = Significant 2 = Major 3 = Moderate 4 = Minor 5 = Minimal 6 = Insignificant 7 = Informational
  Headline.Category
  Headline.Text
  Sun.EpochRise
  Sun.EpochSet
  Moon.EpochRise
  Moon.EpochSet
  Moon.Phase
  Temp.Average* = (Temperature.Maximum.Value - Temperature.Minimum.Value)
  FeelingTemp.Average* = (RealFeelTemperature.Maximum.Value - RealFeelTemperature.Minimum.Value)
  FeelingTempShade.Average* = (RealFeelTemperatureShade.Maximum.Value - RealFeelTemperatureShade.Minimum.Value)
  HoursOfSun
  AirAndPollen.Name //AirQuality, Grass, Mold, Tree, UVIndex
  AirAndPollen.Category

  Day / Night
  Day/Night.Icon
  Day/Night.IconPhrase
  Day/Night.HasPrecipitation
  Day/Night.PrecipitationProbability
  Day/Night.PrecipitationType
  Day/Night.PrecipitationIntensity
  Day/Night.ShortPhrase
  Day/Night.LongPhrase
  Day/Night.ThunderstormProbability
  Day/Night.RainProbability
  Day/Night.Wind.Speed.Value
  Day/Night.Wind.Speed.Unit
  Day/Night.WindGust.Speed.Value
  Day/Night.WindGust.Speed.Unit
  Day/Night.Rain.Value //Rain Value
  Day/Night.HoursOfRain
  Day/Night.CloudCover
  Day/Night.RelativeHumidity.Average
*/
/* FORECAST12HRS
    EpochDateTime
    WeatherIcon
    IconPhrase
    Temperature.Value
    PrecipitationProbability
  */
/* FINAL TEMPLATE

  CurrentConditions: (General Info)--------------
  WeatherText
  WeatherIcon
  Temperature.Metric.Value
  RealFeelTemperature.Metric.Value //Heat Index
  ApparentTemperature.Metric.Value //outdoorRelativeHumidity
  Wind.Speed.Metric.Status // Beaufort Scale
  UVIndexText
  CloudCover


  Forecast12hrs: (Hourly forecast)----------------------- OR SWITCH TO vvvvvvvvvvvv
  new Date(DateTime).getHours() 
  WeatherIcon
  IconPhrase
  Temperature.Value

  PrecipitationProbability???????????

  Forecast5Days: (5 Daily forecast)-------------------------------- OR SWITCH TO vvvvvvvvvvvvvvvvvv
  new Date(DateTime.DailyForecasts[i].Date).getMonth() //1-12 Months
  new Date(DateTime.DailyForecasts[i].Date).toLocaleDateString(undefined,{weekday:"long"}) //Sun-Sat
  new Date(DateTime.DailyForecasts[i].Date).getDate() //0-31 Day
  DateTime.DailyForecasts[i].Day.Icon
  DateTime.DailyForecasts[i].Day.IconPhrase
  DateTime.DailyForecasts[i].Temperature.Maximum.Value //only 2 digits
  DateTime.DailyForecasts[i].Day.PrecipitationProbability

  Indices: (Indices 1 Day) ---------------------------------
  Health
    Arthritis Pain..
    Asthma..
    Common Cold..
    Flu..
    Migraine Headache..
    Sinus Headache..
    Dehydration..
  Outdoor
    Dust & Dander...
    Excercise...
    Star Visibility...
    Mosquito Activity...
    Outdoor BBQ...
    Lawn Mowing...
    Outdoor Activity...
    Transportation...
    Clothes Drying...



*/
