import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

url = 'https://web.whatsapp.com'  # Replace with the URL you want to fetch

# Make an HTTP GET request to the URL

def getFavicon(domain):
    if 'http' not in domain:
        domain = 'http://' + domain

    url_for_text = domain
    parsed_url = urlparse(domain)
    domain = parsed_url.scheme + "://" + parsed_url.netloc
    page = requests.get(domain)
    page_for_text = requests.get(url_for_text)
    soup = BeautifulSoup(page.text, features="lxml")
    soup_for_text = BeautifulSoup(page_for_text.text, features="lxml")
    title = soup_for_text.find('title').get_text()
    icon_link = soup.find("link", rel="shortcut icon")
    if icon_link is None:
        icon_link = soup.find("link", rel="icon")
    if icon_link is None:
        return  {
            'title': title,
            'favicon': domain + '/favicon.ico'
        }

    if 'http' not in icon_link["href"]:
        icon_link["href"] = domain + icon_link["href"]
    return {
            'title': title,
            'favicon': icon_link["href"]
        }

# print(getFavicon('https://www.bing.com/search?form=MY0291&OCID=MY029…I&showconv=1/sa/simg/favicon-trans-bg-blue-mg.ico'))

