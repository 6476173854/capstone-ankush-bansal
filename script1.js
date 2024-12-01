// Author Ankush Bansal
// Version 1.0
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('date-form');
    const apodContainer = document.getElementById('apod-container');
    const favouritesContainer = document.getElementById('favourites-container');

    const apiKey = '6GGh12bLupFe7UheeGeRuWa3S5hFLP8oJqC0iuDZ'; 
// The submit event is triggered when the user submits the form.
// The value of the input (the date) is retrieved using document.getElementById('date-input').value.
// If the date is provided (i.e., not empty), it fetches data from the NASA API using the fetchApodData() function and then displays it with displayApod().
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const date = document.getElementById('date-input').value;
        if (date) {
            const apodData = await fetchApodData(date);
            displayApod(apodData);
        }

    });
// The fetchApodData(date) function sends an API request to NASA's Astronomy Picture of the Day (APOD) service.
// The response is then converted to JSON and returned.
// If an error occurs, it logs an error message to the console.
    function fetchApodData(date) {
        return fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`)
            .then(response => response.json())
            .catch(error => console.error('Error fetching APOD data:', error));
    }
// This function is responsible for rendering the APOD information on the page.
// It renders the APOD data (image, title, explanation, etc.) onto the webpage.
// When the image is clicked, it opens the high-definition version in a new tab.
// It creates a "Save to Favourites" button that, when clicked, saves the current APOD data to local storage.
    function displayApod(data) {
        const { url, title, date, explanation, hdurl } = data;
        apodContainer.innerHTML = `
            <h3>${title}</h3>
            <p>${date}</p>
            <img src="${url}" alt="${title}" id="apod-image">
            <p>${explanation}</p>
        `;
        const apodImage = document.getElementById('apod-image');
        apodImage.addEventListener('click', () => {
            window.open(hdurl, '_blank');
        });
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save to Favourites';
        saveButton.className = 'btn btn-success my-3';
        saveButton.addEventListener('click', () => saveToFavourites(data));
        apodContainer.appendChild(saveButton);
    }
// This function handles adding the current APOD data to the local storage as a "favourite."
// It retrieves the current list of favourites from localStorage.
// It checks if the current APOD (data) is already in the favourites list by checking the date.
// If the date is not already in the favourites, it adds the APOD to the list and updates localStorage.
    function saveToFavourites(data) {
        let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        if (!favourites.some(fav => fav.date === data.date)) {
            favourites.push(data);
            localStorage.setItem('favourites', JSON.stringify(favourites));
            displayFavourites();
        }
    }
// Displaying Favourites
// This function displays the list of saved favourites.
// It fetches the list of favourites from localStorage and loops through them to display each one.
// Each favourite has a "Delete" button that allows the user to remove it from the list.

    function displayFavourites() {
        favouritesContainer.innerHTML = '';
        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        favourites.forEach(favourite => {
            const { url, title, date } = favourite;
            const favouriteDiv = document.createElement('div');
            favouriteDiv.className = 'col-md-4 favourite';
            favouriteDiv.innerHTML = `
                <img src="${url}" alt="${title}">
                <button class="delete-button">Delete</button>
                <h5>${title}</h5>
                <p>${date}</p>
            `;
            favouriteDiv.querySelector('.delete-button').addEventListener('click', () => {
                deleteFavourite(date);
            });
            favouritesContainer.appendChild(favouriteDiv);
        });
    }

// Deleting a Favourite
// It retrieves the list of favourites from localStorage.
// It filters out the favourite that matches the given date and updates localStorage.
// It then re-displays the updated list of favourite


    function deleteFavourite(date) {
        let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        favourites = favourites.filter(favourite => favourite.date !== date);
        localStorage.setItem('favourites', JSON.stringify(favourites));
        displayFavourites();
    }

    displayFavourites();
});