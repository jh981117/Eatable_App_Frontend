import { GpsFixed } from '@material-ui/icons';
import React, { useEffect } from 'react'
import './Autocomplete.css'

const Autocomplete = () => {

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&libraries=places`;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            initialize();
        };

        return () => {
            document.body.removeChild(script);
        };

    }, []);

    const initialize = () => {
        const input = document.getElementById('autocomplete_search');
        const autocomplete = new window.google.maps.places.Autocomplete(input);

        autocomplete.addListener('place_changed', function () {
            const place = autocomplete.getPlace();
            console.log(place);
            if (!place.geometry || !place.geometry.location) {
                // 장소가 없을 때 가장 근접한 검색어로 입력
                const service = new window.google.maps.places.AutocompleteService();
                service.getPlacePredictions({ input: input.value }, function (predictions, status) {
                    if (status === 'OK' && predictions) {
                        // 근접한 검색어의 주소, 우편번호, 좌표 입력
                        const placeService = new window.google.maps.places.PlacesService(document.createElement('div'));
                        placeService.getDetails({ placeId: predictions[0].place_id }, function (placeDetails, placeStatus) {
                            if (placeStatus === 'OK') {
                                document.getElementById('lat').value = placeDetails.geometry.location.lat();
                                document.getElementById('long').value = placeDetails.geometry.location.lng();
                                document.getElementById('formatted_address').value = placeDetails.formatted_address;

                                // 주소의 우편번호 가져오기
                                for (let i = 0; i < placeDetails.address_components.length; i++) {
                                    const addressType = placeDetails.address_components[i].types[0];
                                    if (addressType === 'postal_code') {
                                        document.getElementById('postal_code').value = placeDetails.address_components[i].long_name;
                                        break;
                                    }
                                }
                            } else {
                                alert('근접한 장소의 세부 정보를 가져올 수 없습니다.');
                            }
                        });
                    }
                });
                return;
            }
            document.getElementById('lat').value = place.geometry.location.lat();
            document.getElementById('long').value = place.geometry.location.lng();
            document.getElementById('formatted_address').value = place.formatted_address;

            // 좌표를 사용하여 우편번호 가져오기
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ 'location': place.geometry.location }, function (results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        for (let i = 0; i < results[0].address_components.length; i++) {
                            const addressType = results[0].address_components[i].types[0];
                            if (addressType === 'postal_code') {
                                document.getElementById('postal_code').value = results[0].address_components[i].long_name;
                                break;
                            }
                        }
                    } else {
                        alert('우편번호를 찾을 수 없습니다.');
                    }
                } else {
                    alert('Geocoder에 문제가 발생했습니다.');
                }
            });
            document.getElementById('formatted_address').value = place.formatted_address;
        });

        // 입력창에 키가 눌릴 때마다 자동완성된 검색어 저장
        input.addEventListener('input', function () {
            input.setAttribute('data-autocompleted-value', input.value);
        });
    };

    const findMyLocation = (event) => {
        event.preventDefault(); // 현재 위치 버튼 클릭 시 폼 제출 방지

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    document.getElementById('lat').value = latitude;
                    document.getElementById('long').value = longitude;

                    const geocoder = new window.google.maps.Geocoder();
                    const latLng = new window.google.maps.LatLng(latitude, longitude);
                    geocoder.geocode({ 'location': latLng }, function (results, status) {
                        if (status === 'OK') {
                            if (results[0]) {
                                for (let i = 0; i < results[0].address_components.length; i++) {
                                    const addressType = results[0].address_components[i].types[0];
                                    if (addressType === 'postal_code') {
                                        document.getElementById('postal_code').value = results[0].address_components[i].long_name;
                                        break;
                                    }
                                }
                                document.getElementById('formatted_address').value = results[0].formatted_address;

                                  // Set search input value to the formatted address
                                  document.getElementById('autocomplete_search').value = results[0].formatted_address;
                            } else {
                                alert('Postal code not found.');
                            }
                        } else {
                            alert('Geocoder failed due to: ' + status);
                        }
                    });
                },
                () => {
                    alert('Unable to retrieve your location.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault(); // 폼 제출 방지
    };

    return (
        // <div className="container">
        //     <div className="row">
        //         <div className="col-12">
        //             <div id="custom-search-input">
        <div onSubmit={handleFormSubmit}>
            <div className="act">
                <input id="autocomplete_search" name="autocomplete_search" type="text" className="form-control" placeholder="Search" />
                <button onClick={findMyLocation}><GpsFixed /></button>
            </div>
            <input type="text" name="lat" id="lat"  placeholder="lat" />
            <input type="text
                " name="long" id="long"  placeholder="long"/>
            {/* 주소 입력 input */}
            <input type="text" name="formatted_address" id="formatted_address" className="form-control" placeholder="Address" readOnly />
            {/* 우편번호 입력 input */}
            <input type="text" name="postal_code" id="postal_code" className="form-control" placeholder="Postal Code" readOnly />
        </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
};

export default Autocomplete;
