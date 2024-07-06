import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import cogoToast from "cogo-toast";
import axios from "axios";
import ScriptTag from "react-script-tag";
import "./PlacePickerMap.css";

export default function MapPointer(props) {
  const {
    center = [28.62, 77.09],
    zoom = 15,
    zoomControl = true,
    search = true,
    hybrid = false,
    location,
    setLocation,
  } = props;
  const [apiKey, setApiKey] = useState();
  const [map, setMap] = useState();
  const [mapInitialised, setMapInitialised] = useState(false);
  const [script1Loaded, setScript1Loaded] = useState(false);
  const [script2Loaded, setScript2Loaded] = useState(false);

  // fetch MMI API token
  useEffect(() => {
    axios.post("/api/v1/auth/mmi/token").then((res) => {
      setApiKey(res.data.access_token);
    });
  }, []);

  const ref = useCallback((node) => {
    if (!mapInitialised && node != null) {
      // eslint-disable-next-line
      const map = new MapmyIndia.Map(node, {
        center,
        zoom,
        zoomControl,
        search,
      });
      setMap(map);
      setMapInitialised(true);
    }
  }, []);

  const onChange = (data) => {
    const { lat, lng } = data;
    if (lat && lng) {
      setLocation(data);
    } else cogoToast.error("Location not found. Please try moving map.");
  };

  useEffect(() => {
    if (!mapInitialised) return;
    const options = {
      map,
      callback: onChange,
      search: true,
      closeBtn: false,
      topText: " ",
    };
    options.location =
      location?.lat && location?.lng
        ? location
        : { lat: 28.679079, lng: 77.06971 };
    // eslint-disable-next-line
    new MapmyIndia.placePicker(options);
  }, [mapInitialised, props]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ScriptTag
        isHydrating={true}
        type="text/javascript"
        src={`https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/map_load?v=1.3`}
        onLoad={() => setScript1Loaded(true)}
      />
      <ScriptTag
        isHydrating={true}
        type="text/javascript"
        src={`https://apis.mapmyindia.com/advancedmaps/api/${apiKey}/map_sdk_plugins`}
        onLoad={() => setScript2Loaded(true)}
      />
      {script1Loaded && script2Loaded && <div id="map" ref={ref} />}
    </div>
  );
}
