const miladi_month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const shamsi_month_days = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
const shamsi_months = ["حمل", "ثور", "جوزا", "سرطان","اسد","سنبله","میزان","عقرب","قوس","جدی","دلو","حوت"]
const miladi_months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const shamsiDateSpan = document.getElementById('shamsiDate')
const miladiDateSpan = document.getElementById('miladiDate')
const daysDiv = document.getElementById('days')
const nextBtn = document.getElementById('nextMonth')
const previousBtn = document.getElementById('previousMonth')
const modalOpen = document.getElementById('modalBtn')
const todayBtn = document.getElementById('todayBtn')
let selectedMonth = 0
let selectedYear = 0
let currentSYear = 0
let currentSMonth = 0
let currentSDay = 0
let isCurrentMoth = true
let paired = []

nextBtn.addEventListener('click',loadNextMonth)
previousBtn.addEventListener('click',loadPreviousMonth)
shamsiDateSpan.addEventListener('click',LoadModal)
modalOpen.addEventListener('click',renderModal)
todayBtn.addEventListener('click',renderToday)
//according to today's date, render the current month
//let unixdate = Date.now()
let today = new Date()
let miladi_m = today.getMonth()+1
let miladi_d = today.getDate()
let miladi_y = today.getFullYear()
//convert today miladi date to shamsi
let shamsiDate = dateToShamsi(miladi_y,miladi_m,miladi_d)
currentSDay = shamsiDate[2]
selectedMonth = shamsiDate[1]
selectedYear = shamsiDate[0]
currentSMonth = shamsiDate[1]
currentSYear = shamsiDate[0]
renderCalendar(shamsiDate[0],shamsiDate[1],shamsiDate[2])
function renderToday(){
    shamsiDateSpan.innerHTML=''
    miladiDateSpan.innerHTML=''
    daysDiv.innerHTML=''
    isCurrentMoth = false
    selectedYear = shamsiDate[0]
    selectedMonth = shamsiDate[1]

    renderCalendar(shamsiDate[0],shamsiDate[1],shamsiDate[2])
}
function dateToShamsi(miladi_y,miladi_m,miladi_d){

    let mY = miladi_y-1600
    let mM = miladi_m-1
    let mD = miladi_d-1
    let miladi_day_no = 365*mY+div(mY+3,4)-div(mY+99,100)+div(mY+399,400);

    for (let i=0; i < mM; ++i){
        miladi_day_no += miladi_month_days[i]
    }

    if (mM>1 && ((mY%4==0 && mY%100!=0) || (mY%400==0))){
        /* leap and after Feb */
        ++miladi_day_no
    }

    miladi_day_no += mD

    let shamsi_day_no = miladi_day_no-79
    let shamsi_np = div(shamsi_day_no, 12053)

    shamsi_day_no %= 12053

    let sY = 979+33*shamsi_np+4*div(shamsi_day_no,1461)

    shamsi_day_no %= 1461;
    if (shamsi_day_no >= 366) {
        sY += div(shamsi_day_no-1, 365);
        shamsi_day_no = (shamsi_day_no-1)%365;
    }

    let day = 0;
    for (let i = 0; i < 11 && shamsi_day_no >= shamsi_month_days[i]; ++i) {
        shamsi_day_no -= shamsi_month_days[i];
        day = i+1 
    }
    let sM = day + 1
    
    let sD = shamsi_day_no+1
    
    return [sY,sM,sD]
}
function renderCalendar(sY,sM,sD){
    if(sM == currentSMonth || sM == 0){
        isCurrentMoth = true
    }
    shamsiDateSpan.textContent=sY+' '+shamsi_months[sM-1]//shamsi month header
    let sMiladiArray = dateToMiladi(sY,sM,1)
    let shamsiLeapMonth = shamsi_month_days[sM-1]
    if(sM ==12 && shamsiIsLeap(sY)){//month 12 in leap year => 30
        shamsiLeapMonth = 30
    }
    let eMiladiArray = dateToMiladi(sY,sM,shamsiLeapMonth)
    //miladi month header
    miladiDateSpan.textContent= miladi_months[sMiladiArray[1]-1]+'-'+miladi_months[eMiladiArray[1]-1]+ ' '+sMiladiArray[0]
    //pairing shamsi with correspond miladi day
    pairShamsiWithMiladi(sMiladiArray[0],sMiladiArray[1],sMiladiArray[2],eMiladiArray[2])
    //finding the first day of shamsi of the current month
    //0:sun ... 6: sat
    let sWeekDay = new Date(sMiladiArray[0],sMiladiArray[1]-1,sMiladiArray[2]).getDay()
    let eWeekDay = new Date(eMiladiArray[0],eMiladiArray[1]-1,eMiladiArray[2]).getDay()
    if(sWeekDay != 6){
        for(let j = 0;j<=sWeekDay;j++){
            let squar = document.createElement('span')
            squar.classList.add('day')
            daysDiv.appendChild(squar)
        }
    }

    for(let i = 1; i <= shamsiLeapMonth; i++){
        let squar = document.createElement('div')
        squar.setAttribute('id','day_'+i)
        squar.classList.add('day')
        if(i==currentSDay && isCurrentMoth){
            squar.classList.add('current-day')
        }
        daysDiv.appendChild(squar)
        let sSpan = document.createElement('span')
        sSpan.classList.add('shamsi_day')
        sSpan.textContent=i
        document.getElementById('day_'+i).appendChild(sSpan)
        let mSpan = document.createElement('span')
        mSpan.classList.add('miladi_day')
        mSpan.textContent=paired[i-1]
        document.getElementById('day_'+i).appendChild(mSpan)
        

    }
    if(eWeekDay != 6){
        for(let j = eWeekDay;j<5;j++){
            let squar = document.createElement('span')
            squar.classList.add('day')
            daysDiv.appendChild(squar)
        }
    }else{
        let squar = document.createElement('span')
        squar.classList.add('day')
        daysDiv.appendChild(squar)
    }
}

