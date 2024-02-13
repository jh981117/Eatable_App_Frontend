import React, { useEffect, useRef, useState } from 'react';
import { GeoJson } from './components/GeoJson';
import MarkerClusterer from '@googlemaps/markerclustererplus';

const GoogleMap = () => {
    const mapRef = useRef(null);
    // 클릭된 폴리곤의 참조를 저장
    const clickedPolygonRef = useRef(null);
    // 현재 마우스가 위치한 폴리곤의 참조를 저장
    const hoveredPolygonRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [post, setPost] = useState([]);
    const clusterRef = useRef(null); // 클러스터 참조
    const markers = [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/partner/totallist');
                if (response.status === 200) {
                    const data = await response.json();
                    console.log(data);
                    setPost(data); // 데이터를 상태 변수에 설정
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // 데이터 가져오기
        fetchData();
    }, []);

    useEffect(() => {
        const loadGoogleMapsAPI = () => {
            if (!isLoaded && !window.google) { // 추가 수정: window.google이 존재하지 않을 때만 스크립트 추가
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&libraries=geometry&callback=initMap`;
                script.async = true;
                script.defer = true;
                window.initMap = () => {
                    setIsLoaded(true);
                };
                document.body.appendChild(script);
            } else if (!isLoaded && window.google) {
                setIsLoaded(true);
            }
        };

        loadGoogleMapsAPI();
    }, [isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: 37.5665, lng: 126.9780 },
                zoom: 12,
                mapId: '81bc4809ac9f2bc7'
            });

            // 서울의 구 경계 GeoJSON 데이터를 사용하여 지도에 폴리곤을 추가합니다.
            GeoJson.features.forEach(feature => {
                const coordinates = feature.geometry.coordinates[0];
                const polygon = new window.google.maps.Polygon({
                    paths: coordinates.map(coord => ({ lat: coord[1], lng: coord[0] })),
                    strokeColor: '#64CD3C',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#64CD3C',
                    fillOpacity: 0.35,
                });

                // 클릭 이벤트 핸들러
                window.google.maps.event.addListener(polygon, 'click', function (event) {
                    if (clickedPolygonRef.current !== null) {
                        clickedPolygonRef.current.setOptions({ fillColor: '#64CD3C' });
                    }

                    // 클릭한 폴리곤이 이미 클릭되었는지 확인
                    if (clickedPolygonRef.current === polygon) {
                        // 이미 클릭된 폴리곤을 다시 클릭한 경우
                        map.setZoom(12); // 지도의 줌을 초기 확대 수준으로 되돌림
                        clickedPolygonRef.current = null; // 클릭된 폴리곤을 null로 설정하여 다음 클릭을 대비
                    } else {
                        // 새로운 폴리곤을 클릭한 경우
                        map.setCenter(event.latLng);
                        map.setZoom(13);
                        polygon.setOptions({ fillColor: '#FF0000' });
                        clickedPolygonRef.current = polygon; // 클릭된 폴리곤을 저장
                    }

                });

                // 마우스 오버 이벤트 핸들러
                window.google.maps.event.addListener(polygon, 'mouseover', function () {
                    if (clickedPolygonRef.current !== polygon) {
                        polygon.setOptions({ fillColor: '#FFBB00' });
                        hoveredPolygonRef.current = polygon;
                    }
                });

                // 마우스 아웃 이벤트 핸들러
                window.google.maps.event.addListener(polygon, 'mouseout', function () {
                    if (clickedPolygonRef.current !== polygon) {
                        polygon.setOptions({ fillColor: '#64CD3C' });
                        hoveredPolygonRef.current = null;
                    }
                });

                polygon.setMap(map);

                // 각 구의 중심점을 계산하여 구 이름을 표시합니다.
                const bounds = new window.google.maps.LatLngBounds();
                coordinates.forEach(coord => bounds.extend(new window.google.maps.LatLng(coord[1], coord[0])));
                const center = bounds.getCenter();

                // 종로구인 경우에만 라벨의 중심점을 왼쪽으로 이동시킵니다.
                let labelCenterX = center.lng(); // 중심점의 x 좌표를 설정합니다.
                if (feature.properties.SIG_KOR_NM === '종로구') {
                    labelCenterX -= 0.02; // 라벨을 왼쪽으로 이동시킵니다.
                }

                const textLabel = new window.google.maps.Marker({
                    position: { lat: center.lat(), lng: labelCenterX }, // x 좌표를 수정하여 라벨의 위치를 조정합니다.
                    label: {
                        text: feature.properties.SIG_KOR_NM, // 구 이름을 표시합니다.
                        color: '#000000',
                        fontWeight: 'bold',
                    },
                    icon: {
                        path: 'M 0,0',
                    },
                    map: map
                });
            });
            // 데이터를 기반으로 지도에 마커를 추가
            post.forEach(item => {
                const lat = item.address.lat;
                const lng = item.address.lng;

                // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                const marker = new window.google.maps.Marker({
                    position: { lat: lat, lng: lng }, // 마커의 위치를 설정합니다.
                    map: map, // 마커를 표시할 지도를 설정합니다.
                    title: item.storeName,
                    label: {
                        text: item.storeName,
                        fontWeight: 'bold',
                        fontSize: '12px'
                    } // 마커 옆에 표시할 텍스트입니다.
                });

                // 마커 배열에 추가
                markers.push(marker);

                // 마커를 클릭했을 때 정보 창 열기
                marker.addListener('click', function () {
                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `
                            < div >
                                <p>ID: ${item.id}</p>
                                <p>Store Name: ${item.storeName}</p>
                                <img src="${item.fileList[0].imageUrl}" alt="Image" style="max-width: 200px; max-height: 200px;">
                            </>
                        `
                    });
                    infoWindow.open(map, marker);
                });
            });

            // 클러스터 생성 및 마커 추가
            clusterRef.current = new MarkerClusterer(map, markers, {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                gridSize: 160,
                zoomOnClick: true
            });
        }
    }, [isLoaded, post]);



    return (
        <div ref={mapRef} style={{ height: "800px", width: "100%" }}>
            {/* 여기에 지도가 표시됩니다. */}
        </div>
    );
};

export default GoogleMap;
