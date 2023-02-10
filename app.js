// Get elements from the HTML page
let randomMealCard = document.getElementById("randomMealCard");
let homeButton = document.getElementById("home-button");
let searchBar = document.getElementById("searchBar");
let searchButton = document.getElementById("SearchButton");
let searchInput = document.getElementById("searchInput");
let modal = document.getElementById("myModal");
let ingredients = document.getElementById("ingredients");
let span = document.getElementsByClassName("close")[0];
let mode = document.getElementsByClassName("modeButton");
let results = document.getElementById("results");

// Global variables
let mealCard;
let selectedMode;

// Function to fetch a random meal from an API
async function randomMeal() {
  let arr;
  // Fetch data from the API
  await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((data) => data.json())
    .then((e) => {
      arr = e;
    })
    .catch((error) => console.log(error));

  // Update the innerHTML of the randomMealCard element with the fetched data
  randomMealCard.innerHTML = `<div class="meal">
  <img class="mealimg" src=${arr.meals[0].strMealThumb}>
  <h3>${arr.meals[0].strMeal}</h3> </div>`;

  // Add an event listener to the randomMealCard element
  randomMealCard.addEventListener("click", (e) => {
    // Get the parent element of the clicked target
    const parent = e.target.parentNode;
    // Get the h3 element from the parent
    const h3 = parent.getElementsByTagName("h3")[0];
    // Call the ingredientListMaker function and pass the h3 inner text as a parameter
    ingredientListMaker(h3.innerText);
  });
};

// Event listener for the search button
searchButton.onclick = () => {
  // Get the value of the search bar
  let input = searchBar.value;
  // Check if a mode has been selected
  if (selectedMode == undefined) {
    window.alert("Please select any mode of search.");
    // Check if the search bar is empty
  } else if (input == "") {
    searchInput.innerText = "Please enter a keyword to search";
    results.innerHTML = "";
  } else {
    // Update the inner text of the searchInput element
    searchInput.innerText = `Search Results for "${input}"`;
    // Call the searchMealBasedOnInput function and pass the input and selectedMode as parameters
    searchMealBasedOnInput(input, selectedMode);
  };
};

// Function to fetch meals from API
async function searchMealBasedOnInput(input, mode) {
  // Check the selected mode of search
  if (mode == "mode1") {
    // Fetch the data from API based on input and selected mode
    await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${input}`)
      .then((data) => data.json())
      .then((e) => {
        // Check if the result is not null
        if (e.meals != null) {
          // Call the function to render the search result
          renderSearchResult(e);
        } else {
          // Clear the search result and show "Not found!" if result is null
          results.innerHTML = "";
          results.innerText = "Not found!";
        };
      });
  } else if (mode == "mode2") {
    // Fetch the data from API based on input and selected mode
    await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${input}`)
      .then((data) => data.json())
      .then((e) => {
        // Check if the result is not null
        if (e.meals != null) {
          // Call the function to render the search result
          renderSearchResult(e);
        } else {
          // Clear the search result and show "Not found!" if result is null
          results.innerHTML = "";
          results.innerText = "Not found!";
        };
      });
  } else if (mode == "mode3") {
    // Fetch the data from API based on input and selected mode
    await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${input}`)
      .then((data) => data.json())
      .then((e) => {
        // Check if the result is not null
        if (e.meals != null) {
          // Call the function to render the search result
          renderSearchResult(e);
        }
      }).catch((error)=>{
        results.innerHTML = "";
        results.innerText = "Not found!";
      })
  };
};

// Renders the search result as meal cards
function renderSearchResult(arrays) {
  results.innerHTML = "";
  arrays.meals.forEach((array) => {
    results.innerHTML += `<div class="meal">
    <img class="mealimg" src=${array.strMealThumb}>
    <h3>${array.strMeal}</h3> </div>`;
  });
  // Add event listener to meal cards
  mealCard = document.querySelectorAll(".meal");
  eventListener();
};

// Add click event to meal cards
function eventListener() {
  for (let i = 0; i < mealCard.length; i++) {
    const element = mealCard[i];
    element.onclick = (e) => {
      const parent = e.target.parentNode;
      const h3 = parent.getElementsByTagName("h3")[0];
      // Show the ingredients list on meal card click
      ingredientListMaker(h3.innerText);
    };
  };
};

// Function to make ingredientList of any specific meal
async function ingredientListMaker(name) {
  let list;

  // Fetch data from API using `name` as a parameter
  await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    .then((data) => data.json())
    .then((e) => {
      list = e;
    });

  // Clear the previous content in the ingredients container
  ingredients.innerHTML = "";

  // Loop through the ingredients and display them on the page
  for (let i = 1; i < 21; i++) {
    let ingredient = list.meals[0][`strIngredient${i}`];

    // If there's no more ingredients, break the loop
    if (!ingredient) {
      break;
    };

    // Add the ingredient to the ingredients container
    ingredients.innerHTML += `${i}.${ingredient}<br>`;
  };

  // Display the modal
  modal.style.display = "block";
}
// Loop through each mode button and attach an event listener to it
for (let i = 0; i < mode.length; i++) {
  mode[i].onclick = (e) => {
    // Reset the color and background-color of all mode buttons
    for (let j = 0; j < mode.length; j++) {
      mode[j].style.color = "rgb(29, 26, 26)";
      mode[j].style.backgroundColor = "white";
    };
    // Change the color and background-color of the clicked mode button
    mode[i].style.color = "white";
    mode[i].style.backgroundColor = "black";
    // Store the selected mode
    selectedMode = e.target.id;
  };
};

// Attach an event listener to the home button
homeButton.onclick = () => {
  window.location = "index.html";
};

// Attach an event listener to the span (close button) of the modal
span.onclick = function () {
  modal.style.display = "none";
};

// Attach an event listener to the window for closing the modal when clicking outside of it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Trigger the randomMeal function when the page is loaded
window.addEventListener("load", randomMeal);
