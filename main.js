/// <reference path="jquery-3.5.1.js" />

function getCoins() {
    //get the Promise object by calling the function where the Promise object was created
    //and give the desired url as an object
    getJsonFromServer("https://api.coingecko.com/api/v3/coins/list")
        .then(cryptCoins => displayCoins(cryptCoins)) //then() >> built-in function that calls a function to report on success (resolve)
        .catch(err => alert(`Error! Status: ${err.status}, ${err.statusTest}`)); //catch() >> built-in function that calls a function to report on error (reject)
}

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

//this function gets an object as an argument and will display the wanted information from that object 
function displayCoins(cryptRequest) {
    for (let i = 0; i < 300; i++) {
        $(".cards-container").append(`<div class="card coinCard">
        <div class="card-body">   
            <div class="row">
                <div class="col">
                    <h5 class="card-title">${cryptRequest[i].symbol}</h5>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch mySwitch">
                        <input type="checkbox" class="custom-control-input" id="customSwitch${i}">
                        <label class="custom-control-label" for="customSwitch${i}"></label>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col">
                    <p class="card-text">${cryptRequest[i].name}</p><br>
                </div>
            </div>
            
            <div class="row">
                <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample${i}" aria-expanded="false" aria-controls="collapseExample${i}">
                    More Info
                </button>
        
                <div class="collapse" id="collapseExample${i}">
                    <div class="card card-body">
                        
                    </div>
                </div>
            </div>
        </div>
        </div>`)
    }
}

// a function to get extra info about each coin (that will be displayed in the collapse component)
function getMoreInfo(id) {
    $.ajax({
        url: `https://api.coingecko.com/api/v3/coins/${id}`,
        error: err => alert(err),
        success: infoRequest => {
            $(".collapse > .card-body").html(
                `USD: $${infoRequest.market_data.current_price.usd}<br>
                 EUR: &#8352;${infoRequest.market_data.current_price.eur}<br>
                 ILS: ${infoRequest.market_data.current_price.ils}&#8362;<br>`
            )
        }
    });
}

getCoins()

//$(".btn").on("click", getMoreInfo(cryptRequest[i].name));