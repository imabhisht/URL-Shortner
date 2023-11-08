const baseURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');


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

function addRows_To_Table(data) {
    const tableBody = document.getElementById('t-data');


    data.forEach(async item => {

        tableBody.innerHTML += `
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="w-4 p-4">
                <div class="flex items-center">
                    <input id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                </div>
            </td>
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                ${item.access_time}
            </th>
            <td class="px-6 py-4">
                ${item.city}
            </td>
            <td class="px-6 py-4">
                ${item.regionName}
            </td>
            <td class="px-6 py-4">
                ${item.country}
            </td>
            <td class="px-6 py-4">
                ${item.isp}
            </td>
            <td class="px-6 py-4">
                ${item.zip}
            </td>
            <td class="px-6 py-4">
                ${item.timezone}
            </td>
            <td class="px-6 py-4">
                ${item.lon},${item.lat}
            </td>
            <td class="px-6 py-4">
                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Show</a>
            </td>
        </tr>
        `

    })

}


  
async function fetchListOfAllData(code) {
    try {
        const response = await fetch(`${baseURL}/${code}/stats`);

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
    addRows_To_Table(apiData);


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

        const apiUrl =`${baseURL}/shorten`;
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