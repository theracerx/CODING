export { }

interface apiResp {
    currentCondition:{
        status:string
        iconSrc:string
        temp:string
        humidity:number
        heatIndex: string
        windSpeed:string
        uvStrength:string
        cloudCoverage:string
    }
    hourlyForecast12hrs:{
        time:string
        date:number
        dayIconSrc:string
        iconSrc:string
        status:string
        temperature:number
        heatIndex:number
        windSpeed:string
        rainChance:string
        rainValue:number
        uvIndex:string
    }[]
    daily5dayForecast:{
        MMDD:string
        date:string
        iconSrc:string
        status: string
        temperature: string
        rainChance:string
    }[]
    indices1Day:{
        health:any[]
        outdoor:any[]
    }
}


export class AccuWeather extends HTMLElement {
    apiKey:string = ""
    locKey:string = ""
    // generalCont:any = this.newElem("div",{props:{className:"generalCont"},appendTo:this})
    generalInfo1:any = this.newElem("div",{props:{className:"generalInfo1"},appendTo:this})
    generalInfo2:any = this.newElem("div",{props:{className:"generalInfo2",update:()=>{}},appendTo:this})
    generalInfo3:any = this.newElem("div",{props:{className:"generalInfo3"},appendTo:this})
    hourlyForecast = this.newElem("div",{
        appendTo:this
    })
    dailyForecast = this.newElem("div",{
        appendTo:this
    })
    indicesForecast = this.newElem("div",{
        appendTo:this
    })
    apiReq = {
        hourlyForecast12hrs: "",
        indices1Day: "",
        daily5dayForecast: "",
        currentCondition: ""
    }
    data:apiResp = {
        hourlyForecast12hrs:[],
        currentCondition:{
            status:"",
            iconSrc:"",
            temp:"",
            humidity:0,
            heatIndex: "",
            windSpeed:"",
            uvStrength:"",
            cloudCoverage:"",
        },
        daily5dayForecast:[],
        indices1Day:{
            health:[],
            outdoor:[]
        }
    }
    sampCurCond = {
        "status": "Cloudy",
        "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/7.svg",
        "temp": "32°",
        "humidity": 70,
        "heatIndex": "38°",
        "windSpeed": "Breeze",
        "uvStrength": "Moderate",
        "cloudCoverage": "99%"
    }
    sampHrlyForecast = [
        {
            "time": "9PM",
            "date": 3,
            "dayIconSrc": "http://127.0.0.1:5500/Accuweather%20API/tuesday-svgrepo-com.svg",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/15.svg",
            "status": "Thunderstorms",
            "temperature": 26,
            "heatIndex": 31,
            "windSpeed": "Calm",
            "rainChance": "Low",
            "rainValue": 0.2,
            "uvIndex": "Low"
        },
        {
            "time": "10PM",
            "date": 3,
            "dayIconSrc": "http://127.0.0.1:5500/Accuweather%20API/tuesday-svgrepo-com.svg",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/15.svg",
            "status": "Thunderstorms",
            "temperature": 26,
            "heatIndex": 31,
            "windSpeed": "Calm",
            "rainChance": "Likely",
            "rainValue": 2,
            "uvIndex": "Low"
        },
        {
            "time": "11PM",
            "date": 3,
            "dayIconSrc": "http://127.0.0.1:5500/Accuweather%20API/tuesday-svgrepo-com.svg",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/7.svg",
            "status": "Cloudy",
            "temperature": 26,
            "heatIndex": 32,
            "windSpeed": "Calm",
            "rainChance": "Low",
            "rainValue": 0,
            "uvIndex": "Low"
        },
        {
            "time": "12 AM",
            "date": 4,
            "dayIconSrc": "http://127.0.0.1:5500/Accuweather%20API/wednesday-svgrepo-com.svg",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/7.svg",
            "status": "Cloudy",
            "temperature": 26,
            "heatIndex": 31,
            "windSpeed": "Calm",
            "rainChance": "Low",
            "rainValue": 0,
            "uvIndex": "Low"
        },
        {
            "time": "1AM",
            "date": 4,
            "dayIconSrc": "http://127.0.0.1:5500/Accuweather%20API/wednesday-svgrepo-com.svg",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/7.svg",
            "status": "Cloudy",
            "temperature": 25,
            "heatIndex": 31,
            "windSpeed": "Calm",
            "rainChance": "Unlikely",
            "rainValue": 0,
            "uvIndex": "Low"
        },
        {
            "time": "2AM",
            "date": 4,
            "dayIconSrc": "http://127.0.0.1:5500/Accuweather%20API/wednesday-svgrepo-com.svg",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/7.svg",
            "status": "Cloudy",
            "temperature": 26,
            "heatIndex": 31,
            "windSpeed": "Calm",
            "rainChance": "Unlikely",
            "rainValue": 0,
            "uvIndex": "Low"
        },
        {
            "time": "3AM",
            "date": 4,
            "dayIconSrc": "http://127.0.0.1:5500/Accuweather%20API/wednesday-svgrepo-com.svg",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/7.svg",
            "status": "Cloudy",
            "temperature": 26,
            "heatIndex": 31,
            "windSpeed": "Calm",
            "rainChance": "Unlikely",
            "rainValue": 0,
            "uvIndex": "Low"
        },
        {
            "time": "4AM",
            "date": 4,
            "dayIconSrc": "http://127.0.0.1:5500/Accuweather%20API/wednesday-svgrepo-com.svg",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/7.svg",
            "status": "Cloudy",
            "temperature": 26,
            "heatIndex": 31,
            "windSpeed": "Calm",
            "rainChance": "Unlikely",
            "rainValue": 0,
            "uvIndex": "Low"
        },
        {
            "time": "5AM",
            "date": 4,
            "dayIconSrc": "http://127.0.0.1:5500/Accuweather%20API/wednesday-svgrepo-com.svg",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/7.svg",
            "status": "Cloudy",
            "temperature": 26,
            "heatIndex": 31,
            "windSpeed": "Calm",
            "rainChance": "Unlikely",
            "rainValue": 0,
            "uvIndex": "Low"
        },
        {
            "time": "6AM",
            "date": 4,
            "dayIconSrc": "http://127.0.0.1:5500/Accuweather%20API/wednesday-svgrepo-com.svg",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/7.svg",
            "status": "Cloudy",
            "temperature": 26,
            "heatIndex": 31,
            "windSpeed": "Calm",
            "rainChance": "Low",
            "rainValue": 0,
            "uvIndex": "Low"
        },
        {
            "time": "7AM",
            "date": 4,
            "dayIconSrc": "http://127.0.0.1:5500/Accuweather%20API/wednesday-svgrepo-com.svg",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/7.svg",
            "status": "Cloudy",
            "temperature": 26,
            "heatIndex": 32,
            "windSpeed": "Calm",
            "rainChance": "Low",
            "rainValue": 0,
            "uvIndex": "Low"
        },
        {
            "time": "8AM",
            "date": 4,
            "dayIconSrc": "http://127.0.0.1:5500/Accuweather%20API/wednesday-svgrepo-com.svg",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/15.svg",
            "status": "Thunderstorms",
            "temperature": 27,
            "heatIndex": 33,
            "windSpeed": "Calm",
            "rainChance": "Likely",
            "rainValue": 0.5,
            "uvIndex": "Low"
        }
    ]
    sampRAWHrlyForecast =[
        [
            {
                "DateTime": "2024-09-03T21:00:00+08:00",
                "EpochDateTime": 1725368400,
                "WeatherIcon": 15,
                "IconPhrase": "Thunderstorms",
                "HasPrecipitation": true,
                "PrecipitationType": "Rain",
                "PrecipitationIntensity": "Light",
                "IsDaylight": false,
                "Temperature": {
                    "Value": 26.1,
                    "Unit": "C",
                    "UnitType": 17
                },
                "RealFeelTemperature": {
                    "Value": 30.7,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "RealFeelTemperatureShade": {
                    "Value": 30.7,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "WetBulbTemperature": {
                    "Value": 25.4,
                    "Unit": "C",
                    "UnitType": 17
                },
                "WetBulbGlobeTemperature": {
                    "Value": 25.7,
                    "Unit": "C",
                    "UnitType": 17
                },
                "DewPoint": {
                    "Value": 24.9,
                    "Unit": "C",
                    "UnitType": 17
                },
                "Wind": {
                    "Speed": {
                        "Value": 7.4,
                        "Unit": "km/h",
                        "UnitType": 7
                    },
                    "Direction": {
                        "Degrees": 241,
                        "Localized": "WSW",
                        "English": "WSW"
                    }
                },
                "WindGust": {
                    "Speed": {
                        "Value": 13,
                        "Unit": "km/h",
                        "UnitType": 7
                    }
                },
                "RelativeHumidity": 93,
                "IndoorRelativeHumidity": 93,
                "Visibility": {
                    "Value": 6.4,
                    "Unit": "km",
                    "UnitType": 6
                },
                "Ceiling": {
                    "Value": 518,
                    "Unit": "m",
                    "UnitType": 5
                },
                "UVIndex": 0,
                "UVIndexText": "Low",
                "PrecipitationProbability": 43,
                "ThunderstormProbability": 25,
                "RainProbability": 43,
                "SnowProbability": 0,
                "IceProbability": 0,
                "TotalLiquid": {
                    "Value": 0.2,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Rain": {
                    "Value": 0.2,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Snow": {
                    "Value": 0,
                    "Unit": "cm",
                    "UnitType": 4
                },
                "Ice": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "CloudCover": 100,
                "Evapotranspiration": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "SolarIrradiance": {
                    "Value": 0,
                    "Unit": "W/m²",
                    "UnitType": 33
                },
                "MobileLink": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=1&hbhhour=21&unit=c&lang=en-us",
                "Link":       "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=1&hbhhour=21&unit=c&lang=en-us"
            },
            {
                "DateTime": "2024-09-03T22:00:00+08:00",
                "EpochDateTime": 1725372000,
                "WeatherIcon": 15,
                "IconPhrase": "Thunderstorms",
                "HasPrecipitation": true,
                "PrecipitationType": "Rain",
                "PrecipitationIntensity": "Moderate",
                "IsDaylight": false,
                "Temperature": {
                    "Value": 26.3,
                    "Unit": "C",
                    "UnitType": 17
                },
                "RealFeelTemperature": {
                    "Value": 30.7,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "RealFeelTemperatureShade": {
                    "Value": 30.7,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "WetBulbTemperature": {
                    "Value": 25.5,
                    "Unit": "C",
                    "UnitType": 17
                },
                "WetBulbGlobeTemperature": {
                    "Value": 25.9,
                    "Unit": "C",
                    "UnitType": 17
                },
                "DewPoint": {
                    "Value": 25,
                    "Unit": "C",
                    "UnitType": 17
                },
                "Wind": {
                    "Speed": {
                        "Value": 7.4,
                        "Unit": "km/h",
                        "UnitType": 7
                    },
                    "Direction": {
                        "Degrees": 236,
                        "Localized": "SW",
                        "English": "SW"
                    }
                },
                "WindGust": {
                    "Speed": {
                        "Value": 13,
                        "Unit": "km/h",
                        "UnitType": 7
                    }
                },
                "RelativeHumidity": 92,
                "IndoorRelativeHumidity": 92,
                "Visibility": {
                    "Value": 6.4,
                    "Unit": "km",
                    "UnitType": 6
                },
                "Ceiling": {
                    "Value": 518,
                    "Unit": "m",
                    "UnitType": 5
                },
                "UVIndex": 0,
                "UVIndexText": "Low",
                "PrecipitationProbability": 51,
                "ThunderstormProbability": 30,
                "RainProbability": 51,
                "SnowProbability": 0,
                "IceProbability": 0,
                "TotalLiquid": {
                    "Value": 2,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Rain": {
                    "Value": 2,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Snow": {
                    "Value": 0,
                    "Unit": "cm",
                    "UnitType": 4
                },
                "Ice": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "CloudCover": 100,
                "Evapotranspiration": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "SolarIrradiance": {
                    "Value": 0,
                    "Unit": "W/m²",
                    "UnitType": 33
                },
                "MobileLink": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=1&hbhhour=22&unit=c&lang=en-us",
                "Link": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=1&hbhhour=22&unit=c&lang=en-us"
            },
            {
                "DateTime": "2024-09-03T23:00:00+08:00",
                "EpochDateTime": 1725375600,
                "WeatherIcon": 7,
                "IconPhrase": "Cloudy",
                "HasPrecipitation": false,
                "IsDaylight": false,
                "Temperature": {
                    "Value": 26.4,
                    "Unit": "C",
                    "UnitType": 17
                },
                "RealFeelTemperature": {
                    "Value": 31.8,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Hot"
                },
                "RealFeelTemperatureShade": {
                    "Value": 31.8,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Hot"
                },
                "WetBulbTemperature": {
                    "Value": 25.6,
                    "Unit": "C",
                    "UnitType": 17
                },
                "WetBulbGlobeTemperature": {
                    "Value": 25.9,
                    "Unit": "C",
                    "UnitType": 17
                },
                "DewPoint": {
                    "Value": 25,
                    "Unit": "C",
                    "UnitType": 17
                },
                "Wind": {
                    "Speed": {
                        "Value": 7.4,
                        "Unit": "km/h",
                        "UnitType": 7
                    },
                    "Direction": {
                        "Degrees": 229,
                        "Localized": "SW",
                        "English": "SW"
                    }
                },
                "WindGust": {
                    "Speed": {
                        "Value": 14.8,
                        "Unit": "km/h",
                        "UnitType": 7
                    }
                },
                "RelativeHumidity": 92,
                "IndoorRelativeHumidity": 92,
                "Visibility": {
                    "Value": 6.4,
                    "Unit": "km",
                    "UnitType": 6
                },
                "Ceiling": {
                    "Value": 518,
                    "Unit": "m",
                    "UnitType": 5
                },
                "UVIndex": 0,
                "UVIndexText": "Low",
                "PrecipitationProbability": 47,
                "ThunderstormProbability": 28,
                "RainProbability": 47,
                "SnowProbability": 0,
                "IceProbability": 0,
                "TotalLiquid": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Rain": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Snow": {
                    "Value": 0,
                    "Unit": "cm",
                    "UnitType": 4
                },
                "Ice": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "CloudCover": 100,
                "Evapotranspiration": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "SolarIrradiance": {
                    "Value": 0,
                    "Unit": "W/m²",
                    "UnitType": 33
                },
                "MobileLink": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=1&hbhhour=23&unit=c&lang=en-us",
                "Link": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=1&hbhhour=23&unit=c&lang=en-us"
            },
            {
                "DateTime": "2024-09-04T00:00:00+08:00",
                "EpochDateTime": 1725379200,
                "WeatherIcon": 7,
                "IconPhrase": "Cloudy",
                "HasPrecipitation": false,
                "IsDaylight": false,
                "Temperature": {
                    "Value": 26.1,
                    "Unit": "C",
                    "UnitType": 17
                },
                "RealFeelTemperature": {
                    "Value": 31.4,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "RealFeelTemperatureShade": {
                    "Value": 31.4,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "WetBulbTemperature": {
                    "Value": 25.5,
                    "Unit": "C",
                    "UnitType": 17
                },
                "WetBulbGlobeTemperature": {
                    "Value": 25.7,
                    "Unit": "C",
                    "UnitType": 17
                },
                "DewPoint": {
                    "Value": 24.9,
                    "Unit": "C",
                    "UnitType": 17
                },
                "Wind": {
                    "Speed": {
                        "Value": 7.4,
                        "Unit": "km/h",
                        "UnitType": 7
                    },
                    "Direction": {
                        "Degrees": 222,
                        "Localized": "SW",
                        "English": "SW"
                    }
                },
                "WindGust": {
                    "Speed": {
                        "Value": 16.7,
                        "Unit": "km/h",
                        "UnitType": 7
                    }
                },
                "RelativeHumidity": 93,
                "IndoorRelativeHumidity": 93,
                "Visibility": {
                    "Value": 6.4,
                    "Unit": "km",
                    "UnitType": 6
                },
                "Ceiling": {
                    "Value": 518,
                    "Unit": "m",
                    "UnitType": 5
                },
                "UVIndex": 0,
                "UVIndexText": "Low",
                "PrecipitationProbability": 36,
                "ThunderstormProbability": 21,
                "RainProbability": 36,
                "SnowProbability": 0,
                "IceProbability": 0,
                "TotalLiquid": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Rain": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Snow": {
                    "Value": 0,
                    "Unit": "cm",
                    "UnitType": 4
                },
                "Ice": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "CloudCover": 100,
                "Evapotranspiration": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "SolarIrradiance": {
                    "Value": 0,
                    "Unit": "W/m²",
                    "UnitType": 33
                },
                "MobileLink": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=0&unit=c&lang=en-us",
                "Link": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=0&unit=c&lang=en-us"
            },
            {
                "DateTime": "2024-09-04T01:00:00+08:00",
                "EpochDateTime": 1725382800,
                "WeatherIcon": 7,
                "IconPhrase": "Cloudy",
                "HasPrecipitation": false,
                "IsDaylight": false,
                "Temperature": {
                    "Value": 25.2,
                    "Unit": "C",
                    "UnitType": 17
                },
                "RealFeelTemperature": {
                    "Value": 30.5,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "RealFeelTemperatureShade": {
                    "Value": 30.5,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "WetBulbTemperature": {
                    "Value": 25.2,
                    "Unit": "C",
                    "UnitType": 17
                },
                "WetBulbGlobeTemperature": {
                    "Value": 25.2,
                    "Unit": "C",
                    "UnitType": 17
                },
                "DewPoint": {
                    "Value": 24.8,
                    "Unit": "C",
                    "UnitType": 17
                },
                "Wind": {
                    "Speed": {
                        "Value": 5.6,
                        "Unit": "km/h",
                        "UnitType": 7
                    },
                    "Direction": {
                        "Degrees": 223,
                        "Localized": "SW",
                        "English": "SW"
                    }
                },
                "WindGust": {
                    "Speed": {
                        "Value": 16.7,
                        "Unit": "km/h",
                        "UnitType": 7
                    }
                },
                "RelativeHumidity": 98,
                "IndoorRelativeHumidity": 95,
                "Visibility": {
                    "Value": 6.4,
                    "Unit": "km",
                    "UnitType": 6
                },
                "Ceiling": {
                    "Value": 9144,
                    "Unit": "m",
                    "UnitType": 5
                },
                "UVIndex": 0,
                "UVIndexText": "Low",
                "PrecipitationProbability": 20,
                "ThunderstormProbability": 4,
                "RainProbability": 20,
                "SnowProbability": 0,
                "IceProbability": 0,
                "TotalLiquid": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Rain": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Snow": {
                    "Value": 0,
                    "Unit": "cm",
                    "UnitType": 4
                },
                "Ice": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "CloudCover": 100,
                "Evapotranspiration": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "SolarIrradiance": {
                    "Value": 0,
                    "Unit": "W/m²",
                    "UnitType": 33
                },
                "MobileLink": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=1&unit=c&lang=en-us",
                "Link": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=1&unit=c&lang=en-us"
            },
            {
                "DateTime": "2024-09-04T02:00:00+08:00",
                "EpochDateTime": 1725386400,
                "WeatherIcon": 7,
                "IconPhrase": "Cloudy",
                "HasPrecipitation": false,
                "IsDaylight": false,
                "Temperature": {
                    "Value": 25.7,
                    "Unit": "C",
                    "UnitType": 17
                },
                "RealFeelTemperature": {
                    "Value": 31,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "RealFeelTemperatureShade": {
                    "Value": 31,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "WetBulbTemperature": {
                    "Value": 25.2,
                    "Unit": "C",
                    "UnitType": 17
                },
                "WetBulbGlobeTemperature": {
                    "Value": 25.5,
                    "Unit": "C",
                    "UnitType": 17
                },
                "DewPoint": {
                    "Value": 24.8,
                    "Unit": "C",
                    "UnitType": 17
                },
                "Wind": {
                    "Speed": {
                        "Value": 5.6,
                        "Unit": "km/h",
                        "UnitType": 7
                    },
                    "Direction": {
                        "Degrees": 224,
                        "Localized": "SW",
                        "English": "SW"
                    }
                },
                "WindGust": {
                    "Speed": {
                        "Value": 14.8,
                        "Unit": "km/h",
                        "UnitType": 7
                    }
                },
                "RelativeHumidity": 94,
                "IndoorRelativeHumidity": 94,
                "Visibility": {
                    "Value": 6.4,
                    "Unit": "km",
                    "UnitType": 6
                },
                "Ceiling": {
                    "Value": 9144,
                    "Unit": "m",
                    "UnitType": 5
                },
                "UVIndex": 0,
                "UVIndexText": "Low",
                "PrecipitationProbability": 20,
                "ThunderstormProbability": 4,
                "RainProbability": 20,
                "SnowProbability": 0,
                "IceProbability": 0,
                "TotalLiquid": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Rain": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Snow": {
                    "Value": 0,
                    "Unit": "cm",
                    "UnitType": 4
                },
                "Ice": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "CloudCover": 100,
                "Evapotranspiration": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "SolarIrradiance": {
                    "Value": 0,
                    "Unit": "W/m²",
                    "UnitType": 33
                },
                "MobileLink": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=2&unit=c&lang=en-us",
                "Link": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=2&unit=c&lang=en-us"
            },
            {
                "DateTime": "2024-09-04T03:00:00+08:00",
                "EpochDateTime": 1725390000,
                "WeatherIcon": 7,
                "IconPhrase": "Cloudy",
                "HasPrecipitation": false,
                "IsDaylight": false,
                "Temperature": {
                    "Value": 25.9,
                    "Unit": "C",
                    "UnitType": 17
                },
                "RealFeelTemperature": {
                    "Value": 31.3,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "RealFeelTemperatureShade": {
                    "Value": 31.3,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "WetBulbTemperature": {
                    "Value": 25.3,
                    "Unit": "C",
                    "UnitType": 17
                },
                "WetBulbGlobeTemperature": {
                    "Value": 25.6,
                    "Unit": "C",
                    "UnitType": 17
                },
                "DewPoint": {
                    "Value": 24.8,
                    "Unit": "C",
                    "UnitType": 17
                },
                "Wind": {
                    "Speed": {
                        "Value": 5.6,
                        "Unit": "km/h",
                        "UnitType": 7
                    },
                    "Direction": {
                        "Degrees": 219,
                        "Localized": "SW",
                        "English": "SW"
                    }
                },
                "WindGust": {
                    "Speed": {
                        "Value": 13,
                        "Unit": "km/h",
                        "UnitType": 7
                    }
                },
                "RelativeHumidity": 93,
                "IndoorRelativeHumidity": 93,
                "Visibility": {
                    "Value": 6.4,
                    "Unit": "km",
                    "UnitType": 6
                },
                "Ceiling": {
                    "Value": 7590,
                    "Unit": "m",
                    "UnitType": 5
                },
                "UVIndex": 0,
                "UVIndexText": "Low",
                "PrecipitationProbability": 20,
                "ThunderstormProbability": 4,
                "RainProbability": 20,
                "SnowProbability": 0,
                "IceProbability": 0,
                "TotalLiquid": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Rain": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Snow": {
                    "Value": 0,
                    "Unit": "cm",
                    "UnitType": 4
                },
                "Ice": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "CloudCover": 100,
                "Evapotranspiration": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "SolarIrradiance": {
                    "Value": 0,
                    "Unit": "W/m²",
                    "UnitType": 33
                },
                "MobileLink": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=3&unit=c&lang=en-us",
                "Link": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=3&unit=c&lang=en-us"
            },
            {
                "DateTime": "2024-09-04T04:00:00+08:00",
                "EpochDateTime": 1725393600,
                "WeatherIcon": 7,
                "IconPhrase": "Cloudy",
                "HasPrecipitation": false,
                "IsDaylight": false,
                "Temperature": {
                    "Value": 25.9,
                    "Unit": "C",
                    "UnitType": 17
                },
                "RealFeelTemperature": {
                    "Value": 31.4,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "RealFeelTemperatureShade": {
                    "Value": 31.4,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "WetBulbTemperature": {
                    "Value": 25.2,
                    "Unit": "C",
                    "UnitType": 17
                },
                "WetBulbGlobeTemperature": {
                    "Value": 25.5,
                    "Unit": "C",
                    "UnitType": 17
                },
                "DewPoint": {
                    "Value": 24.7,
                    "Unit": "C",
                    "UnitType": 17
                },
                "Wind": {
                    "Speed": {
                        "Value": 5.6,
                        "Unit": "km/h",
                        "UnitType": 7
                    },
                    "Direction": {
                        "Degrees": 208,
                        "Localized": "SSW",
                        "English": "SSW"
                    }
                },
                "WindGust": {
                    "Speed": {
                        "Value": 13,
                        "Unit": "km/h",
                        "UnitType": 7
                    }
                },
                "RelativeHumidity": 93,
                "IndoorRelativeHumidity": 93,
                "Visibility": {
                    "Value": 6.4,
                    "Unit": "km",
                    "UnitType": 6
                },
                "Ceiling": {
                    "Value": 488,
                    "Unit": "m",
                    "UnitType": 5
                },
                "UVIndex": 0,
                "UVIndexText": "Low",
                "PrecipitationProbability": 20,
                "ThunderstormProbability": 4,
                "RainProbability": 20,
                "SnowProbability": 0,
                "IceProbability": 0,
                "TotalLiquid": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Rain": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Snow": {
                    "Value": 0,
                    "Unit": "cm",
                    "UnitType": 4
                },
                "Ice": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "CloudCover": 100,
                "Evapotranspiration": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "SolarIrradiance": {
                    "Value": 0,
                    "Unit": "W/m²",
                    "UnitType": 33
                },
                "MobileLink": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=4&unit=c&lang=en-us",
                "Link": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=4&unit=c&lang=en-us"
            },
            {
                "DateTime": "2024-09-04T05:00:00+08:00",
                "EpochDateTime": 1725397200,
                "WeatherIcon": 7,
                "IconPhrase": "Cloudy",
                "HasPrecipitation": false,
                "IsDaylight": false,
                "Temperature": {
                    "Value": 25.9,
                    "Unit": "C",
                    "UnitType": 17
                },
                "RealFeelTemperature": {
                    "Value": 31.3,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "RealFeelTemperatureShade": {
                    "Value": 31.3,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "WetBulbTemperature": {
                    "Value": 25.2,
                    "Unit": "C",
                    "UnitType": 17
                },
                "WetBulbGlobeTemperature": {
                    "Value": 25.5,
                    "Unit": "C",
                    "UnitType": 17
                },
                "DewPoint": {
                    "Value": 24.7,
                    "Unit": "C",
                    "UnitType": 17
                },
                "Wind": {
                    "Speed": {
                        "Value": 3.7,
                        "Unit": "km/h",
                        "UnitType": 7
                    },
                    "Direction": {
                        "Degrees": 197,
                        "Localized": "SSW",
                        "English": "SSW"
                    }
                },
                "WindGust": {
                    "Speed": {
                        "Value": 11.1,
                        "Unit": "km/h",
                        "UnitType": 7
                    }
                },
                "RelativeHumidity": 93,
                "IndoorRelativeHumidity": 93,
                "Visibility": {
                    "Value": 6.4,
                    "Unit": "km",
                    "UnitType": 6
                },
                "Ceiling": {
                    "Value": 488,
                    "Unit": "m",
                    "UnitType": 5
                },
                "UVIndex": 0,
                "UVIndexText": "Low",
                "PrecipitationProbability": 20,
                "ThunderstormProbability": 4,
                "RainProbability": 20,
                "SnowProbability": 0,
                "IceProbability": 0,
                "TotalLiquid": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Rain": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Snow": {
                    "Value": 0,
                    "Unit": "cm",
                    "UnitType": 4
                },
                "Ice": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "CloudCover": 100,
                "Evapotranspiration": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "SolarIrradiance": {
                    "Value": 0,
                    "Unit": "W/m²",
                    "UnitType": 33
                },
                "MobileLink": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=5&unit=c&lang=en-us",
                "Link": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=5&unit=c&lang=en-us"
            },
            {
                "DateTime": "2024-09-04T06:00:00+08:00",
                "EpochDateTime": 1725400800,
                "WeatherIcon": 7,
                "IconPhrase": "Cloudy",
                "HasPrecipitation": false,
                "IsDaylight": true,
                "Temperature": {
                    "Value": 25.8,
                    "Unit": "C",
                    "UnitType": 17
                },
                "RealFeelTemperature": {
                    "Value": 31.2,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "RealFeelTemperatureShade": {
                    "Value": 31.2,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "WetBulbTemperature": {
                    "Value": 25.1,
                    "Unit": "C",
                    "UnitType": 17
                },
                "WetBulbGlobeTemperature": {
                    "Value": 25.4,
                    "Unit": "C",
                    "UnitType": 17
                },
                "DewPoint": {
                    "Value": 24.6,
                    "Unit": "C",
                    "UnitType": 17
                },
                "Wind": {
                    "Speed": {
                        "Value": 3.7,
                        "Unit": "km/h",
                        "UnitType": 7
                    },
                    "Direction": {
                        "Degrees": 196,
                        "Localized": "SSW",
                        "English": "SSW"
                    }
                },
                "WindGust": {
                    "Speed": {
                        "Value": 11.1,
                        "Unit": "km/h",
                        "UnitType": 7
                    }
                },
                "RelativeHumidity": 93,
                "IndoorRelativeHumidity": 93,
                "Visibility": {
                    "Value": 6.4,
                    "Unit": "km",
                    "UnitType": 6
                },
                "Ceiling": {
                    "Value": 488,
                    "Unit": "m",
                    "UnitType": 5
                },
                "UVIndex": 0,
                "UVIndexText": "Low",
                "PrecipitationProbability": 25,
                "ThunderstormProbability": 5,
                "RainProbability": 25,
                "SnowProbability": 0,
                "IceProbability": 0,
                "TotalLiquid": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Rain": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Snow": {
                    "Value": 0,
                    "Unit": "cm",
                    "UnitType": 4
                },
                "Ice": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "CloudCover": 100,
                "Evapotranspiration": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "SolarIrradiance": {
                    "Value": 1.5,
                    "Unit": "W/m²",
                    "UnitType": 33
                },
                "MobileLink": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=6&unit=c&lang=en-us",
                "Link": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=6&unit=c&lang=en-us"
            },
            {
                "DateTime": "2024-09-04T07:00:00+08:00",
                "EpochDateTime": 1725404400,
                "WeatherIcon": 7,
                "IconPhrase": "Cloudy",
                "HasPrecipitation": false,
                "IsDaylight": true,
                "Temperature": {
                    "Value": 26.3,
                    "Unit": "C",
                    "UnitType": 17
                },
                "RealFeelTemperature": {
                    "Value": 32.1,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Hot"
                },
                "RealFeelTemperatureShade": {
                    "Value": 32.1,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Hot"
                },
                "WetBulbTemperature": {
                    "Value": 25.6,
                    "Unit": "C",
                    "UnitType": 17
                },
                "WetBulbGlobeTemperature": {
                    "Value": 25.9,
                    "Unit": "C",
                    "UnitType": 17
                },
                "DewPoint": {
                    "Value": 25.1,
                    "Unit": "C",
                    "UnitType": 17
                },
                "Wind": {
                    "Speed": {
                        "Value": 5.6,
                        "Unit": "km/h",
                        "UnitType": 7
                    },
                    "Direction": {
                        "Degrees": 203,
                        "Localized": "SSW",
                        "English": "SSW"
                    }
                },
                "WindGust": {
                    "Speed": {
                        "Value": 13,
                        "Unit": "km/h",
                        "UnitType": 7
                    }
                },
                "RelativeHumidity": 93,
                "IndoorRelativeHumidity": 93,
                "Visibility": {
                    "Value": 6.4,
                    "Unit": "km",
                    "UnitType": 6
                },
                "Ceiling": {
                    "Value": 518,
                    "Unit": "m",
                    "UnitType": 5
                },
                "UVIndex": 0,
                "UVIndexText": "Low",
                "PrecipitationProbability": 47,
                "ThunderstormProbability": 28,
                "RainProbability": 47,
                "SnowProbability": 0,
                "IceProbability": 0,
                "TotalLiquid": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Rain": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Snow": {
                    "Value": 0,
                    "Unit": "cm",
                    "UnitType": 4
                },
                "Ice": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "CloudCover": 100,
                "Evapotranspiration": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "SolarIrradiance": {
                    "Value": 15.2,
                    "Unit": "W/m²",
                    "UnitType": 33
                },
                "MobileLink": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=7&unit=c&lang=en-us",
                "Link": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=7&unit=c&lang=en-us"
            },
            {
                "DateTime": "2024-09-04T08:00:00+08:00",
                "EpochDateTime": 1725408000,
                "WeatherIcon": 15,
                "IconPhrase": "Thunderstorms",
                "HasPrecipitation": true,
                "PrecipitationType": "Rain",
                "PrecipitationIntensity": "Light",
                "IsDaylight": true,
                "Temperature": {
                    "Value": 27.1,
                    "Unit": "C",
                    "UnitType": 17
                },
                "RealFeelTemperature": {
                    "Value": 32.5,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Hot"
                },
                "RealFeelTemperatureShade": {
                    "Value": 31.3,
                    "Unit": "C",
                    "UnitType": 17,
                    "Phrase": "Very Warm"
                },
                "WetBulbTemperature": {
                    "Value": 26,
                    "Unit": "C",
                    "UnitType": 17
                },
                "WetBulbGlobeTemperature": {
                    "Value": 26.5,
                    "Unit": "C",
                    "UnitType": 17
                },
                "DewPoint": {
                    "Value": 25.3,
                    "Unit": "C",
                    "UnitType": 17
                },
                "Wind": {
                    "Speed": {
                        "Value": 5.6,
                        "Unit": "km/h",
                        "UnitType": 7
                    },
                    "Direction": {
                        "Degrees": 213,
                        "Localized": "SSW",
                        "English": "SSW"
                    }
                },
                "WindGust": {
                    "Speed": {
                        "Value": 16.7,
                        "Unit": "km/h",
                        "UnitType": 7
                    }
                },
                "RelativeHumidity": 90,
                "IndoorRelativeHumidity": 90,
                "Visibility": {
                    "Value": 6.4,
                    "Unit": "km",
                    "UnitType": 6
                },
                "Ceiling": {
                    "Value": 9144,
                    "Unit": "m",
                    "UnitType": 5
                },
                "UVIndex": 1,
                "UVIndexText": "Low",
                "PrecipitationProbability": 51,
                "ThunderstormProbability": 30,
                "RainProbability": 51,
                "SnowProbability": 0,
                "IceProbability": 0,
                "TotalLiquid": {
                    "Value": 0.5,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Rain": {
                    "Value": 0.5,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "Snow": {
                    "Value": 0,
                    "Unit": "cm",
                    "UnitType": 4
                },
                "Ice": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "CloudCover": 100,
                "Evapotranspiration": {
                    "Value": 0,
                    "Unit": "mm",
                    "UnitType": 3
                },
                "SolarIrradiance": {
                    "Value": 27.8,
                    "Unit": "W/m²",
                    "UnitType": 33
                },
                "MobileLink": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=8&unit=c&lang=en-us",
                "Link": "http://www.accuweather.com/en/ph/batong-malake/781273/hourly-weather-forecast/781273?day=2&hbhhour=8&unit=c&lang=en-us"
            }
        ]
    ]
    sampDailyForecast = [
        {
            "MMDD": "8-26",
            "date": "Monday",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/15.svg",
            "status": "Thunderstorms",
            "temperature": "31.6°",
            "rainChance": "90%"
        },
        {
            "MMDD": "8-27",
            "date": "Tuesday",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/15.svg",
            "status": "Thunderstorms",
            "temperature": "29.7°",
            "rainChance": "90%"
        },
        {
            "MMDD": "8-28",
            "date": "Wednesday",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/15.svg",
            "status": "Thunderstorms",
            "temperature": "31°",
            "rainChance": "90%"
        },
        {
            "MMDD": "8-29",
            "date": "Thursday",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/16.svg",
            "status": "Mostly cloudy w/ t-storms",
            "temperature": "30.4°",
            "rainChance": "78%"
        },
        {
            "MMDD": "8-30",
            "date": "Friday",
            "iconSrc": "https://www.awxcdn.com/adc-assets/images/weathericons/15.svg",
            "status": "Thunderstorms",
            "temperature": "32°",
            "rainChance": "72%"
        }
    ]
    sampIndicesForecast = {
        "health": [
            {
                "name": "Dust & Dander",
                "status": "Extreme"
            },
            {
                "name": "Arthritis Pain",
                "status": "At High Risk"
            },
            {
                "name": "Asthma",
                "status": "At Risk"
            },
            {
                "name": "Common Cold",
                "status": "Beneficial"
            },
            {
                "name": "Flu",
                "status": "Neutral"
            },
            {
                "name": "Migraine Headache",
                "status": "Beneficial"
            },
            {
                "name": "Sinus Headache",
                "status": "Beneficial"
            },
            {
                "name": "Dehydration",
                "status": "Extreme"
            }
        ],
        "outdoor": [
            {
                "name": "Excercise",
                "status": "Poor"
            },
            {
                "name": "Star visibility",
                "status": "Poor"
            },
            {
                "name": "Mosquito activity",
                "status": "Extreme"
            },
            {
                "name": "Outdoor BBQ",
                "status": "Good"
            },
            {
                "name": "Lawn mowing",
                "status": "Poor"
            },
            {
                "name": "Outdoor activity",
                "status": "Poor"
            },
            {
                "name": "Transportation",
                "status": "Fair"
            },
            {
                "name": "Clothes Drying",
                "status": "Poor"
            }
        ]
    }

    constructor() { super(); // element created 
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
        return [/* array of attribute names to monitor for changes */]; 
    }

    // attributeChangedCallback(name, oldValue, newValue) { 
        // called when one of attributes listed above is modified 
    // }

    adoptedCallback() { 
        // called when the element is moved to a new document 
        // (happens in document.adoptNode, very rarely used) 
    }
    setupStation(apiKey:string,locKey:string|number){//saveConfig

        console.log(window)

        if(apiKey){
            // console.log("TO DO: remove XXXXX")
            // this.apiKey = "?apikeyXXXXX=" + apiKey //remove XXXXX
            this.apiKey = "?apikeyXXXX=" + apiKey //remove XXXXX
        } else throw new Error("API KEY is  required")

        if(locKey){
            this.locKey = "/" + locKey
        } else throw new Error("locKey is required")

        console.log(this.apiKey)
        console.log(this.locKey)
        this.apiReq = {
            hourlyForecast12hrs: "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour" + this.locKey + this.apiKey + "&details=true&metric=true",
            indices1Day: "http://dataservice.accuweather.com/indices/v1/daily/1day" + this.locKey + this.apiKey,
            daily5dayForecast: "http://dataservice.accuweather.com/forecasts/v1/daily/5day" + this.locKey + this.apiKey + "&details=true&metric=true",
            currentCondition:"http://dataservice.accuweather.com/currentconditions/v1" + this.locKey + this.apiKey +"&details=true",
        }

        console.log(this.apiReq)

        this.loadStyles()
    }
    loadStyles(){
        let style = this.newElem("link",{
            props:{
                rel:"stylesheet",
                href:'http://127.0.0.1:5500/Accuweather%20API/accuWeatherHomeUseStyle.css',
                // href:"./accuWeatherHomeUseStyle.css",
            },
            appendTo:document.head
        })
        this.getHrlyForecast()
    }
    async getHrlyForecast(){
        this.data.hourlyForecast12hrs = [...this.sampHrlyForecast]

        // this.data.hourlyForecast12hrs = this.sampHrlyForecast
       /*  let apiResp = await fetch(this.apiReq.hourlyForecast12hrs)
        let res = await apiResp.json()
        console.log(res)
        res.forEach((obj:any)=>{
            this.data.hourlyForecast12hrs.push({
                time:this.getTime(new Date(obj.DateTime).getHours())!,
                date:new Date(obj.DateTime).getDate(),
                dayIconSrc:this.getDayIcon(new Date(obj.DateTime).getDay())!,
                iconSrc: "https://www.awxcdn.com/adc-assets/images/weathericons/" + obj.WeatherIcon+ ".svg",
                status:obj.IconPhrase,
                temperature: Math.round(obj.Temperature.Value),
                heatIndex: Math.round(obj.RealFeelTemperature.Value),
                windSpeed: this.getBeaufortScale(res[0].Wind.Speed.Value)!,
                rainChance: this.getRainStatus(obj.PrecipitationProbability)!,
                rainValue: obj.Rain.Value,
                uvIndex:this.getUVIndex(obj.UVIndex)!,
            })
        }) */

        console.log(this.data.hourlyForecast12hrs)
        this.setupDashboard()
    }
    setupDashboard(){

        this.append(this.hourlyForecast)
        this.append(this.dailyForecast)
        this.append(this.indicesForecast) 

        this.setupGeneralInfo1()
        this.setupGeneralInfo2()
        this.setupGeneralInfo3Upper()
        this.setupGeneralInfo3Lower()
    }
    setupGeneralInfo1(){
        let img = this.newElem("img",{
            props:{
                src:"https://www.awxcdn.com/adc-assets/images/weathericons/30.svg"
            },
            appendTo:this.generalInfo1
        })

        this.generalInfo1.update = ()=>{
            if(this.data.hourlyForecast12hrs[0].temperature > this.data.hourlyForecast12hrs[1].temperature){
                this.addPEAS(img,{
                    props:{
                        src:"https://www.awxcdn.com/adc-assets/images/weathericons/31.svg",
                    }
                })
            } else if (this.data.hourlyForecast12hrs[0].temperature < this.data.hourlyForecast12hrs[1].temperature){
                this.addPEAS(img,{
                    props:{
                        src:"https://www.awxcdn.com/adc-assets/images/weathericons/30.svg",
                    }
                })
            } else throw new Error ("failed to update generalInfo1")
        }
    }
    setupGeneralInfo2(){
        let imgIcon = this.newElem("div",{props:{className:"imgIcon"},appendTo:this.generalInfo2})
        let imgDesc = this.newElem("div",{props:{className:"imgDesc"},appendTo:this.generalInfo2})

        let img = this.newElem("img",{
            props:{
                src:"https://www.awxcdn.com/adc-assets/images/weathericons/6.svg"
            },
            appendTo:imgIcon
        })

        let desc = this.newElem("div",{appendTo:imgDesc})
        let temp = this.newElem("p",{ props:{innerText:this.data.hourlyForecast12hrs[0].temperature + "\u00B0"},appendTo:desc})
        let degree = this.newElem("span",{ props:{innerText:"C"},appendTo:temp})
        let heatIndex = this.newElem("p",{props:{innerText:"Feels " + this.data.hourlyForecast12hrs[0].heatIndex + "\u00B0"},appendTo:desc})

        this.generalInfo2.update = ()=>{
            this.addPEAS(img,{
                props:{src:this.data.hourlyForecast12hrs[0].iconSrc}
            })
            this.addPEAS(temp,{
                props:{
                    innerText:this.data.hourlyForecast12hrs[0].temperature + "\u00B0"
                }
            })
            this.addPEAS(heatIndex,{
                props:{
                    innerText:"Feels " + this.data.hourlyForecast12hrs[0].heatIndex + "\u00B0"
                }
            })
        }
    }
    setupGeneralInfo3Upper(){
        let miscCont = this.newElem("div",{props:{className:"miscCont"},appendTo:this.generalInfo3})

        //------------------------- part1 ------------------------------
        let part1 = this.newElem("div",{props:{className:"part1"},appendTo:miscCont})
        let windSpeed = this.newElem("div",{props:{className:"windSpeed"},appendTo:part1})
        let rainChance = this.newElem("div",{props:{className:"rainChance"},appendTo:part1})

        let windSpeedIcon = this.newElem("div",{props:{className:"imgIcon"},appendTo:windSpeed})
        let img1 = this.newElem("img",{props:{src:"https://www.awxcdn.com/adc-assets/images/weathericons/32.svg"},appendTo:windSpeedIcon})
        let windSpeedStatus = this.newElem("div",{props:{className:"imgDesc"},appendTo:windSpeed})
        let status1 = this.newElem("p",{props:{className:this.data.hourlyForecast12hrs[0].windSpeed},appendTo:windSpeedStatus})

        let rainChanceIcon = this.newElem("div",{props:{className:"imgIcon"},appendTo:rainChance})
        // let img2 = this.newElem("img",{props:{src:"/rain-svgrepo-com.svg"},appendTo:rainChanceIcon})
        let img2 = this.newElem("img",{props:{src:"http://127.0.0.1:5500/Accuweather%20API/rain-svgrepo-com.svg"},appendTo:rainChanceIcon})
        let rainChanceStatus = this.newElem("div",{props:{className:"imgDesc"},appendTo:rainChance})
        let status2 = this.newElem("p",{props:{className:this.data.hourlyForecast12hrs[0].rainChance},appendTo:rainChanceStatus})

        //------------------------- part2 ------------------------------
        let part2 = this.newElem("div",{props:{className:"part2"},appendTo:miscCont})
        let cDate = this.newElem("div",{props:{className:"cDate"},appendTo:part2})
        let uvIndex = this.newElem("div",{props:{className:"uvIndex"},appendTo:part2})

        let cDateIcon = this.newElem("div",{props:{className:"imgIcon"},appendTo:cDate})
        let img3 = this.newElem("img",{props:{src:this.data.hourlyForecast12hrs[0].dayIconSrc},appendTo:cDateIcon})
        let cDateStatus = this.newElem("div",{props:{className:"imgDesc cDateStatus"},appendTo:cDate})
        let status3 = this.newElem("p",{props:{innerText:this.data.hourlyForecast12hrs[0].date},appendTo:cDateStatus})

        let uvIndexIcon = this.newElem("div",{props:{className:"imgIcon"},appendTo:uvIndex})
        // let img4 = this.newElem("img",{props:{src:"/uv-index-alt-svgrepo-com.svg"},appendTo:uvIndexIcon})
        let img4 = this.newElem("img",{props:{src:"http://127.0.0.1:5500/Accuweather%20API/uv-index-alt-svgrepo-com.svg"},appendTo:uvIndexIcon})
        let uvIndexStatus = this.newElem("div",{props:{className:"imgDesc"},appendTo:uvIndex})
        let status4 = this.newElem("p",{props:{className:this.data.hourlyForecast12hrs[0].uvIndex},appendTo:uvIndexStatus})
        
        this.generalInfo3.updateUpper = ()=>{
            this.addPEAS(status1,{props:{className:this.data.hourlyForecast12hrs[0].windSpeed}})
            this.addPEAS(status2,{props:{className:this.data.hourlyForecast12hrs[0].rainChance}})
            this.addPEAS(cDateStatus,{props:{src:this.data.hourlyForecast12hrs[0].dayIconSrc}})
            this.addPEAS(status3,{props:{innerText:this.data.hourlyForecast12hrs[0].date}})
            this.addPEAS(status4,{props:{className:this.data.hourlyForecast12hrs[0].uvIndex}})
        }
    }
    setupGeneralInfo3Lower(){
        let hourlyCont = this.newElem("div",{props:{className:"hourlyCont"},appendTo:this.generalInfo3})

        let cond1 = this.newElem("div",{props:{className:"cond1"},appendTo:hourlyCont});
        let cond1ImgDesc1 = this.newElem("div",{props:{className:"imgDesc1"},appendTo:cond1})
        let cond1ImgIcon = this.newElem("div",{props:{className:"imgIcon"},appendTo:cond1})
        let cond1ImgDesc2 = this.newElem("div",{props:{className:"imgDesc2"},appendTo:cond1})
        let cond1Img = this.newElem("img",{
            props:{
                src:this.data.hourlyForecast12hrs[1].iconSrc
            },
            appendTo:cond1ImgIcon
        })
        let cond1Temp = this.newElem("p",{
            props:{
                innerText:this.data.hourlyForecast12hrs[1].temperature + "\u00B0"
            },
            appendTo:cond1ImgDesc1
        })
        let cond1Time = this.newElem("p",{
            props:{
                innerText:this.data.hourlyForecast12hrs[1].time
            },
            appendTo:cond1ImgDesc2
        })

        let cond2 = this.newElem("div",{props:{className:"cond2"},appendTo:hourlyCont});
        let cond2ImgDesc1 = this.newElem("div",{props:{className:"imgDesc1"},appendTo:cond2})
        let cond2ImgIcon = this.newElem("div",{props:{className:"imgIcon"},appendTo:cond2})
        let cond2ImgDesc2 = this.newElem("div",{props:{className:"imgDesc2"},appendTo:cond2})
        let cond2Img = this.newElem("img",{
            props:{
                src:this.data.hourlyForecast12hrs[2].iconSrc
            },
            appendTo:cond2ImgIcon
        })
        let cond2Temp = this.newElem("p",{
            props:{
                innerText:this.data.hourlyForecast12hrs[2].temperature + "\u00B0"
            },
            appendTo:cond2ImgDesc1
        })
        let cond2Time = this.newElem("p",{
            props:{
                innerText:this.data.hourlyForecast12hrs[2].time
            },
            appendTo:cond2ImgDesc2
        })

        let cond3 = this.newElem("div",{props:{className:"cond3"},appendTo:hourlyCont});
        let cond3ImgDesc1 = this.newElem("div",{props:{className:"imgDesc1"},appendTo:cond3})
        let cond3ImgIcon = this.newElem("div",{props:{className:"imgIcon"},appendTo:cond3})
        let cond3ImgDesc2 = this.newElem("div",{props:{className:"imgDesc2"},appendTo:cond3})
        let cond3Img = this.newElem("img",{
            props:{
                src:this.data.hourlyForecast12hrs[3].iconSrc
            },
            appendTo:cond3ImgIcon
        })
        let cond3Temp = this.newElem("p",{
            props:{
                innerText:this.data.hourlyForecast12hrs[3].temperature + "\u00B0"
            },
            appendTo:cond3ImgDesc1
        })
        let cond3Time = this.newElem("p",{
            props:{
                innerText:this.data.hourlyForecast12hrs[3].time
            },
            appendTo:cond3ImgDesc2
        })

        this.generalInfo3.updateLower = ()=>{
            this.addPEAS(cond1Img,{props:{src:this.data.hourlyForecast12hrs[1].iconSrc}})
            this.addPEAS(cond2Img,{props:{src:this.data.hourlyForecast12hrs[2].iconSrc}})
            this.addPEAS(cond3Img,{props:{src:this.data.hourlyForecast12hrs[3].iconSrc}})

            this.addPEAS(cond1Temp,{props:{src:this.data.hourlyForecast12hrs[1].temperature}})
            this.addPEAS(cond2Temp,{props:{src:this.data.hourlyForecast12hrs[2].temperature}})
            this.addPEAS(cond3Temp,{props:{src:this.data.hourlyForecast12hrs[3].temperature}})

            this.addPEAS(cond1Time,{props:{src:this.data.hourlyForecast12hrs[1].time}})
            this.addPEAS(cond2Time,{props:{src:this.data.hourlyForecast12hrs[2].time}})
            this.addPEAS(cond3Time,{props:{src:this.data.hourlyForecast12hrs[3].time}})
        }
    }
    setupAutoUpdate(){
        setInterval(()=>{
            let d = new Date()
            if(d.getMinutes() == 0){

            }
        })
    }


    
    getBeaufortScale(i:number){ 
        //minified version
        if (i <= 11){ return    "Calm"
        } else if (i <= 38){ return   "Breeze"
        } else if (i <= 61){ return   "Strong"
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
    }
    getRainStatus(i:number){
        if(i >= 75){
            return "High"
        } else if (i >= 50){
            return "Likely"
        } else if (i >= 25){
            return "Low"
        } else if (i >= 0){
            return "Unlikely"
        }
    }
    getUVIndex(i:number){
        if(i >= 11){
            return "Extreme"
        } else if (i >= 8){
            return "VeryHigh"
        } else if (i >= 6){
            return "High"
        } else if (i >= 3){
            return "Moderate"
        } else if (i >= 0){
            return "Low"
        }
    }
    getDayIcon(i:number){
        if(i == 0){
            return "http://127.0.0.1:5500/Accuweather%20API/sunday-svgrepo-com.svg"
        } else if (i == 1){
            return "http://127.0.0.1:5500/Accuweather%20API/monday-svgrepo-com.svg"
        } else if (i == 2){
            return "http://127.0.0.1:5500/Accuweather%20API/tuesday-svgrepo-com.svg"
        } else if (i == 3){
            return "http://127.0.0.1:5500/Accuweather%20API/wednesday-svgrepo-com.svg"
        } else if (i == 4){
            return "http://127.0.0.1:5500/Accuweather%20API/thursday-svgrepo-com.svg"
        } else if (i == 5){
            return "http://127.0.0.1:5500/Accuweather%20API/friday-svgrepo-com.svg"
        } else if (i == 6){
            return "http://127.0.0.1:5500/Accuweather%20API/saturday-svgrepo-com.svg"
        }
    }
    getTime(i:number){
        if(i >= 12 ){
            return  (i-12) + "PM"
        } else if ( i  == 0){
            return  "12 AM"
        } else if ( i < 12){    
            return  i + "AM"
        }
    }

    newElem(type:string, obj:{
        styles?:any,
        props?:any,
        attributes?:any,
        events?:{[key:string]:any},
        appendTo?:HTMLElement
    }){
        if(type){
            let elem = document.createElement(type)
            this.addPEAS(elem,obj)
            return elem
        } else throw new Error("New elem type cannot be undefined")
    }
    addPEAS(elem:any, obj:{
        styles?:any,
        props?:any,
        attributes?:any,
        events?:{[key:string]:any},
        appendTo?:HTMLElement
    }){
        if (obj.styles) { //set svg styles
            Object.entries(obj.styles).forEach(([key,val])=>{
                elem.style.setProperty(key,val)
            })
        }
        if (obj.props){
            Object.entries(obj.props).forEach(([key,val])=>{
                Object.assign(elem,{[key] : val})
            })
        } 
        if (obj.attributes){
            Object.entries(obj.attributes).forEach(([key,val])=>{
                elem.setAttribute(key,val)
            })
        }
        if (obj.events){
            elem.eventStatus = {
                over:false,
                overMove:false,
                select:false,
                selectMove:false,
                active:false,
                leave:true,
                onOver:(e:any)=>{ //fired once above
                    
                    if(elem.eventStatus.leave == true){
                        elem.eventStatus.over = true //reset by leave
                        elem.eventStatus.leave = false //reset by leave
                        
                        if(e.type == "pointerover"){
                            elem.eventStatus.overFunc(e)
                        } else if (e.type == "focus"){
                            elem.eventStatus.overFunc(e)
                        }
                    }
                    // console.log(elem.eventStatus.over)
                },
                onOverMove:(e:any)=>{ //fired repeatedly once moving above
                    if(elem.eventStatus.over == true){
                        if(elem.eventStatus.select == false){
                            elem.eventStatus.overMove = true //reset by select | leave

                            if(e.type == "pointermove"){
                                elem.eventStatus.overMoveFunc(e)
                            }
                        } else elem.eventStatus.overMove = false
                    }
                },
                onSelect:(e:any)=>{ //fired on down press
                    if(elem.eventStatus.over == true){
                        
                        if(e.type == "pointerdown" && e.button != 2){
                            elem.eventStatus.select = true //reset by active | leave
                            elem.eventStatus.selectFunc(e)
                        } else if (e.type == "keydown" && ["Enter"," "].includes(e.key)){
                            elem.eventStatus.select = true //reset by active | leave
                            elem.eventStatus.selectFunc(e)
                        }
                        
                    }
                },
                onSelectMove:(e:any)=>{ //fired repeatedly once down press and moving
                    if(elem.eventStatus.select == true){
                        if(e.type == "pointermove"){
                            elem.eventStatus.selectMove = true //reset by active
                            elem.eventStatus.selectMoveFunc(e)
                        }
                    } else {
                        elem.eventStatus.selectMove = false
                    }
                },
                onActive:(e:any)=>{ //fired once after releasing a down press
                    if(elem.eventStatus.select = true && elem.eventStatus.over == true){
                        elem.eventStatus.select = false
                        elem.eventStatus.selectMove = false
                        if(e.type == "pointerup" && e.button != 2){
                            elem.eventStatus.activeFunc(e)
                        } else if (e.type == "keyup" && ["Enter"," "].includes(e.key)){
                            elem.eventStatus.activeFunc(e)
                        }
                    }
                },
                onLeave:(e:any)=>{ //fired once after leaving bounds
                    if(elem.eventStatus.over == true && elem.eventStatus.leave == false){
                        elem.eventStatus.over = false
                        elem.eventStatus.overMove = false
                        elem.eventStatus.select = false
                        elem.eventStatus.selectMove = false
                        elem.eventStatus.leave = true

                        if(e.type == "pointerout"){
                            elem.eventStatus.leaveFunc(e)
                        } else if (e.type == "focusout"){
                            elem.eventStatus.leaveFunc(e)
                        }
                    }
                },
                overFunc:()=>{},
                overMoveFunc:()=>{},
                selectFunc:()=>{},
                selectMoveFunc:()=>{},
                activeFunc:()=>{},
                leaveFunc:()=>{},
            }
            Object.entries(obj.events).forEach(([key,val])=>{
                if(["onOver","onOverMove","onSelect","onSelectMove","onActive","onLeave"].includes(key)){
                    //just replace default callback func
                    if(key == "onOver"){
                        elem.eventStatus.overFunc = val
                    } else if (key == "onOverMove"){
                        elem.eventStatus.overMoveFunc = val
                    } else if (key == "onSelect"){
                        elem.eventStatus.selectFunc = val
                    } else if (key == "onSelectMove"){
                        elem.eventStatus.selectMoveFunc = val
                    } else if (key == "onActive"){
                        elem.eventStatus.activeFunc = val 
                    } else if (key == "onLeave"){
                        elem.eventStatus.leaveFunc = val
                    }

                } else elem.addEventListener(key,val)
            })
                elem.addEventListener("pointerover",elem.eventStatus.onOver)
                elem.addEventListener("focus",elem.eventStatus.onOver)
                elem.addEventListener("pointermove",elem.eventStatus.onOverMove)
                elem.addEventListener("pointerdown",elem.eventStatus.onSelect)
                elem.addEventListener("keydown",elem.eventStatus.onSelect)
                elem.addEventListener("pointermove",elem.eventStatus.onSelectMove)
                elem.addEventListener("pointerup",elem.eventStatus.onActive)
                elem.addEventListener("keyup",elem.eventStatus.onActive)
                elem.addEventListener("pointerout",elem.eventStatus.onLeave)
                elem.addEventListener("focusout",elem.eventStatus.onLeave)
        }
        if (obj.appendTo){
            obj.appendTo.append(elem)
        }
    }

    // UNUSED
    async setupGeneralInfo(){
        // this.data.currentCondition = this.sampCurCond
        // this.data.hourlyForecast12hrs = this.sampHrlyForecast

        
        /* let apiResp = await fetch(this.apiReq.currentCondition)
        let res = await apiResp.json()
        this.data.currentCondition = {
            status: res[0].WeatherText,
            iconSrc: "https://www.awxcdn.com/adc-assets/images/weathericons/" + res[0].WeatherIcon+ ".svg",
            temp: Math.round(res[0].Temperature.Metric.Value) + "\u00B0" ,
            humidity: res[0].RelativeHumidity,
            heatIndex: Math.round(res[0].RealFeelTemperature.Metric.Value) + "\u00B0",
            windSpeed: this.getBeaufortScale(res[0].Wind.Speed.Metric.Value)! ,
            uvStrength: res[0].UVIndexText,
            cloudCoverage: res[0].CloudCover + "\u0025"
        } */
       
        // ------------------------------------------------------------------this.generalInfo1------------------------------------------------------------------
        let imgCont = this.newElem("div",{props:{className:"imgCont"},appendTo:this.generalInfo1})
        let imgDesc = this.newElem("div",{props:{className:"imgDesc"},appendTo:this.generalInfo1})

       /*  this.generalCont.update = ()=>{
            this.data.hourlyForecast12hrs.forEach((obj:any)=>{
                let img = this.newElem("img",{
                    props:{
                        src:obj.iconSrc
                    },
                    attributes:{
                        "data-time":obj.time,
                    },
                    events:{
                        "transitionend":()=>{
                            img.remove()
                            this.addPEAS(this.generalCont,{props:{className:"generalCont"}})
                        }
                    },
                    appendTo:imgCont 
                })

                let desc = this.newElem("div",{
                    events:{
                        "transitionend":()=>{
                            desc.remove()
                            this.addPEAS(this.generalCont,{props:{className:"generalCont"}})
                        }
                    },
                    appendTo:imgDesc
                })
                let temp = this.newElem("p",{
                    props:{
                        innerText:obj.temperature
                    },
                    appendTo:desc
                })
                let degree = this.newElem("span",{
                    props:{
                        innerText:"C"
                    },
                    appendTo:temp
                })
                let heatIndex = this.newElem("p",{
                    props:{
                        innerText:"Feels " + this.data.currentCondition.heatIndex
                    },
                    appendTo:desc
                })
            })
        }
        this.generalCont.next = ()=>{
            this.addPEAS(this.generalCont,{props:{className:"generalCont generalContUpdate"}})
        }
        this.generalCont.update()
        setTimeout(()=>this.generalCont.next(),3000)
         */
        // ------------------------------------------------------------------this.generalInfo2------------------------------------------------------------------
        console.log("TO DO: update general info2 to use hourly information")
        let humidity = this.newElem("p",{
            props:{
                innerText: "Humidity " + this.data.currentCondition.humidity
            },
            appendTo:this.generalInfo2
        })
        let wind = this.newElem("p",{
            props:{
                innerText: "Humidity " + this.data.currentCondition.windSpeed
            },
            appendTo:this.generalInfo2
        })
        let uv = this.newElem("p",{
            props:{
                innerText: "UV " + this.data.currentCondition.uvStrength
            },
            appendTo:this.generalInfo2
        })

        console.log(this.data.currentCondition)
        // this.setupHrlyForecast()
    }
    async setupDailyForecast(){
        this.data.daily5dayForecast = this.sampDailyForecast

        /* let apiResp = await fetch(this.apiReq.daily5dayForecast)
        let res = await apiResp.json()

        res.DailyForecasts.forEach((obj:any)=>{
            let d = new Date(obj.Date)
            let MMDD = (d.getMonth()+1) + "-" + d.getDate()
            let date = d.toLocaleDateString(undefined,{weekday:"long"})
            
            this.data.daily5dayForecast.push({
                MMDD:MMDD,
                date:date,
                iconSrc:"https://www.awxcdn.com/adc-assets/images/weathericons/" + obj.Day.Icon + ".svg",
                status: obj.Day.IconPhrase,
                temperature: obj.Temperature.Maximum.Value + "\u00B0",
                rainChance: obj.Day.PrecipitationProbability + "%"
            })
        }) */

        console.log(this.data.daily5dayForecast)
        this.setupIndicesForecast()
    }
    async setupIndicesForecast(){
        this.data.indices1Day = this.sampIndicesForecast

        /* let apiResp = await fetch(this.apiReq.indices1Day)
        let res = await apiResp.json()

        console.log(res)
        let health:any[] = []
        let outdoor:any[] = []
        let addIndice = (obj:any,arr:any[],name:string)=>{
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

        this.data.indices1Day ={
            health:[...health],
            outdoor:[...outdoor]
        } */

        console.log(this.data.indices1Day)
    }

// there can be other element methods and properties 

}

customElements.define("accu-weather",AccuWeather)