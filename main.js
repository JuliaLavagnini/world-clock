
function displayDateTime(event){
    if(event.target.value.length > 0){
        let currentTime = moment().tz(event.target.value).format('dddd Do MMMM, hh:mm:s A')
        console.log(currentTime);

        let date = document.querySelector('#date');
        date.innerHTML = currentTime;
        alert(currentTime)
    };
};


let countrySelect = document.querySelector('#countries');
countrySelect.addEventListener('change', displayDateTime);

