import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
  MarkerClusterer,
} from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { GeoJson } from "./components/GeoJson"; // GeoJson.js 파일에서 GeoJson 데이터 import
import TabMenu from "./TabMenu";

const GoogleMaps = () => {
  const [locations, setLocations] = useState([]); // 서버로부터 받아온 위치 데이터를 저장할 상태
  const [selectedLocation, setSelectedLocation] = useState(null); // 선택된 위치 정보
  const [map,setMap] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [Keyword,setKeyword] = useState("");

  const center = { lat: 37.5511694, lng: 126.9882266 };

  const options = { 
    zoom: 11,
    mapId: "81bc4809ac9f2bc7"
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
   
  });

  useEffect(() => {
      fetch(`http://localhost:8080/api/partner/google?inputValue=${inputValue}&keyword=${Keyword}`)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return null;
          }
        })
        .then((data) => {
          if (data !== null) {
            console.log(data);
            setLocations(data);
          }
        })
        .catch((error) => console.error("Error fetching search results:", error));
  }, [inputValue, Keyword]);

  


  const mapContainerStyle = {
    height: "500px",
    width: "100%",
    borderRadius: "20px",
  };

  const clickedPolygonRef = useRef(null);
  const hoveredPolygonRef = useRef(null);

  const onMapLoad = useCallback(
    (map) => {
      GeoJson.features.forEach((feature) => {
        const coordinates = feature.geometry.coordinates[0];

        const polygon = new window.google.maps.Polygon({
          paths: coordinates.map((coord) => ({ lat: coord[1], lng: coord[0] })),
          strokeColor: "#64CD3C",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#64CD3C",
          fillOpacity: 0.35,
        });
        
        // 클릭 이벤트 핸들러
        window.google.maps.event.addListener(polygon, "click", function (event) {
          if (clickedPolygonRef.current !== null) {
            clickedPolygonRef.current.setOptions({ fillColor: "#64CD3C" });

          }

          // 클릭한 폴리곤이 이미 클릭되었는지 확인
          if (clickedPolygonRef.current === polygon) {
            // 이미 클릭된 폴리곤을 다시 클릭한 경우
            map.setZoom(11); // 지도의 줌을 초기 확대 수준으로 되돌림
            clickedPolygonRef.current = null; // 클릭된 폴리곤을 null로 설정하여 다음 클릭을 대비
          } else {
            // 새로운 폴리곤을 클릭한 경우
            map.setCenter(event.latLng);
            map.setZoom(13);
            polygon.setOptions({ fillColor: "#FF0000" });
            clickedPolygonRef.current = polygon; // 클릭된 폴리곤을 저장
          }
        });

        // 마우스 오버 이벤트 핸들러
        window.google.maps.event.addListener(polygon, "mouseover", function () {
          if (clickedPolygonRef.current !== polygon) {
            polygon.setOptions({ fillColor: "#FFBB00" });
            hoveredPolygonRef.current = polygon;
          }
        });

        // 마우스 아웃 이벤트 핸들러
        window.google.maps.event.addListener(polygon, "mouseout", function () {
          if (clickedPolygonRef.current !== polygon) {
            polygon.setOptions({ fillColor: "#64CD3C" });
            hoveredPolygonRef.current = null;
          }
        });

        polygon.setMap(map);

        // 각 구의 중심점을 계산하여 구 이름을 표시합니다.
        const bounds = new window.google.maps.LatLngBounds();
        coordinates.forEach((coord) =>
          bounds.extend(new window.google.maps.LatLng(coord[1], coord[0]))
        );
        const center = bounds.getCenter();

        // 종로구인 경우에만 라벨의 중심점을 왼쪽으로 이동시킵니다.
        let labelCenterX = center.lng(); // 중심점의 x 좌표를 설정합니다.
        let labelCenterY = center.lat();
        if (feature.properties.SIG_KOR_NM === "종로구") {
          labelCenterX -= 0.02; // 라벨을 왼쪽으로 이동시킵니다.
        }
        if (feature.properties.SIG_KOR_NM === "서초구") {
          labelCenterX -= 0.02; // 라벨을 왼쪽으로 이동시킵니다.
        }
        if (feature.properties.SIG_KOR_NM === "강남구") {
          labelCenterX -= 0.02; // 라벨을 왼쪽으로 이동시킵니다.
        }
        if (feature.properties.SIG_KOR_NM === "강북구") {
          labelCenterX -= 0.01; // 라벨을 왼쪽으로 이동시킵니다.
        }
        if (feature.properties.SIG_KOR_NM === "강남구") {
          labelCenterX += 0.01; // 라벨을 왼쪽으로 이동시킵니다.
        }
        if (feature.properties.SIG_KOR_NM === "양천구") {
          labelCenterY -= 0.01; // 라벨을 왼쪽으로 이동시킵니다.
        }
        
        setMap(map);
        const textLabel = new window.google.maps.Marker({
          position: { lng: labelCenterX , lat: labelCenterY }, // x 좌표를 수정하여 라벨의 위치를 조정합니다.
          label: {
            text: feature.properties.SIG_KOR_NM, // 구 이름을 표시합니다.
            color: "#000000",
            fontWeight: "bold",
          },
          icon: {
            path: "M 0,0",
          },
          map: map,
        });
      });
    },
    []
  );

  // useEffect(() => {
  //   if (map !== null && selectedLocation !== null) {
  //     map.setZoom(13);
  //   }
  // }, [map, selectedLocation]);

  return isLoaded ? (
    <>
   <div>
    <TabMenu setInputValue={setKeyword} />
  </div>

    <div className="search-container mt-1 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="매장찾기"
        />
      </div>
      
    <GoogleMap
      id="google-map-test"
      mapContainerStyle={mapContainerStyle}
      center={center}
      options={{
        mapId: "81bc4809ac9f2bc7",
        zoom: 11 // 여기에서 zoom 속성을 설정합니다.
      }}
      onLoad={onMapLoad} // 여기에서 onMapLoad 함수를 onLoad prop으로 전달
    >
    <MarkerClusterer
  gridSize={40} // 클러스터 그리드 크기 조절
>
        {(clusterer) =>
          locations.map((location) => (
            <Marker
            key={location.id}
            position={{
              lat: location.address.lat,
              lng: location.address.lng,
            }}
            onClick={(event) => {
              setSelectedLocation(location);
            }}
            clusterer={clusterer} // MarkerClusterer에 의해 관리됩니다.
            icon={{
              url: 'https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1709017055899-image.png',
              scaledSize: new window.google.maps.Size(30 , 30), // 아이콘의 크기를 조정합니다.
            }}
          />
          ))
        }
      </MarkerClusterer>
      {selectedLocation && ( 
        <InfoWindow 
          position={{
            lat: selectedLocation.address.lat,
            lng: selectedLocation.address.lng,
          }}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div>
            <p>{selectedLocation.id}</p>
            <Link
              to={"/userdetail/" + selectedLocation.id}
              style={{ textDecoration: "none" }}
            >
              <h2>
                {selectedLocation.storeName}
                <img 
                  src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708165487160-free-icon-right-arrow-3272421.png"
                  style={{ width: "15px", marginLeft: "14px"}}
                />
              </h2>
            </Link>
            <img
              src={selectedLocation.fileList[0].imageUrl}
              style={{ width: "100%" }}
            ></img>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
    </>
  ) : (
    <></>
  );
};

export default GoogleMaps;


// import React, { useEffect, useRef, useState } from "react";
// import { GeoJson } from "./components/GeoJson";
// import MarkerClusterer from "@googlemaps/markerclustererplus";

// const GoogleMap = () => {
//   const mapRef = useRef(null);
//   // 클릭된 폴리곤의 참조를 저장
//   const clickedPolygonRef = useRef(null);
//   // 현재 마우스가 위치한 폴리곤의 참조를 저장
//   const hoveredPolygonRef = useRef(null);
//   const clusterRef = useRef(null); // 클러스터 참조
//   const [post, setPost] = useState([]);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const markers = [];

 
  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:8080/api/partner/totallist"
//         );
//         if (!response.ok) throw new Error("Network response was not ok");
//         const data = await response.json();
//         setPost(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         // 여기에 사용자에게 에러를 알리는 로직을 추가할 수 있습니다.
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const loadGoogleMapsAPI = () => {
//       if (!isLoaded && !window.google) {
//         // 추가 수정: window.google이 존재하지 않을 때만 스크립트 추가
//         const script = document.createElement("script");
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&libraries=geometry&callback=initMap`;
//         script.async = true;
//         script.defer = true;
//         window.initMap = () => {
//           setIsLoaded(true);
//         };
//         document.body.appendChild(script);
//       } else if (!isLoaded && window.google) {
//         setIsLoaded(true);
//       }
//     };

//     loadGoogleMapsAPI();
//   }, [isLoaded]);

  // useEffect(() => {
  //   if (isLoaded) {
  //     const map = new window.google.maps.Map(mapRef.current, {
  //       center: { lat: 37.5665, lng: 126.978 },
  //       zoom: 12,
  //       mapId: "81bc4809ac9f2bc7",
  //     });

//       // 서울의 구 경계 GeoJSON 데이터를 사용하여 지도에 폴리곤을 추가합니다.
//       GeoJson.features.forEach((feature) => {
//         const coordinates = feature.geometry.coordinates[0];
//         const polygon = new window.google.maps.Polygon({
//           paths: coordinates.map((coord) => ({ lat: coord[1], lng: coord[0] })),
//           strokeColor: "#64CD3C",
//           strokeOpacity: 0.8,
//           strokeWeight: 2,
//           fillColor: "#64CD3C",
//           fillOpacity: 0.35,
//         });

//         // 클릭 이벤트 핸들러
//         window.google.maps.event.addListener(
//           polygon,
//           "click",
//           function (event) {
//             if (clickedPolygonRef.current !== null) {
//               clickedPolygonRef.current.setOptions({ fillColor: "#64CD3C" });
//             }

//             // 클릭한 폴리곤이 이미 클릭되었는지 확인
//             if (clickedPolygonRef.current === polygon) {
//               // 이미 클릭된 폴리곤을 다시 클릭한 경우
//               map.setZoom(12); // 지도의 줌을 초기 확대 수준으로 되돌림
//               clickedPolygonRef.current = null; // 클릭된 폴리곤을 null로 설정하여 다음 클릭을 대비
//             } else {
//               // 새로운 폴리곤을 클릭한 경우
//               map.setCenter(event.latLng);
//               map.setZoom(13);
//               polygon.setOptions({ fillColor: "#FF0000" });
//               clickedPolygonRef.current = polygon; // 클릭된 폴리곤을 저장
//             }
//           }
//         );

//         // 마우스 오버 이벤트 핸들러
//         window.google.maps.event.addListener(polygon, "mouseover", function () {
//           if (clickedPolygonRef.current !== polygon) {
//             polygon.setOptions({ fillColor: "#FFBB00" });
//             hoveredPolygonRef.current = polygon;
//           }
//         });

//         // 마우스 아웃 이벤트 핸들러
//         window.google.maps.event.addListener(polygon, "mouseout", function () {
//           if (clickedPolygonRef.current !== polygon) {
//             polygon.setOptions({ fillColor: "#64CD3C" });
//             hoveredPolygonRef.current = null;
//           }
//         });

//         polygon.setMap(map);

//         // 각 구의 중심점을 계산하여 구 이름을 표시합니다.
//         const bounds = new window.google.maps.LatLngBounds();
//         coordinates.forEach((coord) =>
//           bounds.extend(new window.google.maps.LatLng(coord[1], coord[0]))
//         );
//         const center = bounds.getCenter();

//         // 종로구인 경우에만 라벨의 중심점을 왼쪽으로 이동시킵니다.
//         let labelCenterX = center.lng(); // 중심점의 x 좌표를 설정합니다.
//         if (feature.properties.SIG_KOR_NM === "종로구") {
//           labelCenterX -= 0.02; // 라벨을 왼쪽으로 이동시킵니다.
//         }

//         const textLabel = new window.google.maps.Marker({
//           position: { lat: center.lat(), lng: labelCenterX }, // x 좌표를 수정하여 라벨의 위치를 조정합니다.
//           label: {
//             text: feature.properties.SIG_KOR_NM, // 구 이름을 표시합니다.
//             color: "#000000",
//             fontWeight: "bold",
//           },
//           icon: {
//             path: "M 0,0",
//           },
//           map: map,
//         });
//       });
//       // 데이터를 기반으로 지도에 마커를 추가
//       post.forEach((item) => {
//         const lat = item.address.lat;
//         const lng = item.address.lng;

//         // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
//         const marker = new window.google.maps.Marker({
//           position: { lat: lat, lng: lng }, // 마커의 위치를 설정합니다.
//           map: map, // 마커를 표시할 지도를 설정합니다.
//           title: item.storeName,
//           label: {
//             text: item.storeName,
//             fontWeight: "bold",
//             fontSize: "12px",
//           }, // 마커 옆에 표시할 텍스트입니다.
//         });

//         // 마커 배열에 추가
//         markers.push(marker);

//         // 마커를 클릭했을 때 정보 창 열기
//         marker.addListener("click", function () {
//           const infoWindow = new window.google.maps.InfoWindow({
//             content: `
//                             < div >
//                                 <p>ID: ${item.id}</p>
//                                 <p>Store Name: ${item.storeName}</p>
//                                 <img src="${item.fileList[0].imageUrl}" alt="Image" style="max-width: 200px; max-height: 200px;">
//                             </>
//                         `,
//           });
//           infoWindow.open(map, marker);
//         });
//       });

//       // 클러스터 생성 및 마커 추가
//       clusterRef.current = new MarkerClusterer(map, markers, {
//         imagePath:
//           "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
//         gridSize: 160,

//         zoomOnClick: true,
//       });
//     }
//   }, [isLoaded, post]);

//   return (
//     <div
//       ref={mapRef}
//       style={{
//         marginTop: "20px",
//         marginBottom: "20px",
//         height: "500px",
//         width: "100%",
//         borderRadius: "50px",
//       }}
//     >
//       {/* 여기에 지도가 표시됩니다. */}
//     </div>
//   );
// };

// export default GoogleMap;
 