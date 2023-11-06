import os
from flask import Flask, render_template, request, url_for, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import string
import random
import requests 
from datetime import datetime


load_dotenv()

from sqlalchemy.sql import func

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] =os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class ShortURL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(512), unique=True, nullable=False)
    short_code = db.Column(db.String(8), unique=True, nullable=False)

    def __repr__(self):
        return f'<ShortURL {self.id}>'



class GeolocationData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20))
    country = db.Column(db.String(100))
    countryCode = db.Column(db.String(5))
    region = db.Column(db.String(100))
    regionName = db.Column(db.String(100))
    city = db.Column(db.String(100))
    zip = db.Column(db.String(10))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    timezone = db.Column(db.String(100))
    isp = db.Column(db.String(100))
    org = db.Column(db.String(100))
    as_number = db.Column(db.String(100))
    ip = db.Column(db.String(20))
    short_code = db.Column(db.String(512), db.ForeignKey('short_url.short_code'), nullable=False)
    access_time = db.Column(db.DateTime, default=datetime.utcnow)


    def __init__(self, status, country, countryCode, region, regionName, city, zip, lat, lon, timezone, isp, org, as_number, ip,short_code):
        self.status = status
        self.country = country
        self.countryCode = countryCode
        self.region = region
        self.regionName = regionName
        self.city = city
        self.zip = zip
        self.lat = lat
        self.lon = lon
        self.timezone = timezone
        self.isp = isp
        self.org = org
        self.as_number = as_number
        self.ip = ip
        self.short_code = short_code  # Include 'short_code' in the constructor
        


    def __repr__(self):
        return f'<GeolocationData {self.id}>'


def fetch_and_save_geolocation(ip,short_code):
    # Fetch geolocation data from the API
    api_url = f'http://ip-api.com/json/{ip}'
    response = requests.get(api_url)

    if response.status_code == 200:
        data = response.json()

        print(data)

        # Create a new GeolocationData object and save it to the database
        geolocation_data = GeolocationData(
            status=data['status'],
            country=data['country'],
            countryCode=data['countryCode'],
            region=data['region'],
            regionName=data['regionName'],
            city=data['city'],
            zip=data['zip'],
            lat=data['lat'],
            lon=data['lon'],
            timezone=data['timezone'],
            isp=data['isp'],
            org=data['org'],
            as_number=data['as'],
            ip=data['query'],
            short_code=short_code
        )

        db.session.add(geolocation_data)
        db.session.commit()

        return geolocation_data # Return the fetched geolocation data as a JSON response
    else:
        return None


def get_geolocation_data(short_code):
    geolocation_data = GeolocationData.query.filter(GeolocationData.short_code == short_code).all()

    if geolocation_data:
        # Convert the geolocation data to a list of dictionaries
        geolocation_list = []
        for data in geolocation_data:
            geolocation_list.append({
                'status': data.status,
                'country': data.country,
                'countryCode': data.countryCode,
                'region': data.region,
                'regionName': data.regionName,
                'city': data.city,
                'zip': data.zip,
                'lat': data.lat,
                'lon': data.lon,
                'timezone': data.timezone,
                'isp': data.isp,
                'org': data.org,
                'as_number': data.as_number,
                'ip': data.ip,
                'access_time': data.access_time
            })

        print(geolocation_list)
        return jsonify(geolocation_list)
    else:
        return jsonify({"message": "No geolocation data found for this short code"})



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/stats')
def stats():
    return render_template('stats.html')

@app.route('/checkip')
def checkIPAddress():
    return {
        "x": request.environ['REMOTE_ADDR'],
        "y": request.environ.get('HTTP_X_FORWARDED_FOR'),
        "z": request.remote_addr
    }



@app.route('/get-all', methods=['GET'])
def get_all():
    short_urls = ShortURL.query.all()
    output = []

    for short_url in short_urls:
        short_url_data = {}
        short_url_data['original_url'] = short_url.original_url
        short_url_data['short_code'] = short_url.short_code
        output.append(short_url_data)

    return jsonify(output)

@app.route('/shorten', methods=['POST'])
def shorten_url():
    if request.method == 'POST':
        request_data = request.get_json()
        original_url = request_data['url']
        short_code = generate_short_code()
        short_url = ShortURL(original_url=original_url, short_code=short_code)
        db.session.add(short_url)
        db.session.commit()
        return f'Shortened URL: {request.host}/{short_code}'

@app.route('/<short_code>')
def redirect_to_original(short_code):
    short_url = ShortURL.query.filter_by(short_code=short_code).first()
    if short_url:
        geolocation_data = fetch_and_save_geolocation(request.remote_addr, short_code)   
        # geolocation_data = fetch_and_save_geolocation("24.48.0.1", short_code)            
        return redirect(short_url.original_url)
    else:
        return 'URL not found'
def generate_short_code():
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(8))


@app.route('/<short_code>/stats', methods=['GET'])
def get_stats(short_code):
    short_url = ShortURL.query.filter_by(short_code=short_code).first()

    if short_url:
        geolocation_data = get_geolocation_data(short_code)
        if geolocation_data:

            return geolocation_data
        else:
            return jsonify({"message": "No geolocation data found for this short code"})
    else:   
        return jsonify({"message": "No short URL found for this code"})


@app.route('/view/index')
def view_index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