function dateToMiladi(y,m,d){
    let shY = y-979
    let shM = m-1
    let shD = d-1
    let sh_day_no = 365*shY + div(shY,33)*8 + div(((shY%33)+3),4)

    for (let i=0; i < shM; ++i){
        sh_day_no += shamsi_month_days[i]
    }
    
    sh_day_no += shD
    let m_day_no = sh_day_no+79

    let miY = 1600+400*div(m_day_no,146097)
    m_day_no =m_day_no%146097
    let leap=1

    if (m_day_no >= 36525) {
        m_day_no =m_day_no-1
        //36524 = 365*100 + 100/4 - 100/100
        miY +=100* div(m_day_no,36524)
        m_day_no=m_day_no % 36524

        if(m_day_no>=365){
            m_day_no = m_day_no+1
        }
        else{
            leap=0
        }
    }
    miY += 4*div(m_day_no,1461)
    m_day_no %=1461
    if(m_day_no>=366)
    {
        leap=0
        m_day_no=m_day_no-1
        miY += div(m_day_no,365)
        m_day_no=m_day_no %365
    }
    let i=0
    let tmp=0
    while (m_day_no>= (miladi_month_days[i]+tmp))
    {
        if(i==1 && leap==1){
            tmp=1
        }else{
            tmp=0
        }
        m_day_no -= miladi_month_days[i]+tmp
        i=i+1
    }
    let miM=i+1
    let miD=m_day_no+1
    return [miY,miM,miD]
    
}
function div(a, b) {
    return Math.floor(a / b);
}
function loadNextMonth(){
    shamsiDateSpan.innerHTML=''
    miladiDateSpan.innerHTML=''
    daysDiv.innerHTML=''
    isCurrentMoth = false

    if(selectedMonth == 12){
        selectedMonth = 1
        selectedYear = selectedYear+1
    }
    else{
        selectedMonth = selectedMonth+1
    }
    renderCalendar(selectedYear,selectedMonth,1)
 }
 function loadPreviousMonth(){
    shamsiDateSpan.innerHTML=''
    miladiDateSpan.innerHTML=''
    daysDiv.innerHTML=''
    isCurrentMoth = false

    if(selectedMonth == 1){
        selectedMonth = 12
        selectedYear = selectedYear-1
    }
    else{
        selectedMonth = selectedMonth-1
    }
    
    renderCalendar(selectedYear,selectedMonth,1)
 }
 function pairShamsiWithMiladi(mSY,mSM,mSD,mED){
    let miladiLeapMonth = miladi_month_days[mSM-1]
    if(mSM == 2 && miladiIsLeap(mSY)){
        miladiLeapMonth = 29
    }
    paired = []
    while(mSD <= miladiLeapMonth){
        paired.push(mSD) 
        mSD++
    }
    paired.push(miladi_months[mSM])
    for(let j = 2;j<=mED;j++){
        paired.push(j) 
    }
 }
