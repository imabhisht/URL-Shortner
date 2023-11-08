const baseURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
let spinner_element;
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



function addRows_To_Table(data) {
    const tableBody = document.getElementById('t-data');


    data.forEach(async item => {

        scrapped_info = await getURLInfo(item.original_url);
        spinner_element.style.display = "none";

        tableBody.innerHTML += `
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="w-4 p-4">
                <div class="flex items-center">
                    <input id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                </div>
            </td>
            <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                <img class="w-10 h-10 rounded-full" src="${scrapped_info.favicon}" alt="Jese image">
                <div class="pl-3">
                    <div class="text-base font-semibold">${scrapped_info.title}</div>
                    <div class="font-normal text-gray-500">${((item.original_url).length > 30) ? ((item.original_url).slice(0,30) + "..." ): item.original_url}</div>
                </div>  
            </th>
            <td class="px-6 py-4">
                <a href="${item.short_code}">${(item.short_code)}</a>
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div> Online
                </div>
            </td>
            <td class="px-6 py-4">
                <a href="stats?code=${item.short_code}" type="button" data-modal-target="editUserModal" data-modal-show="editUserModal" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit Link</a>
            </td>
        </tr>
        `

    })

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
    spinner_element = document.getElementById('loading_spinner');
    // spinner_element.style.display = "block";
    apiData = await fetchListOfAllData();
    console.log("This is Data",apiData)
    addRows_To_Table(apiData);


    document.getElementById("shortenButton").addEventListener("click", function () {
        var url = document.getElementById("url").value;
        shortenURL(url);
    });

    async function shortenURL(url) {
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





async function getURLInfo(url_to_scrap) {
    try {
      const response = await fetch(`${baseURL}/scrap-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({
            url: url_to_scrap,
        }), // Convert the data to JSON format
      });
  
      if (response.ok) {
        const responseData = await response.json(); // Parse the response as JSON
        console.log('Response:', responseData);
        return responseData;
      } else {
        throw new Error('Request failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }