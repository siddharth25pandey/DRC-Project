import React,{useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON,layer} from 'react-leaflet';
import {features} from '../data/data.json';
import './Map.css';


const Map = ()=>{
    const [onselect, setOnselect] = useState({});

    const highlightFeature = (e=> {
        var layer = e.target;
        const { County, Value} = e.target.feature.properties;
        setOnselect({
            county:County,
            value:Value,
        });
        layer.setStyle({
            weight: 1,
            color: "black",
            fillOpacity: 1
        });
    });
    const resetHighlight= (e =>{
        setOnselect({});
        e.target.setStyle(style(e.target.feature));
    })

    const onEachFeature= (feature, layer)=> {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    }

    const feature = features.map(feature=>{
        //feature['properties']['Value'] = Math.floor(Math.random() * 1000);
        return(feature);
    });

    const mapPolygonColorToDensity=(density => {
        return density > 3023
            ? '#a50f15'
            : density > 676
            ? '#de2d26'
            : density > 428
            ? '#fb6a4a'
            : density > 236
            ? '#fc9272'
            : density > 23
            ? '#fcbba1'
            : '#fee5d9';
    })
    const style = (feature => {
        return ({
            fillColor: mapPolygonColorToDensity(feature.properties.Value),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '2',
            fillOpacity: 0.7
        });
    });
    const mapStyle = {
        height: '55vh',
        width: '100%',
        margin: '0 auto',
    }
    return(
        <div className="map">
            <div className="hover">
            {!onselect.county && (
            <div className="census-info-hover">
                <p>Hover on each region for more details</p>
            </div>
            )}
            {onselect.county && (
                <ul className="census-info">
                    <li><strong>{onselect.county}</strong></li><br/>
                    <li><strong>{onselect.value}</strong></li><br/>
                </ul>
            )}
            </div>
            <MapContainer center={[11.6424, 2.1801]}
            zoom={4} scrollWheelZoom={true} style={mapStyle}>
                <TileLayer
                    attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
                        url="http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                />
                {feature && (
                <GeoJSON data={feature} 
                style={style} 
                onEachFeature={onEachFeature}/>
                )}
            </MapContainer>
            
        </div>

    )
}
export default Map;