import React, {useState} from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api"
import { Button, Modal, Spinner, Form, Row, Col, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { formatRelative } from "date-fns"

import usePlacesAutoComplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete"
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox"

import "@reach/combobox/styles.css"
import "../../style.css";
import { marker } from 'leaflet';
const libraries = ["places"]
const ModalMap = ({cancelModal, stateModal}) => {
  const [selected, setSelected] = useState(null)
  const [firstLocation, setFirstLocation] = useState(null)
  const [firstAddLocation, setFirstAddLocation] = useState(null)
  const [markers, setMarkers] = useState([])
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })
  const { t } = useTranslation();
  const mapRef = React.useRef
  const onMapLoad = React.useCallback((map) =>{
    mapRef.current = map
  }, [])
  if (loadError) return "Load Map Error"
  if (!isLoaded) return "Loading Map"
  const mapContainerStyle = {
    width: "100%",
    height: "50vh"
  }
  const center = {
    lat: parseFloat(),
    lng: parseFloat()
  }
  console.log('zombie', localStorage.getItem("location"))
  const options = {
    disableDefaultUI: true,
    zoomControl: true
  }
  const handleOnLocation = (e) => {
    console.log("latitude", e.latLng.lat())
    console.log("langitude", e.latLng.lng())
    // const oneLocation = markers.pop()
    setFirstAddLocation({lat: e.latLng.lat(), lng: e.latLng.lng()})
    localStorage.setItem("addLocation", JSON.stringify({lat: e.latLng.lat(), lng: e.latLng.lng()}))
  }
  return (
    <div>
      <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Pick Location</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              {localStorage.getItem("location") ? (
                <GoogleMap 
                  mapContainerStyle={mapContainerStyle} 
                  zoom={11} 
                  center={JSON.parse(localStorage.getItem("location"))}
                  options={options}
                  onClick={(event) => {
                    console.log("event apa nih", event)
                    setMarkers(current => [...current, {
                      lat: event.latLng.lat(),
                      lng: event.latLng.lng(),
                      time: new Date()
                    }])
                    handleOnLocation(event)
                  }}
                  onLoad={onMapLoad}
                >
                  {localStorage.getItem("location") ? (<Marker position={JSON.parse(localStorage.getItem("location"))}
                  />) : null }

                  {markers.map(marker => 
                    <Marker key={marker.time.toISOString()} 
                    position={{lat: marker.lat, lng: marker.lng}} 
                    onClick={() => {
                      setSelected(marker)
                    }}
                  />)}

                  {selected ? (
                    <InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => {setSelected(null)}} >
                      <div className="selected-spot">
                        <h2>Outlet spotted</h2>
                        <p>Spotted {formatRelative(selected.time, new Date())}</p>
                      </div>
                    </InfoWindow>
                  ) : null }

                </GoogleMap>
            ) : (
              <GoogleMap 
                  mapContainerStyle={mapContainerStyle} 
                  zoom={11} 
                  center={firstAddLocation ? firstAddLocation : {lat :-6.1753871, lng: 106.8249641}}
                  options={options}
                  onClick={(event) => {
                    console.log("event apa nih", event)
                    setMarkers(current => [...current, {
                      lat: event.latLng.lat(),
                      lng: event.latLng.lng(),
                      time: new Date()
                    }])
                    handleOnLocation(event)
                  }}
                  onLoad={onMapLoad}
                >
                  {firstAddLocation ? (<Marker position={firstAddLocation}
                  />) : null }

                  {markers.map(marker => 
                    <Marker key={marker.time.toISOString()} 
                    position={{lat: marker.lat, lng: marker.lng}} 
                    onClick={() => {
                      setSelected(marker)
                    }}
                  />)}

                  {selected ? (
                    <InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => {setSelected(null)}} >
                      <div className="selected-spot">
                        <h2>Outlet spotted</h2>
                        <p>Spotted {formatRelative(selected.time, new Date())}</p>
                      </div>
                    </InfoWindow>
                  ) : null }

                </GoogleMap>
              )
            }
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelModal}>
            {t("cancel")}
          </Button>
          <Button variant="primary" type="submit" onClick={cancelModal}>
            {t("saveChanges")}
          </Button>
        </Modal.Footer>
    </Modal>
    </div>
  );
}

function Search () {
  const {ready, value, suggestions: {status, data}, setValue, clearSuggestions} = usePlacesAutoComplete({
    requestOptions: {
      location: { 
        lat: () => -6.1753871,
        lng: () => 106.8249641}
    },
    radius: 200 * 1000
  })

  return (
    <div className="search">
      <Combobox onSelect={(address) => {console.log('ini select address', address)}}>
        <ComboboxInput 
          value={value} 
          onChange={(e) => {
            setValue(e.target.value)
          }}
          disabled={!ready}
          placeholder="Enter an Address"
        />
        <ComboboxPopover>
          {status === "OK" && 
            data.map(({id, description}) => (
              <ComboboxOption key={id} value={description} />
            ))
          }
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}

export default ModalMap;
