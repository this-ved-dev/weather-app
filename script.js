const key = "7078d5c1ce8c8c1c26f88572391f62be";

// geolocation
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
navigator.geolocation.getCurrentPosition(success, error, options);
function success(pos) {
  var latitude = pos.coords.latitude;
  var longitude = pos.coords.longitude;
  weather.fetchCountryId(latitude,longitude);
};
function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};
//geolocation ends

let weather = 
{
    "apikey": key,
    //this is when the location access the function
    fetchCountryId: (latitude, longitude) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}`)
            .then((response) => response.json())
            .then((data) => {
                const { name } = data;
                const { country }  = data.sys;
                weather.fetchOneCallWeather(latitude, longitude, country, name);
            }
            );
    },
    // this is when you enter the name of the city
    fetchLatLon: (city) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`)
            .then((response) => response.json())
            .then((data) => {
                const { lon, lat } = data.coord;
                const { country } = data.sys;
                weather.fetchOneCallWeather(lat, lon, country, city);
            });
    },

    fetchOneCallWeather: function(latitude, longitude,country, city)
    {
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}`)
        .then((response)=> response.json())
        .then((data)=>
            this.displayWeather(data,country,city)
    );    
    },
    displayWeather: function(data,country,city)
    {
        const { icon, description } = data.current.weather[0];
        const { wind_speed,humidity,temp,dt } = data.current;
        const { night,eve,morn,day } = data.daily[0].temp;
        document.querySelector(".location").innerHTML=`${city}, ${country}`;
        document.querySelector(".weather-icon").src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        document.querySelector(".weather-temp").innerHTML=`${temp}°C`;
        document.querySelector(".weather-desc").innerHTML= description.toUpperCase();
        document.querySelector("#h-value").innerHTML=`${humidity} %`;
        document.querySelector("#w-value").innerHTML=`${wind_speed} km/h`;
        document.body.style.backgroundImage = `url('https://source.unsplash.com/1920x1080/?${city}')`;
        document.querySelector("#temp1").innerHTML = `${morn}°C`;
        document.querySelector("#temp2").innerHTML = `${day}°C`;
        document.querySelector("#temp3").innerHTML = `${eve}°C`;
        document.querySelector("#temp4").innerHTML = `${night}°C`;
        
        weather.Localday();
        
    },
    search:function () 
    {
        this.fetchLatLon(document.querySelector(".search").value);
        
    },
    Localday: function (){  
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var day = weekday[d.getDay()];
    document.querySelector(".date-dayname").innerHTML = day;
    var dd = d.getDate();
    var mm = new Array(12);
    mm[1] = "January";
    mm[2] = "February";
    mm[3] = "March";
    mm[4] = "April";
    mm[5] = "May";
    mm[6] = "June";
    mm[7] = "July";
    mm[8] = "August";
    mm[9] = "September";
    mm[10] = "October";
    mm[11] = "November";
    mm[12] = "December";
    var month = mm[d.getMonth()+1];
    var yyyy = d.getFullYear();
    document.querySelector(".date-day").innerHTML = dd+" "+month+", "+yyyy; 
    }
};
//when you press enter
document.querySelector(".location-button").addEventListener("click",function ()
 {
     weather.search();    
});



//Event listener for enter and click
document.querySelector(".search").addEventListener("keypress",function (bruh)
{
    if(bruh.key=="Enter")
    {
        weather.search();;
    }
});









        