function miladiIsLeap (year)
{
    return ((year%4) == 0 && ((year%100) != 0 || (year%400) == 0));
}
    
function shamsiIsLeap (year)
{
    year = (year - 474) % 128;
    year = ((year >= 30) ? 0 : 29) + year;
    year = year -Math.floor(year/33) - 1;
    return ((year % 4) == 0);
}
function LoadModal(){
    document.getElementById('select_year').textContent=''
    document.getElementById('select_month').textContent=''
    
    for(let i=currentSYear-50;i<=currentSYear+1;i++){
        let option = document.createElement('option')
        option.setAttribute('value',i)
        if(i==selectedYear){
            option.setAttribute('selected','selected')
        }
        option.textContent=i
        document.getElementById('select_year').appendChild(option)
    }
    for (let i = 0;i<shamsi_months.length;i++){
        let option = document.createElement('option')
        option.setAttribute('value',i+1)
        if(i+1==selectedMonth){
            option.setAttribute('selected','selected')
        }
        option.textContent=shamsi_months[i]
        document.getElementById('select_month').appendChild(option)
    }
    document.getElementById('overlay').style.display='block'
}
 
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById('overlay')) {
        document.getElementById('overlay').style.display= "none";
    }
}
function renderModal(){
    let modalYear = document.getElementById('select_year').value
    let modalMonth = document.getElementById('select_month').value

    shamsiDateSpan.innerHTML=''
    miladiDateSpan.innerHTML=''
    daysDiv.innerHTML=''
    isCurrentMoth = false
    selectedYear = parseInt(modalYear)
    selectedMonth = parseInt(modalMonth)

    document.getElementById('overlay').style.display= "none";
    renderCalendar(modalYear,modalMonth,1)
}
//pray time section
let city = document.getElementById('city');
let country = document.getElementById('country');
let cityData = '';
let countryData='';
let selectedLon='';
let selectedLat='';
let selectedMethod='Tehran';

let prayCurrentDay=shamsiDate;
fetch("./countries.json")
  .then((response) => response.json())
  .then((countries) => {
    countryData = countries;
    countries.forEach(element => {
        let option = document.createElement("option");
        option.setAttribute("value",element.id);
        option.innerHTML=element.name;
        country.append(option);
    });
  });
fetch("./cities.json")
  .then((response) => response.json())
  .then((data) => {
    cityData = data;
    data.forEach(element => {
        let option = document.createElement("option");
        option.setAttribute("value",element.id);
        option.innerHTML=element.name;
        city.append(option);
    });
  });

