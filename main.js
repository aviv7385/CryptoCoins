/// <reference path="jquery-3.5.1.js" />

function getCoins() {
    //clear previous content
    $(".cards-container").empty()
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
        $(".cards-container").append(`
        <div class="card coinCard col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card-body">   
            <div class="row">
                <div class="col" id="coinSymbol">
                    <h5 class="card-title">${cryptRequest[i].symbol}</h5>
                </div>
                <div class="col" id="coinToggle">
                    <div class="custom-control custom-switch mySwitch">
                        <input type="checkbox" class="custom-control-input toggleCheckbox" id="customSwitch${i}">
                        <label class="custom-control-label" for="customSwitch${i}"></label>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col" id="coinName">
                    <p class="card-text">${cryptRequest[i].name}</p><br>
                </div>
            </div>
            
            <div class="row">
                <button onclick="getMoreInfo(id)" id="${cryptRequest[i].id}" class="btn btn-warning moreInfoBtn" type="button" data-toggle="collapse" data-target="#collapseExample${i}" aria-expanded="false" aria-controls="collapseExample${i}">
                    More Info
                </button>
        
                <div class="collapse" id="collapseExample${i}">
                    <div class="card card-body moreInfo">
                    
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
            $(".moreInfo").html(
                `<img class="coinPic" src="${infoRequest.image.small}"><br>
                USD: $${infoRequest.market_data.current_price.usd}<br>
                EUR: &euro;${infoRequest.market_data.current_price.eur}<br>
                ILS: ${infoRequest.market_data.current_price.ils}&#8362;<br>`
            )
        }
    });
}

//on page load, call this function
getCoins();

// a function to display the "about" page

function displayAboutMe() {
    //remove previous content and insert new content
    $(".cards-container").empty()
    $(".cards-container").append(`
    <div class="aboutMe col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <h3 class="aboutMeHead">ABOUT ME: AVIV ELAD</h3>
        <img src="Assets/images/my pic.jpg" id="myPic">
        <p class="aboutMePar">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tristique senectus et netus et malesuada fames ac turpis. Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Ornare arcu odio ut sem. Lorem donec massa sapien faucibus et molestie ac. Eu volutpat odio facilisis mauris sit. Eu feugiat pretium nibh ipsum consequat nisl vel pretium. Laoreet id donec ultrices tincidunt arcu non sodales neque. Duis tristique sollicitudin nibh sit amet commodo nulla. Risus nec feugiat in fermentum posuere urna. Vulputate enim nulla aliquet porttitor lacus luctus accumsan. Felis imperdiet proin fermentum leo vel orci porta. Non arcu risus quis varius. Imperdiet proin fermentum leo vel orci porta non. Quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit. Massa id neque aliquam vestibulum morbi. Elit duis tristique sollicitudin nibh sit. Sed elementum tempus egestas sed sed risus.</p>
    </div>
    <div class="aboutProject col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <h3 class="aboutProHead">ABOUT THE PROJECT</h3>
        <p class="aboutProPar">Feugiat scelerisque varius morbi enim. Id nibh tortor id aliquet lectus. Vitae semper quis lectus nulla at. In massa tempor nec feugiat nisl pretium fusce. Dignissim suspendisse in est ante in nibh. Integer quis auctor elit sed vulputate mi sit amet. Quisque non tellus orci ac auctor augue mauris. Erat pellentesque adipiscing commodo elit at imperdiet dui accumsan sit. Lorem donec massa sapien faucibus et molestie ac feugiat sed. Nisi lacus sed viverra tellus in. Non enim praesent elementum facilisis leo vel. Morbi leo urna molestie at elementum eu facilisis.</p>
    </div>
    `)

}


