const url = 'https://www.example.com'; // Replace with the URL you want to fetch

// Fetch the URL's HTML
fetch(url)
  .then(response => response.text())
  .then(html => {
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Get the title from the HTML document
    const title = doc.querySelector('title').textContent;

    // Get the favicon (shortcut icon) link from the HTML document
    const favicon = doc.querySelector("link[rel*='icon']").getAttribute('href');

    console.log('Title:', title);
    console.log('Favicon:', favicon);
  })
  .catch(error => {
    console.error('Error fetching URL:', error);
  });