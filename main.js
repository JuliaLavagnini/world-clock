// Function to generate HTML for displaying city time
function generateCityTimeHTML(cityName, timeZone, offsetString) {
    return `
        <div class="city" id="${cityName.toLowerCase().replace(/\s+/g, '-')}">
            <div>
                <h2>${cityName}</h2>
                <small class="zoneTime">${offsetString}</small>
            </div>
            <div class="time" id="time-${cityName.toLowerCase().replace(/\s+/g, '-')}"></div>
        </div>
    `;
}

// Get the container element where cities will be displayed
let clocksContainer = document.querySelector('#clocks');

// List of cities and their respective timezones
let cities = [
    { name: 'Toronto', timezone: 'America/Toronto' },
    { name: 'London', timezone: 'Europe/London' },
    { name: 'Sydney', timezone: 'Australia/Sydney' },
];


// Loop through the cities array and generate HTML for each city
cities.forEach(city => {
    // Get the timezone offset string
    let offsetString = getTimezoneOffsetString(city.name);
    // Generate HTML for the city and append it to the container
    clocksContainer.innerHTML += generateCityTimeHTML(city.name, city.timezone, offsetString);
});

// Function to update time for all cities
function updateCityTimes() {
    cities.forEach(city => {
        let cityElement = document.querySelector(`#time-${city.name.toLowerCase().replace(/\s+/g, '-')}`);
        let cityMoment = moment().tz(city.timezone)
        cityElement.innerHTML = cityMoment.format(
          "h:mm:ss [<small>]A[</small>]"
        );;
    });
}

// Function to get the timezone offset string for a given city name
function getTimezoneOffsetString(cityName) {
    let city = cities.find(city => city.name === cityName);
    let place = moment.tz(city.timezone);

    // Get the timezone offset in minutes
    let offsetMinutes = place.utcOffset();

    // Convert the offset to hours and minutes
    let offsetHours = Math.abs(offsetMinutes / 60);
    let offsetMinutesRemainder = Math.abs(offsetMinutes % 60);

    // Determine if the offset is ahead or behind
    let direction = (offsetMinutes >= 0 ? 'ahead' : 'behind');

    // Determine if the current time is already tomorrow
    let tomorrow = moment().add(1, 'days').startOf('day');
    let isTomorrow = place.isSame(tomorrow, 'day');

    // Build the offset string with the desired format
    return `${offsetHours}:${offsetMinutesRemainder < 10 ? '0' : ''}${offsetMinutesRemainder} Hrs ${direction}, ${isTomorrow ? 'Tomorrow' : 'Today'}`;
}
// Update city times every second
setInterval(updateCityTimes, 1000);

function selectionCity(event, offsetString){
let selectCityElement = event.target.value;
if (selectCityElement === 'current'){
    selectCityElement = moment.tz.guess();
}
let cityZone = moment().tz(selectCityElement);
let cityName = selectCityElement.replace("_", " ").split("/")[1];
let headingCity = document.querySelector('#location');

let offsetMinutes = cityZone.utcOffset();
// Convert the offset to hours and minutes
let [offsetHours, offsetMinutesRemainder] = [Math.abs(offsetMinutes / 60), Math.abs(offsetMinutes % 60)];
// Determine if the offset is ahead or behind
let plusMinesTime = (offsetMinutes >= 0 ? 'ahead' : 'behind');
// Determine if the current time is already tomorrow
let isTomorrow = cityZone.isSame(moment().add(1, 'days').startOf('day'), 'day');
// Build the offset string with the desired format
let offsetStringHead = `${offsetHours}:${(offsetMinutesRemainder < 10 ? '0' : '')}${offsetMinutesRemainder} Hrs ${plusMinesTime}, ${isTomorrow ? 'Tomorrow' : 'Today'}`;

headingCity.innerHTML = `<div class="timeHead">
                    <h2 id="localName">${cityName}</h2>
                    <div class="time" id="localtime">${cityZone.format(
                      "h:mm"
                    )} <small>${cityZone.format(
  "A"
)}</small></div>
                </div>
                <small class="zoneTime">${offsetStringHead}</small>`;
}

let citySelectElement = document.querySelector('#city');
citySelectElement.addEventListener('change', selectionCity);
selectionCity();