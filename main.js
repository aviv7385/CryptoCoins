/// <reference path="jquery-3.5.1.js" />

//on page load, call this function
getCoins();

//event function - when clicking on the "Home" button - call the getCoins function
$(function () {
    $("#homeBtn").on("click", getCoins);
})

async function getCoins() {
    //clear previous content
    $(".cards-container").empty();

    //show spinner (progress bar)
    $(".cards-container").html(`
    <div class="d-flex justify-content-center">
        <div class="spinner-border text-light" role="status">
            <span class="sr-only"></span>
        </div>
    </div>
    `);

    try {
        // get the Promise object by calling the function where the Promise object was created
        // and give the desired url as an object
        const cryptRequest = await getJsonFromServer("https://api.coingecko.com/api/v3/coins/list");
        // clear previous content - specifically the spinner
        $(".cards-container").empty();
        // display all coin cards
        displayAllCoins(cryptRequest);
    }

    catch (err) {
        console.log(err);
    }
}
//------------------------------------------------------------------------------------------------------------------

// a function that gets a url as an argument
// and returns a Promise object, which gets 2 arguments: resolve (successCallback) and reject (errorCallback)
function getJsonFromServer(jsonUrl) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: jsonUrl,
            success: jsonRequest => resolve(jsonRequest),
            error: err => reject(err)
        });
    });
}

//--------------------------------------------------------------------------------------------------------

//a function to display a card with coin information
function displayCoinCard(coin, index) {
    $(".cards-container").append(`
    <div class="card coinCard col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3 mb-4">
    <div class="card-body">   
        <div class="row">
            <div class="col" id="coinSymbol">
                <h5 class="card-title">${coin.symbol}</h5>
            </div>
            <div class="col-3" id="coinToggle">
                <div class="custom-control custom-switch mySwitch">
                    <input type="checkbox" class="custom-control-input toggleCheckbox" onclick="toggleCheckbox(id)" id="${coin.symbol}" width="100">
                    <label class="custom-control-label" for="${coin.symbol}"></label>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col" id="coinName">
                <p class="card-text">${coin.name}</p><br>
            </div>
        </div>
        
        <div class="row">
            <button onclick="getMoreInfo(id, ${index})" id="${coin.id}" class="btn btn-warning moreInfoBtn" type="button" data-toggle="collapse" data-target="#collapseExample${index}" aria-expanded="false" aria-controls="collapseExample${index}">
                More Info
            </button>
    
            <div class="collapse" id="collapseExample${index}">
                <div class="card card-body moreInfo" id="moreInfo${index}">
                
                </div>
            </div>
        </div>
    </div>
    </div>`);
}

//this function gets an object (from an API) as an argument and will display the wanted information from that object 
//by calling the displayCoinCard function
function displayAllCoins(cryptRequest) {
    //remove from local storage any former array of allCoins (otherwise the same 300 coins will be added to the same array, 
    //making the array grow larger each time the loop runs)
    sessionStorage.removeItem("allCoins");
    //iterate through the objects array received from the server
    for (let i = 0; i < 300; i++) {
        //add each coin object to the objects array which is being saved to the local storage
        saveCoinsToSessionStorage(cryptRequest[i]);
        displayCoinCard(cryptRequest[i], i);
    }
}

// ======================== MORE INFO =======================

// a function to get extra info about each coin (from the server)
async function getMoreInfo(id, index) {
    // show spinner (progress bar)
    $(`#moreInfo${index}`).html(`
    <div class="d-flex justify-content-center">
        <div class="spinner-border text-warning" role="status">
            <span class="sr-only"></span>
        </div>
    </div>
    `)

    try {
        const savedInfo = sessionStorage.getItem(id);

        if (savedInfo == null) {
            // get data from remote server
            const moreInfoRequest = await getJsonFromServer(`https://api.coingecko.com/api/v3/coins/${id}`);
            // clear previous content (specifically - the spinner)
            $(`#moreInfo${index}`).empty();
            // display the data in the collapse area of the specific coin
            displayMoreInfo(moreInfoRequest, index);
        }
        else {
            $(`#moreInfo${index}`).html(savedInfo);
        }
    }
    catch (err) {
        console.log(err);
    }
}

// a function to display the "more info" in the collapse area, when clicking the "more info" button
function displayMoreInfo(infoRequest, index) {
    const currentCoinPrice = infoRequest.market_data.current_price;

    let moreInfo = `<img class="coinPic" src="${infoRequest.image.small}"><br>
    USD: $${currentCoinPrice.usd}<br>
    EUR: &euro;${currentCoinPrice.eur}<br>
    ILS: ${currentCoinPrice.ils}&#8362;<br>`;

    $(`#moreInfo${index}`).html(moreInfo);

    sessionStorage.setItem(infoRequest.id, moreInfo);//save info to session storage
    twoMinutesTimer(infoRequest.id);  // after 2 minutes have passed - remove this info from the session storage
}

