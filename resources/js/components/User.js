import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Geocode from "react-geocode";
import GoogleMapReact from 'google-map-react';
import './map_styles.css';

Geocode.setApiKey('AIzaSyBkQkbyeCIhTDf2nKPBYQVl2CN_VFjTBDU');

const Marker = ({ text, data = {} }) => (
    <div className="marker">
        {text}
        <pre>
            {JSON.stringify(data, undefined, 2)}
        </pre>
    </div>
);

const SimpleMap = ({
    center = {
        lat: 59.95,
        lng: 30.33
    },
    zoom = 11,
    plotData = [],
}) => {
    // const { isLoaded } = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: "AIzaSyBkQkbyeCIhTDf2nKPBYQVl2CN_VFjTBDU"
    // })

    const [mapValues, setMapValues] = React.useState(null);
    const [maps, setMaps] = React.useState(null);

    // React.useEffect(() => { console.log('isLoaded', isLoaded) }, [isLoaded]);

    React.useEffect(() => {
        if (mapValues && maps) {
            // const bounds = new maps.geometry.LatLngBounds();
            // bounds.extend(new maps.LatLng(
            //     center.lat,
            //     center.lng,
            // ))
            // console.log(east);
            // onGetBounds(mapValues.bounds);
        }
    }, [mapValues, maps]);

    const handleApiLoaded = (map, maps) => {
        if (maps) {
            setMaps(maps);
            console.log('API loaded', maps);
        }
    };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyAI6aQYkkyqi-_B5Y9E9U3trurpEsdwGZI' }}
                defaultZoom={zoom}
                center={center}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                onChange={(val) => setMapValues(val)}
            >
                {plotData.map((plot, index) => (
                    <Marker
                        lat={plot.lat}
                        lng={plot.lng}
                        text={`Marker #${index}`}
                        data={{ ...plot }}
                    />
                ))}
            </GoogleMapReact>
        </div>
    );
}

function User() {
    const [cityName, setCityName] = React.useState('');
    const [isDisabled, setIsDisabled] = React.useState(false);
    const [coordinates, setCoordinates] = React.useState({
        lat: 59.95,
        lng: 30.33
    })
    const [plotData, setPlotData] = React.useState([]);

    const fetchGeocode = (addr) => Geocode.fromAddress(addr).then(
        (response) => {
            const bounds = response.results[0].geometry.bounds
            console.log(response.results[0])
            const { lat, lng } = response.results[0].geometry.location;
            return { lat, lng, bounds };
        },
        (error) => {
            console.error(error);
        }
    );

    React.useEffect(() => {
        if (cityName.length < 1) setIsDisabled(true);
        else setIsDisabled(false);
    }, [cityName]);

    async function executeQuery() {
        const { lat, lng, bounds } = await fetchGeocode(cityName);
        console.log('%c bounds', 'background: #332167; color: #B3D1F6; font-size: 16px', bounds)
        const headers = {
            'Content-type': 'application/json',
            'Accept': 'application/json, text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
        }
        setCoordinates({ lat, lng });
        const promise = await axios.get(
            `/api/city-query?north=${bounds.northeast.lat}&east=${bounds.northeast.lng}&south=${bounds.southwest.lat}&west=${bounds.southwest.lng}`,
            headers,
        ).then(data => data);

        setPlotData(promise.data.earthquakes);
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card text-center">
                        <div className="card-header"><h2>GeoNames Recent Earthquake WebService</h2></div>
                        <div className="row justify-content-sm-center flex-md-grow-1">
                            <input value={cityName} onChange={(e) => setCityName(e.target.value)} />
                            <button disabled={isDisabled} onClick={() => executeQuery()}>Search</button>
                        </div>
                        <div className="card-body">
                            <SimpleMap
                                center={{ lng: coordinates.lng, lat: coordinates.lat }}
                                onGetBounds={(bounds) => bounds && setMapBounds(bounds)}
                                plotData={plotData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;

// DOM element
if (document.getElementById('user')) {
    ReactDOM.render(<User />, document.getElementById('user'));
}
