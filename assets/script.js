var searchBar = document.querySelector("#searchBar");

searchBar.addEventListener("submit", function(event) {
    event.preventDefault();

    var citySearch = event.target.citySearch.value;
    console.log(citySearch, 'Success');

    getCoordinates(citySearch);
});

function getCoordinates(city) {
    var URL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=885e7a2453d9981f57f30a861b8634ec'

    fetch(URL).then(function(data) {
        return data.json();
    }).then(function(data) {
        console.log(data, data[0].lat, data[0].lon);
        var latitude = data[0].lat;
        var longitude = data[0].lon;
        searchCity(latitude, longitude);
        fiveDayForecast(latitude, longitude);
    })
};

function searchCity(latitude, longitude) {
    var URL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=885e7a2453d9981f57f30a861b8634ec'

    fetch(URL).then(function(data) {
        return data.json();
    }).then(function(data) {
        console.log(data);

        var name = data.name;
        var description = data.weather[0].main;
        var temp = data.main.temp;
        var feels = data.main.feels_like;
        var tempMax = data.main.temp_max;
        var tempMin = data.main.temp_min;
        var wind = data.wind.speed;
        var humidity = data.main.humidity;

        var feelsText = document.createElement("div");
        var tempMaxMinText = document.createElement("div");
        var windText = document.createElement("div");
        var humidityText = document.createElement("div");
        var mainTemp = document.createElement("div");
        var space = document.createElement("br");
        var line = document.createElement("hr");

        // Display lines between each
        mainTemp.innerHTML = Math.trunc((temp - 273.15) * (9/5) + 32) + "°F";
        feelsText.innerHTML = "Feels like " + Math.trunc((feels - 273.15) * (9/5) + 32) + "°F";
        tempMaxMinText.innerHTML = "Max " + Math.trunc((tempMax - 273.15) * (9/5) + 32) + "°F / Min " + Math.trunc((tempMin - 273.15) * (9/5) + 32) + "°F";
        windText.innerHTML = "Wind: " + wind + " mph";
        humidityText.innerHTML = "Humidity: " + humidity + "%";

        var format = dayjs().format('MMM D, YYYY');

        $("#currentInfo").append(name, space);
        $("#currentInfo").append(format);
        $("#currentInfo").append('<img src="" id="icon" alt="Weather Icon">', description);
        $("#currentInfo").append(mainTemp);
        $("#moreInfo").append(feelsText, tempMaxMinText, windText, humidityText);

        var iconURL = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
        document.getElementById("icon").setAttribute("src", iconURL);
    })
};

function fiveDayForecast(latitude, longitude) {
    var URL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=885e7a2453d9981f57f30a861b8634ec'

    fetch(URL).then(function(data) {
        return data.json();
    }).then(function(data) {
        console.log(data);

        var today = dayjs();
        // var tomorrow = today.add(1, 'day');
        // var formatted = tomorrow.format('MMM D, YYYY');
        // console.log(formatted);

        var displayLength = 6
        for (i = 1; i < displayLength; i++) {
            var date = today.add(i, 'day');
            var formatted = date.format('MMM D, YYYY');
            var temp = data.list[i].main.temp;
            var wind = data.list[i].wind.speed;
            var humidity = data.list[i].main.humidity;

            var tempText = document.createElement("div");
            var windText = document.createElement("div");
            var humidityText = document.createElement("div");
            var dateText = document.createElement("div");
            var space = document.createElement("br");

            tempText.innerHTML = Math.trunc((temp - 273.15) * (9/5) + 32) + "°F";
            windText.innerHTML = "Wind: " + wind + " mph";
            humidityText.innerHTML = "Humidity: " + humidity + "%";
            dateText.innerHTML = formatted;

            var oneDay = document.createElement("div");

            oneDay.append(dateText, tempText, windText, humidityText, space, space);

            $("#fiveDay").append(oneDay);
        };
    })
}