var x = document.getElementById("times_details");
            
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
} else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
}
function showPosition(position) {
    //const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    selectedLat = position.coords.latitude;
    selectedLon = position.coords.longitude;
    calculate(position.coords.latitude, position.coords.longitude,selectedMethod);
}
function calculate(lat,lon,method){
    prayTimes.setMethod(method);
    const date = new Date();
    
    document.getElementById('coordination').innerHTML = "عرض جغرافیایی: <span class='color-blue'>" + Number(lat).toFixed(2) + 
    "</span><br>طول جغرافیایی: <span class='color-blue'>" + Number(lon).toFixed(2) + "</span>";

    renderPrayTimes(date);
}
function renderPrayTimes(date){
    let theDate = date.toLocaleDateString();
    
    let shDate = dateToShamsi(date.getFullYear(),date.getMonth()+1,date.getDate());
    prayCurrentDay = shDate;
    console.log(typeof shDate[0]);
    const today_times = prayTimes.getTimes(date, [selectedLat, selectedLon], 'auto');
    const tomorrow_times = prayTimes.getTimes([date.getFullYear(), parseInt(date.getMonth())+1, parseInt(date.getDate())+1], [selectedLat, selectedLon], 'auto');
    let tomorrow_date = new Date(date.setDate(date.getDate()+1));
    let tomorrow_shamsi = dateToShamsi(tomorrow_date.getFullYear(),tomorrow_date.getMonth()+1,tomorrow_date.getDate());
    document.getElementById('today').innerHTML = "<div class='today-title'><span class='day-title'>امروز</span><span id='go_today' onclick='goToToday()'>برو به امروز</span>"+shDate[0]+"/"+shDate[1]+"/"+shDate[2]+"</span><span onclick='showPreviousPrayTime()' class='arrow'>&#8679;قبل</div>" +
    "<table class='firstDiv'><tr><td class='time-title'>اذان صبح</td>" +
    "<td class='hours'>" + today_times.fajr + "</td>" +
    "<td class='time-title'>طلوع آفتاب</td><td class='hours'>" + today_times.sunrise + "</td></tr>" +
    "<tr><td class='time-title'>اذان ظهر</td>" +
    "<td class='hours'>" + today_times.dhuhr + "</td>" +
    "<td class='time-title'>اذان عصر</td><td class='hours'>" + today_times.asr + "</td></tr>" +
    "<tr><td class='time-title'>غروب آفتاب </td><td class='hours'>" + today_times.sunset + "</td>" +
    "<td class='time-title'>اذان مغرب </td><td class='hours'>" + today_times.maghrib+ "</td></tr></table>";
    document.getElementById('tomorrow').innerHTML ="<br><div class='today-title'><span class='day-title'>فردا</span>"+tomorrow_shamsi[0]+"/"+tomorrow_shamsi[1]+"/"+tomorrow_shamsi[2]+"</span><span onclick='showNextPrayTime()' class='arrow'>&#8681;بعد</div>" +
    "<table class='firstDiv'><tr><td class='time-title'>اذان صبح</td>" +
    "<td class='hours'>" + tomorrow_times.fajr + "</td>" +
    "<td class='time-title'>طلوع آفتاب</td><td class='hours'>" + tomorrow_times.sunrise + "</td></tr>" +
    "<tr><td class='time-title'>اذان ظهر</td>" +
    "<td class='hours'>" + tomorrow_times.dhuhr + "</td>" +
    "<td class='time-title'>اذان عصر</td><td class='hours'>" + tomorrow_times.asr + "</td></tr>" +
    "<tr><td class='time-title'>غروب آفتاب </td><td class='hours'>" + tomorrow_times.sunset + "</td>" +
    "<td class='time-title'>اذان مغرب </td><td class='hours'>" + tomorrow_times.maghrib+ "</td></tr></table>";
    if(theDate !== new Date().toLocaleDateString()){
        let days_title = document.querySelectorAll('.day-title');
        for (var i = 0; i < days_title.length; i++){
            days_title[i].style.display = "none"
         }
         document.getElementById('go_today').style.display="block";
    }
}
function getCountryCities(event){
    let selected = cityData.filter(item=>item.country==event.value);
    city.innerHTML='<option value="">شهر</option>'
    selected.forEach(element => {
        let option = document.createElement("option");
        option.setAttribute("value",element.id);
        option.innerHTML=element.name;
        city.append(option);
    });
}
function getCity(event){
    let selected = cityData.filter(item=>item.id==event.value);
    selectedLat = selected[0].lat;
    selectedLon = selected[0].lon;
    calculate(selected[0].lat,selected[0].lon,selectedMethod);
}
function setMethod(event){
    selectedMethod=event.value;
    calculate(selectedLat,selectedLon,event.value);
}
function showPreviousPrayTime(){
    //console.log(prayCurrentDay);
    //document.getElementById('today').innerHTML = "<img src='./Loading.gif' alt='loading...' height='40px'>"
    let currentDay = dateToMiladi(prayCurrentDay[0],prayCurrentDay[1],prayCurrentDay[2]);
    let currentDayFormated = currentDay[0]+"-"+currentDay[1]+"-"+currentDay[2];
    const currentdate = new Date(currentDayFormated);
    let previousDate = new Date(currentdate.setDate(currentdate.getDate()-1));
    
    renderPrayTimes(previousDate);
}
function showNextPrayTime(){
    //console.log(prayCurrentDay);
    let currentDay = dateToMiladi(prayCurrentDay[0],prayCurrentDay[1],prayCurrentDay[2]);
    let currentDayFormated = currentDay[0]+"-"+currentDay[1]+"-"+currentDay[2];
    const currentdate = new Date(currentDayFormated);
    let nextDate = new Date(currentdate.setDate(currentdate.getDate()+1));

    renderPrayTimes(nextDate);
}
function goToToday(){
    const date = new Date();
    renderPrayTimes(date);
}