// remove item from session storage, 2 minutes after it was saved
function twoMinutesTimer(id) {
    setTimeout(() => {
        sessionStorage.removeItem(id);
    }, 120000)
}


//==================== ABOUT ===========================

// a function to display the "about" page when clicking the "about" button
$("#aboutBtn").on("click", function () {
    //remove previous content and insert new content
    $(".cards-container").empty()
    $(".cards-container").append(`
    <div class="aboutMe col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <h3 class="aboutMeHead">ABOUT ME</h3>
        <img src="Assets/images/my pic.jpg" id="myPic">
        <p class="aboutMePar">
            My name is Aviv Elad and I study Fullstack Web Development. If anyone would have told me 3 years ago that in 3 years I would change my career completely into that of a programmer - I would have laughed at the good joke. I have a BA in Linguistics from Tel Aviv University and I worked in the tourism and hospitality industry. I loved my job, I loved meeting new people every day from all over the world, but still - something was missing. Now I understand that I needed a new challenge in my life, and that is where programming came into the picture. 
        </p>
    </div>
    <div class="aboutProject col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <h3 class="aboutProHead">ABOUT THE PROJECT</h3>
        <p class="aboutProPar">
            I have done this project for the Fullstack Web Development course I am taking at John Bryce college. The object of this project is to display real live information about crypto coins (such as bitcoin), by using a remote API. Some of the features in this website are:
            <ul>
                <li>Displaying 300 coins (out of 6000)</li>
                <li>Displaying extra information on each coin (image and currency rates)</li>
                <li>Searching for specific coins and displaying them (if found)</li>
                <li>Choosing up to 5 coins and displaying a live report regarding currency rate (specifically USD)</li>
            </ul>
            The technologies I used:
            <ul>
                <li>HTML5</li>
                <li>CSS3</li>
                <li>Java Script</li>
                <li>Bootstrap</li>
                <li>jQuery</li>
            </ul>
            Thank you for visiting my website!<br>
            Contact me: &nbsp;
            <a href="https://github.com/aviv7385"><img class="logo" src="Assets/images/GitHubLogo.png" alt="GitHubProfile"></a> &nbsp;
            <a href="https://www.linkedin.com/in/aviv-elad-a3b1a3105/"><img class="logo" src="Assets/images/linkedinLogo.png" alt="LinkedinProfile"></a>

        </p>
    </div>
    `);
});

//========================= TOGGLE SWITCH BUTTONS ==============================

// when choosing a coin by checking the toggle checkbox, push it into an array 
// if the user chooses more than 5 coins - display a popup modal and ask the user to remove a coin or more, so there
//would be no more than 5 coins

let checkboxArray = []; // create an empty array for the coins the user will choose. I want this to be a global variable so I can access it in more functions.

function toggleCheckbox(coin) {
    if ($(`#${coin}`).is(":checked")) { // if the switch button is checked - add it to the array
        checkboxArray.push(coin);
    }
    else { // if the switch button gets unchecked - remove it from the array
        const existingIndex = checkboxArray.indexOf(coin);
        if (existingIndex > -1) {
            checkboxArray.splice(existingIndex, 1);
        }
    }
    // save the array to session storage
    sessionStorage.setItem("chosenCoins", checkboxArray);

    console.log(checkboxArray);

    // if the user chooses more than 5 coins - display the modal with a list of the chosen coins 
    // and ask the user to take on (or more) off 
    if (checkboxArray.length > 5) {
        const numOfCoins = checkboxArray.length;
        const difference = numOfCoins - 5;
        $("#modalText").html(""); // delete previous content
        $("#modalText").html(`You chose ${numOfCoins} coins, please remove ${difference}`);
        // for each chosen coin - create a button with the coin's symbol (those buttons will be displayed in the popup modal) 
        const chosenCoins = checkboxArray.map(coin => `<button onclick="removeCoins(value)" class="btn btn-warning removeCoinBtn" type="button" value=${coin}>${coin}</button>`);
        $(".chosenCoins").html("").append(`
            <div>
            ${chosenCoins.join("  ")}
            </div>
        `)
        myModal.style.display = "block"; // display the popup modal
    }
}

// Get the modal obj
const myModal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const closeModal = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function () {
    myModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == myModal) {
        myModal.style.display = "none";
    }
}

// when the user clicks a coin button (inside the modal) - remove that coin from the chosen coins array
// and remove the button from the modal
function removeCoins(coinValue) {
    const existingIndex = checkboxArray.indexOf(coinValue);
    if (existingIndex > -1) {
        checkboxArray.splice(existingIndex, 1);
        $(`#${coinValue}`).prop("checked", false);//if a coin was removed - update its switch button (from "checked" to "unchecked") in the coin card 
        console.log(checkboxArray);
    }
    $(`.removeCoinBtn[value|='${coinValue}']`).fadeOut('slow');
}

