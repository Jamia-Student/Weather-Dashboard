input = document.getElementById("input");
search = document.getElementById("search");
currloc = document.getElementById("currLoc");
sec2 = document.getElementById("second");

function print(day,section){
    let temp = day.main.temp;
    let wind = day.wind.speed;
    let humidity = day.main.humidity;
    let iconcode = day.weather[0].icon;
    let date = day.dt_txt.slice(0,10);
    let iconurl = `https://openweathermap.org/img/wn/${iconcode}@2x.png`;
    
    let divs1 = document.createElement("div");
    let p0 = document.createElement("p");
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let img = document.createElement("img");
    
    divs1.className = "bg-gray-700 text-white rounded-lg p-4 flex flex-col shadow-md col-span-1";
    p0.textContent = " (" + date + ")";
    p1.textContent = "Temp: " + temp + " °C";
    p2.textContent = "Wind: " + wind + " M/S"; 
    p3.textContent = "Humidity: " + humidity + "%";
    img.src = iconurl;
    img.className = "w-12 h-12";
    divs1.appendChild(p0);
    divs1.appendChild(img);
    divs1.appendChild(p1);
    divs1.appendChild(p2);
    divs1.appendChild(p3);
    section.appendChild(divs1);
}
function fourdayforecast(list){
    let section = document.createElement("section");
    section.className = "grid grid-cols-4 gap-1 bg-blue-300 rounded-md text-white gap-1";
    sec2.appendChild(section);
    let count=0;
    for (let day of list){
        count+=1;
        if(count === 5){
            return;
        }
        print(day,section);
    }
}

function Weather(name,temp,wind,humidity,weather,iconcode){
    let iconurl = `https://openweathermap.org/img/wn/${iconcode}@2x.png`;
    let section = document.createElement("section");
    let p0 = document.createElement("p");
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let p4 = document.createElement("p");
    let img = document.createElement("img");
    let div = document.createElement("div");
    let div1 = document.createElement("div");
    p0.textContent = name + " (" + new Date().toLocaleDateString('en-GB') + ")";
    p1.textContent = "Temperature: " + temp + " °C";
    p2.textContent = "Wind: " + wind + " M/S"; 
    p3.textContent = "Humidity: " + humidity + "%";
    p4.textContent = weather;
    img.src = iconurl;
    img.className = "w-12 h-12";
    div.appendChild(p0);
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(p3);
    sec2.appendChild(section);
    div1.appendChild(img);
    div1.appendChild(p4);
    section.appendChild(div);
    section.appendChild(div1);
    section.className = "flex justify-between bg-blue-600 rounded-md text-white p-3";

    let heading = document.createElement("h1");
    heading.textContent = "4-Day Forecast";
    heading.className = "black font-bold p-3 pl-0";
    sec2.appendChild(heading);

}

search.onclick = function(){
    if (input.value.trim() === "")
        alert("Please fill the location or use current location");
    const apikey = "e23c03d69572b7bdc98516d4e58620f6";
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apikey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&appid=${apikey}&units=metric`;
    
    let options = {
        method:"GET"
    };
    fetch(currentWeatherUrl,options)
        .then(function(response){
            return response.json();
        })
        .then(function(jsondata){
            let temp = jsondata.main.temp;
            let wind = jsondata.wind.speed;
            let humidity = jsondata.main.humidity;
            let weather = jsondata.weather[0].description;
            let name = jsondata.name
            let iconcode = jsondata.weather[0].icon;
            Weather(name,temp,wind,humidity,weather,iconcode);
        })
    
    fetch(forecastUrl,options)
        .then(function(response){
            return response.json();
        })
        .then(function(jsondata){
             fourdayforecast(jsondata.list);
        })
};
currloc.onclick = function () {
    sec2.innerHTML = ""; // Clear old data

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(success, error);

    function success(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apikey = "e23c03d69572b7bdc98516d4e58620f6";

        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(jsondata => {
                let temp = jsondata.main.temp;
                let wind = jsondata.wind.speed;
                let humidity = jsondata.main.humidity;
                let weather = jsondata.weather[0].description;
                let name = jsondata.name;
                let iconcode = jsondata.weather[0].icon;
                Weather(name, temp, wind, humidity, weather, iconcode);
            });

        fetch(forecastUrl)
            .then(response => response.json())
            .then(jsondata => {
                fourdayforecast(jsondata.list);
            });
    }

    function error() {
        alert("Unable to retrieve your location.");
    }
};
