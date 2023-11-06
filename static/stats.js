function populateTable(data) {
    const tableBody = document.querySelector('table tbody');
    if (!tableBody) return;
  
    data.forEach((item, index) => {
      const row = document.createElement('tr');
      row.className = index % 2 === 0 ? 'bg-gray-200' : 'bg-white';
  
      const accessTimeCell = document.createElement('td');
      accessTimeCell.textContent = item.access_time;
      accessTimeCell.className = 'p-2';
  
      const ipAddressCell = document.createElement('td');
      ipAddressCell.textContent = item.ip;
      ipAddressCell.className = 'p-2';
  
      const cityCell = document.createElement('td');
      cityCell.textContent = item.city;
      cityCell.className = 'p-2';
  
      const countryCell = document.createElement('td');
      countryCell.textContent = item.country;
      countryCell.className = 'p-2';
  
      const ispCell = document.createElement('td');
      ispCell.textContent = item.isp;
      ispCell.className = 'p-2';
  
      row.appendChild(accessTimeCell);
      row.appendChild(ipAddressCell);
      row.appendChild(cityCell);
      row.appendChild(countryCell);
      row.appendChild(ispCell);
  
      tableBody.appendChild(row);
    });
  }


  
async function fetchListOfAllData(code) {
    try {
        const response = await fetch(`http://127.0.0.1:5078/${code}/stats`);

        if (response.ok) {
            const data = await response.json();
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

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get('code');
    console.log(codeParam)

    apiData = await fetchListOfAllData(codeParam);
    console.log("Data is: ",apiData)
    populateTable(apiData);


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

        const apiUrl = 'http://127.0.0.1:5078/shorten';
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