//save button
$(".saveBtn").on("click", function () {
    //validate that there up to 5 coins before saving the array
    if (checkboxArray.length > 5) {
        const numOfCoins = checkboxArray.length;
        const difference = numOfCoins - 5;
        $("#modalText").html(""); // delete previous content
        $("#modalText").html(`You still have ${numOfCoins} coins, please remove ${difference}`);
    }
    else {
        //if the user chose 5 coins or less - save the array in the session storage (for later use) and close the modal
        sessionStorage.setItem("chosenCoins", checkboxArray);
        myModal.style.display = "none";
    }
});

//each time the user clicks on the "Home" button or refreshes the website - remove the array of chosen coins from the session storage
$(function () {
    // when navigating to home page - remove previous data from the session storage
    $("#homeBtn").on("click", function () {
        sessionStorage.removeItem("chosenCoins");
        checkboxArray = [];
    });
    //on page load - remove previous data from the session storage
    sessionStorage.removeItem("chosenCoins");
})

// ========================== LIVE REPORTS =================================

$(function () {
    $("#reportsBtn").on("click", getLiveData);
})

async function getLiveData() {
    chosenCoinsArray = sessionStorage.getItem("chosenCoins");

    if (chosenCoinsArray == null || chosenCoinsArray.length == 0) {
        alert("You haven't selected any coin.\n Please select at least one coin to display a report.");
    }

    else {
        //console.log(chosenCoinsArray);
        //clear previous content
        $(".cards-container").empty();

        //show spinner (progress bar)
        $(".cards-container").html(`
                <div class="d-flex justify-content-center">
                    <div class="spinner-grow text-warning" role="status">
                        <span class="sr-only"></span>
                    </div>
                </div>
                `);

        try {
            // //get the Promise object by calling the function where the Promise object was created
            //and give the desired url as an object
            const liveReportRequest = await getJsonFromServer(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${chosenCoinsArray}&tsyms=USD&api_key=b41c8b68d3f67f83019e2d0f099344d05e56f8a08e802d0349ca611f95aa3c48`);

            //clear previous content - specifically the spinner
            $(".cards-container").html(
                `<div class="test"><h1 class="wip">COMING SOON</h1></div>`
            );

            
        }
        catch (err) {
            console.log(err)
        }
    }
}
//---------------------------------------------------------------------------

//save the array of coins objects (returned from the server) as an array of objects in the session storage
//for the search feature (so the search will be produced locally instead of having to get information from the server each time)
function saveCoinsToSessionStorage(coinObj) {
    let allCoins = [];
    let allCoinsJsonString = sessionStorage.getItem("allCoins");
    if (allCoinsJsonString != null) {
        allCoins = JSON.parse(allCoinsJsonString);
    }
    allCoins.push(coinObj);
    allCoinsJsonString = JSON.stringify(allCoins);
    sessionStorage.setItem("allCoins", allCoinsJsonString);
}

//========================= SEARCH ============================

// this function gets a string as an argument and checks if this string matches to any of the specified obj fields 
// that are in the array that is saved in the local storage
// if it is - the object (coin) will be displayed 
// if it isn't - the user will get an error

function searchCoin(value) {
    //clear the search input field 
    $("#searchInput").val("");
    //get coins objects array from local storage
    let allCoinsJsonString = sessionStorage.getItem("allCoins");
    if (allCoinsJsonString != null) {
        allCoins = JSON.parse(allCoinsJsonString);
    }

    //validate the value entered is not an empty string
    if (value == "" || value.trim().length < 1 || value.length < 3) {
        throw new Error("Please enter at least 3 characters");
    }
    //clear previous content
    $(".cards-container").empty();

    // create a flag for the searched input
    let isFound = false;

    // iterate through the array of coins and compare the input value to the name/id/symbol of each coin
    // if any of the includes the input - display those coins and change the flag to "true"
    for (let i = 0; i < allCoins.length; i++) {
        const coin = allCoins[i];
        if (coin.name.includes(value.toUpperCase()) || coin.name.includes(value.toLowerCase()) || coin.symbol.includes(value.toUpperCase()) || coin.symbol.includes(value.toLowerCase())) {
            displayCoinCard(coin, i);
            isFound = true;
        }
    }

    // if not match was found - meaning the flag is false - show an error message
    if (!isFound) {
        throw new Error("Sorry, coin not found");
    }
}

// a function for the search feature
// on click on the search button, call the searchCoin function
//if there was an error in that function - show the error on alert
$("#searchBtn").on("click", function () {
    const searchInput = $("#searchInput").val();

    try {
        searchCoin(searchInput);
    }
    catch (err) {
        alert(err);
    }
})

// -----------------------------------------------------------------------------------






