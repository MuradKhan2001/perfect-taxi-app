import "./adminHome.scss"
import {useEffect, useMemo, useState} from "react"
import {GoogleMap, useLoadScript, Marker, InfoWindow} from "@react-google-maps/api";
import Loader from "./loader/Loader";

const API_KEY = "AIzaSyAT1gB8sob8_piFwfeu3AaTL15yHyjuc30";

const MainHome = () => {

    const websocket = new WebSocket(`wss://api.buyukyol.uz/ws/orders/Tashkent/uzbekistan/?token=${localStorage.getItem('token')}`);

    const [locationsList, setLocationsList] = useState([]);

    useEffect(() => {
        if (sessionStorage.getItem("style")) {
        } else sessionStorage.setItem("style", "51da2328145a4757");

    }, []);

    const [selectedLocation, setSelectedLocation] = useState(null);

    const onMarkerClick = (location) => {
        setSelectedLocation(location);
    };

    const onCloseClick = () => {
        setSelectedLocation(null);
    };

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: API_KEY
    });

    const center = useMemo(() => ({lat: 41, lng: 65}), []);

    const options = useMemo(() => (
        {
            mapId: sessionStorage.getItem("style"),
            disableDefaultUI: false,
            clickableIcons: false
        }), []);

    if (!isLoaded) return <Loader/>;

    const icon = {url: './images/admin/truck-icon2.png', scaledSize: {width: 45, height: 45}};

    return <div className="admin-home-container">

        <div className="header-side">
            <div className="statistic-card">
                <div className="icon">
                    <img src="./images/admin/driver.png" alt=""/>
                </div>
                <div className="title">Haydovchilar soni:</div>
                <div className="count">5000</div>
            </div>
            <div className="statistic-card">
                <div className="icon">
                    <img src="./images/admin/driver.png" alt=""/>
                </div>
                <div className="title">Haydovchilar soni:</div>
                <div className="count">5000</div>
            </div>
            <div className="statistic-card">
                <div className="icon">
                    <img src="./images/admin/driver.png" alt=""/>
                </div>
                <div className="title">Haydovchilar soni:</div>
                <div className="count">5000</div>
            </div>
            <div className="statistic-card">
                <div className="icon">
                    <img src="./images/admin/driver.png" alt=""/>
                </div>
                <div className="title">Haydovchilar soni:</div>
                <div className="count">5000</div>
            </div>
        </div>

        <div className="map">
            <GoogleMap
                zoom={5}
                center={center}
                options={options}
                mapContainerClassName="map-container">

                {locationsList.length >= 0 ?

                    <>
                        {locationsList.map((item) => {
                            return <Marker
                                key={Number(item.latitude)}
                                position={{lat: Number(item.latitude), lng: Number(item.longitude)}}
                                icon={icon}
                                onClick={() => onMarkerClick(item)}
                            />
                        })}

                        {selectedLocation && (
                            <InfoWindow
                                position={{lat: Number(selectedLocation.latitude), lng: Number(selectedLocation.longitude)}}
                                onCloseClick={onCloseClick}
                            >
                                <div className="info-box">
                                    <div className="info-text">
                                        <span>Moshina raqam:</span>
                                        {selectedLocation.car_number} <br/>
                                        <span>Tel raqam:</span>
                                        {selectedLocation.phone_number}
                                    </div>
                                </div>
                            </InfoWindow>
                        )}
                    </>

                    : ""
                }


            </GoogleMap>
        </div>



    </div>
};


export default MainHome