let container = document.querySelector('.container');
let buttons = document.querySelectorAll('.main-button');
let subs = document.querySelectorAll('.sub-button');
let fish = document.querySelector('#fish');
let bugs = document.querySelector('#bugs');

let currentArray = [];
let favoritesArray = [];

//const storedName = localStorage.getItem(nameKey);

const API_URL = "https://api.nookipedia.com/"
const API_KEY = "ee03ae8c-8f89-495a-a9ed-d4e07fa9df9f"


        let getData = (url) => {
            let xhr = new XMLHttpRequest();

            xhr.onload = dataLoaded;

            xhr.onerror = dataError;

            xhr.open("GET",url);
            xhr.send();
        }

        let dataLoaded = (e) => {
            let xhr = e.target;

            let obj = JSON.parse(xhr.responseText);

            currentArray = Object.values(obj);
        }

        let dataError = (e) => {
            console.log("An error occured")
        }

        let buttonPress = (e) => {
            let url = API_URL;
            if (e.target.value === "villagers") {
                url += e.target.value + "?api_key=" + API_KEY;
            }
            else {
                url += "nh/" + e.target.value + "?api_key=" + API_KEY;
            }
            

            console.log(e.target);

            container.innerHTML = "";

            getData(url);

            filterFish(e);

            filterBugs(e);


            if (e.target.value === "fish" || e.target.value === "bugs") {
                displayBugOrFish();
            } 
            else if (e.target.value === "fossils") {
                displayFossil();
            }
            else if (e.target.value === "villagers") {
                displayVillagers();
            }
        }

        let displayBugOrFish = () => {
            currentArray.forEach(result => {
                container.insertAdjacentHTML(
                    "beforeend", 
                    `<div class='result'>
                        <div class='result-card'>
                        <div class='front'>
                            <img src=${result.image_uri} />
                        </div>
                        <div class='back'>
                            <p>${result.name['name-USen']}</p>
                            <p>Months Available: </p>
                            <p>Location: </p>
                            <p>Rarity: </p>
                            <p>Price: ${result.price}</p>
                        </div>
                        </div>
                    </div>`)
            });
        }

        let displayFossil = () => {
            currentArray.forEach(result => {
                container.insertAdjacentHTML(
                    "beforeend", 
                    `<div class='result'>
                        <div class='result-card'>
                        <div class='front'>
                            <img src=${result.image_uri} />
                        </div>
                        <div class='back'>
                            <p>${result.name['name-USen']}</p>
                            <p>Price: ${result.price}</p>
                        </div>
                        </div>
                    </div>`)
            });
        }

        let displayVillagers = () => {
            currentArray.forEach(result => {
                container.insertAdjacentHTML(
                    "beforeend", 
                    `<div class='result'>
                        <div class='result-card'>
                        <div class='front'>
                            <img src=${result.image_uri} />
                        </div>
                        <div class='back'>
                            <p>${result.name['name-USen']}</p>
                            <p>Species: ${result.species}</p>
                            <p>Gender: ${result.gender}</p>
                            <p>Hobby: ${result.hobby}</p>
                            <p>Birthday: ${result['birthday-string']}</p>
                        </div>
                        </div>
                    </div>`)
            });
        }

        let filterFish = (e) => {
            if (e.target.dataset.location === "Sea") {
                currentArray = currentArray.filter(critter => critter.availability.location === "Sea")
            }
            else if (e.target.dataset.location === "River") {
                currentArray = currentArray.filter(critter => 
                    critter.availability.location === "River" || critter.availability.location === "River (Clifftop)" || critter.availability.location === "River (Mouth)")
            }
            else if (e.target.dataset.location === "Pond") {
                currentArray = currentArray.filter(critter => critter.availability.location === "Pond")
            }
        }

        let filterBugs = (e) => {
            if (e.target.dataset.location === "Flying") {
                currentArray = currentArray.filter(critter => critter.availability.location === "Flying")
            }
            else if (e.target.dataset.location === "Ground") {
                currentArray = currentArray.filter(critter => critter.availability.location === "On the ground")
            }
            else if (e.target.dataset.location === "Trees") {
                currentArray = currentArray.filter(critter => 
                    critter.availability.location === "On trees" || critter.availability.location === "On palm trees" || critter.availability.location === "On tree stumps")
            }
        }


        buttons.forEach(button => {
            button.addEventListener("click", buttonPress)
        });

        subs.forEach(button => {
            button.addEventListener("click", buttonPress)
        })
        