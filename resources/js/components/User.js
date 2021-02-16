import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Geocode from "react-geocode";
import GoogleMapReact from 'google-map-react';
import './map_styles.css';
import { format, sub } from 'date-fns';

Geocode.setApiKey(process.env.MIX_GEOCODE_KEY);

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
    const handleApiLoaded = (map, maps) => {
        if (maps) {
            console.log('API loaded', maps);
        }
    };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.MIX_MAPS_KEY }}
                defaultZoom={zoom}
                center={center}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
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
    const [view, setView] = React.useState('map');
    const [isDisabled, setIsDisabled] = React.useState(false);
    const [coordinates, setCoordinates] = React.useState({
        lat: 59.95,
        lng: 30.33
    })
    const [plotData, setPlotData] = React.useState([]);
    const [listData, setListData] = React.useState([]);
    const [loadingList, setLoadingList] = React.useState(false);

    const fetchGeocode = (addr) => Geocode.fromAddress(addr).then(
        (response) => {
            const bounds = response.results[0].geometry.bounds
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

    React.useEffect(() => {

        if (view === 'list') fetchList();
        else setPlotData([])
    }, [view])

    async function fetchList() {
        // https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02
        setLoadingList(true)
        const start = format(sub(new Date(), { years: 1 }), 'yyyy-MM-dd');
        const end = format(new Date(), 'yyyy-MM-dd');
        const promiseData = await axios.get(`/api/earthquakes?start=${start}&end=${end}`).then(data => data.data);
        setListData(promiseData.features);
        setLoadingList(false)
    }

    async function executeQuery() {
        const { lat, lng, bounds } = await fetchGeocode(cityName);
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
                            <input placeholder="e.g. Los Angeles" value={cityName} onChange={(e) => setCityName(e.target.value)} />
                            <button disabled={isDisabled} onClick={() => executeQuery()}>Search</button>
                        </div>
                        <div className="card-body">
                            <div className="d-inline-flex">
                                <button onClick={() => setView('map')}>Map</button>
                                <button onClick={() => setView('list')}>List</button>
                            </div>
                            <hr />
                            {view === 'map' && (
                                <SimpleMap
                                    center={{ lng: coordinates.lng, lat: coordinates.lat }}
                                    onGetBounds={(bounds) => bounds && setMapBounds(bounds)}
                                    plotData={plotData}
                                />)}
                            {view === 'list' && (
                                <>
                                    {!loadingList ? (
                                        <div style={{ display: 'grid' }}>
                                            {listData.length > 0 && listData.map((plot, index) => (
                                                <div className="card">
                                                    <span className="card-header">{`#${index + 1} ${plot.properties.place}`}</span>
                                                    <div className="card-body">
                                                        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                                            <span>magnitude: {plot.properties.mag}</span>
                                                            <span>{new Date(plot.properties.time).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            ))}
                                        </div>
                                    ) : <span>...Loading data.</span>}
                                </>
                            )}
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
