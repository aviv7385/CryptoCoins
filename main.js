/// <reference path="jquery-3.5.1.js" />

//on page load, call this function
getCoins();

function getCoins() {
    //clear previous content
    $(".cards-container").empty()

    //show spinner (progress bar)
    $(".cards-container").html(`
    <div class="d-flex justify-content-center">
        <div class="spinner-border text-warning" role="status">
            <span class="sr-only"></span>
        </div>
    </div>
    `)

    //get the Promise object by calling the function where the Promise object was created
    //and give the desired url as an object
    getJsonFromServer("https://api.coingecko.com/api/v3/coins/list")
        .then(cryptRequest => {
            //clear previous content - specifically the spinner
            $(".cards-container").empty()
            displayAllCoins(cryptRequest)
        }) //then() >> built-in function that calls a function to report on success (resolve)
        .catch(err => console.log(err)); //catch() >> built-in function that calls a function to report on error (reject)
}

//------------------------------------------------------------------------------------------------------------------

// a function that gets a url as an argument
// and returns a Promise object, which gets 2 arguments: resolve (successCallback) and reject (errorCallback)
function getJsonFromServer(jsonUrl) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: jsonUrl,
            success: jsonRequest => resolve(jsonRequest),
            error: err => reject(err),
        })
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
                    <input type="checkbox" class="custom-control-input toggleCheckbox" id="customSwitch${index}" width="100">
                    <label class="custom-control-label" for="customSwitch${index}"></label>
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
    </div>`)
}


//this function gets an object (from an API) as an argument and will display the wanted information from that object 
//by calling the displayCoinCard function
function displayAllCoins(cryptRequest) {
    //remove from local storage any former array of allCoins (otherwise the same 300 coins will be added to the same array, 
    //making the array grow larger each time the loop runs)
    localStorage.removeItem("allCoins");
    //iterate through the objects array received from the server
    for (let i = 0; i < 300; i++) {
        //add each coin object to the objects array which is being saved to the local storage
        saveToLocalStorage(cryptRequest[i]);
        displayCoinCard(cryptRequest[i], i);
    }
}

//------------------------------------------------------------------------------

// ======================== MORE INFO =======================

// a function to get extra info about each coin 
function getMoreInfo(id, index) {
    //show spinner (progress bar)
    $(`#moreInfo${index}`).html(`
    <div class="d-flex justify-content-center">
        <div class="spinner-border text-warning" role="status">
            <span class="sr-only"></span>
        </div>
    </div>
    `)
    getJsonFromServer(`https://api.coingecko.com/api/v3/coins/${id}`)
        .then(moreInfoRequest => {
            //clear previous content (specifically - the spinner)
            $(`#moreInfo${index}`).empty();
            displayMoreInfo(moreInfoRequest, index)
        })
        .catch(err => console.log(err))
}

// a function to display the "more info" in the collapse area, when clicking the "more info" button
function displayMoreInfo(infoRequest, index) {
    $(`#moreInfo${index}`).html(
        `<img class="coinPic" src="${infoRequest.image.small}"><br>
        USD: $${infoRequest.market_data.current_price.usd}<br>
        EUR: &euro;${infoRequest.market_data.current_price.eur}<br>
        ILS: ${infoRequest.market_data.current_price.ils}&#8362;<br>`
    )
}

//-------------------------------------------------------------------------------------------

//=========== ABOUT ==================

// a function to display the "about" page when clicking the "about" button
$("#aboutBtn").on("click", function () {
    //remove previous content and insert new content
    $(".cards-container").empty()
    $(".cards-container").append(`
    <div class="aboutMe col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <h3 class="aboutMeHead">ABOUT ME</h3>
        <img src="Assets/images/my pic.jpg" id="myPic">
        <p class="aboutMePar">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tristique senectus et netus et malesuada fames ac turpis. Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Ornare arcu odio ut sem. Lorem donec massa sapien faucibus et molestie ac. Eu volutpat odio facilisis mauris sit. Eu feugiat pretium nibh ipsum consequat nisl vel pretium. Laoreet id donec ultrices tincidunt arcu non sodales neque. Duis tristique sollicitudin nibh sit amet commodo nulla. Risus nec feugiat in fermentum posuere urna. Vulputate enim nulla aliquet porttitor lacus luctus accumsan. Felis imperdiet proin fermentum leo vel orci porta. Non arcu risus quis varius. Imperdiet proin fermentum leo vel orci porta non. Quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit. Massa id neque aliquam vestibulum morbi. Elit duis tristique sollicitudin nibh sit. Sed elementum tempus egestas sed sed risus.</p>
    </div>
    <div class="aboutProject col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <h3 class="aboutProHead">ABOUT THE PROJECT</h3>
        <p class="aboutProPar">Feugiat scelerisque varius morbi enim. Id nibh tortor id aliquet lectus. Vitae semper quis lectus nulla at. In massa tempor nec feugiat nisl pretium fusce. Dignissim suspendisse in est ante in nibh. Integer quis auctor elit sed vulputate mi sit amet. Quisque non tellus orci ac auctor augue mauris. Erat pellentesque adipiscing commodo elit at imperdiet dui accumsan sit. Lorem donec massa sapien faucibus et molestie ac feugiat sed. Nisi lacus sed viverra tellus in. Non enim praesent elementum facilisis leo vel. Morbi leo urna molestie at elementum eu facilisis.</p>
    </div>
    `)
})

//-----------------------------------------------------------------------------------------------

//=============== TOGGLE BUTTONS ===================


//---------------------------------------------------------------------------

//saving to local storage
function saveToLocalStorage(coinObj) {
    let allCoins = [];

    let allCoinsJsonString = localStorage.getItem("allCoins");
    if (allCoinsJsonString != null) {
        allCoins = JSON.parse(allCoinsJsonString);
    }

    allCoins.push(coinObj);

    allCoinsJsonString = JSON.stringify(allCoins);
    localStorage.setItem("allCoins", allCoinsJsonString);
}

//-------------------------------------------------------------------------------

//======= SEARCH ========

// this function gets a string as an argument and checks if this string matches to any of the specified obj fields 
// that are in the array that is saved in the local storage
// if it is - the object (coin) will be displayed 
// if it isn't - the user will get an error

function searchCoin(value) {
    //clear the search input field 
    $("#searchInput").val("");
    //get coins objects array from local storage
    let allCoinsJsonString = localStorage.getItem("allCoins");
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
        if (coin.name.includes(value) || coin.symbol == value) {
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






