const baseURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

function addRowsToTable(data) {
    const tableBody = document.getElementById('tableBody');

    data.forEach(item => {
        const row = document.createElement('tr');

        const originalUrlCell = document.createElement('td');
        originalUrlCell.textContent = item.original_url;
        originalUrlCell.classList.add('border', 'border-gray-300', 'px-4', 'py-2', 'text-left', 'text-gray-600', 'truncate');

        const shortUrlCell = document.createElement('td');
        shortUrlCell.classList.add('border', 'border-gray-300', 'px-4', 'py-2', 'text-left', 'text-blue-600');

        const shortUrlLink = document.createElement('a');
        shortUrlLink.href = item.short_code;
        shortUrlLink.textContent = `${item.short_code}.url`;

        shortUrlCell.appendChild(shortUrlLink);

        // Add a new column for the Analysis button
        const analysisCell = document.createElement('td');
        const analysisButton = document.createElement('button');
        analysisButton.textContent = 'Analysis';
        analysisButton.classList.add('bg-blue-600', 'text-white', 'font-bold', 'px-2', 'py-1', 'rounded', 'hover:bg-blue-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-600');

        // Add an event listener to the Analysis button
        analysisButton.addEventListener('click', () => {
            // Redirect to the "/<short_code>/stats" route
            window.location.href = `/stats?code=${item.short_code}`;
        });

        analysisCell.appendChild(analysisButton);

        row.appendChild(originalUrlCell);
        row.appendChild(shortUrlCell);
        row.appendChild(analysisCell);

        tableBody.appendChild(row);
    });
}


async function fetchListOfAllData() {
    try {
        const response = await fetch(`${baseURL}/get-all`);
        if (response.ok) {
            const data = await response.json();
            // Process the data here
            console.log(data);
            return data;
        } else {
            console.error('Failed to fetch data');
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return []
    }
}



document.addEventListener("DOMContentLoaded", async function () {
    // const apiData = [
    //     {
    //       "original_url": "https://www.google.com",
    //       "short_code": "NcxJ9cu8"
    //     },
    //     {
    //       "original_url": "https://chat.openai.com/c/731e07d3-12a5-4fab-8314-839b7a787d03",
    //       "short_code": "3N3IOoym"
    //     },
    //     {
    //       "original_url": "https://realpython.com/flask-javascript-frontend-for-rest-api/",
    //       "short_code": "azWSoWwr"
    //     }
    //   ];

    //   addRowsToTable(apiData);

    apiData = await fetchListOfAllData();
    addRowsToTable(apiData);


    document.getElementById("shortenButton").addEventListener("click", function () {
        // Get the URL entered by the user
        var url = document.getElementById("url").value;

        // Call your JavaScript function with the entered URL
        shortenURL(url);
    });

    // Define your JavaScript function to handle the URL
    async function shortenURL(url) {
        // Add your URL shortening logic here
        // For example, you can use AJAX to send the URL to your server for shortening
        // You can also update the UI with the shortened URL or show an error message
        // This example just alerts the entered URL
        alert("Entered URL: " + url);

        const apiUrl = `${baseURL}/shorten`;
        const requestData = {
            url: url
        };

        // Create a request configuration
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        };


        // Make the POST request
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        reponse_data = await response.json();
        console.log(reponse_data);
        alert("Contiune?")

    }
});