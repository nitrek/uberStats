// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var geocoder = new google.maps.Geocoder;

latitude = 17.385;
longitude = 78.4867;
var latlng = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude)
};

geocoder.geocode({
    'location': latlng
}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
            console.log("place_id :" + results[1].place_id);
        } else {
            window.alert('No results found');
        }
    } else {
        window.alert('Geocoder failed due to: ' + status);
    }
});
var positions = [
    [40.7033127, -73.979681], // NY
    [34.0204989, -118.4117325], // LA
    [18.4469284, 100.1933182], // SEA
    [8.8588589, 2.3470599], // Paris
    [37.5651, 126.98955], // Seoul
    [-26.5935356, 136.1055972], // Australia
    [-28.4792811, 24.6722268], // South Africa
    [-2.548926, 118.0148634], // Indonesia
    [-74.7131969, 0], // Antarctica
];

function showGoogleMaps() {

    var position = positions[Math.floor(Math.random() * positions.length)];
    var latLng = new google.maps.LatLng(position[0], position[1]);

    var mapOptions = {
        zoom: 5,
        scrollwheel: false,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: latLng,
        styles: [{
            "featureType": "all",
            "elementType": "all",
            "stylers": [{
                "gamma": "1.00"
            }, {
                "saturation": "0"
            }, {
                "visibility": "on"
            }]
        }, {
            "featureType": "all",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#ffffff"
            }]
        }, {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 13
            }]
        }, {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#144b53"
            }, {
                "lightness": 14
            }, {
                "weight": 1.4
            }]
        }, {
            "featureType": "administrative",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{
                "color": "#08304b"
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#0c4152"
            }, {
                "lightness": 5
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#0b434f"
            }, {
                "lightness": 25
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road.highway.controlled_access",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#0b3d51"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{
                "color": "#146474"
            }]
        }, {
            "featureType": "transit",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit.line",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
                "color": "#021019"
            }]
        }],
    };

    map = new google.maps.Map(document.getElementById('googlemaps'), mapOptions);

}

google.maps.event.addDomListener(window, 'load', showGoogleMaps);


(function() {
    'use strict';

    var app = {
        isLoading: true,
        visibleCards: {},
        selectedCities: [],
        spinner: document.querySelector('.loader'),
        cardTemplate: document.querySelector('.cardTemplate'),
        container: document.querySelector('.main'),
        addDialog: document.querySelector('.dialog-container'),
        daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    };


    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/

    document.getElementById('butRefresh').addEventListener('click', function() {
        // Refresh all of the forecasts
        app.updateForecasts();
    });

    document.getElementById('butAdd').addEventListener('click', function() {
        // Open/show the add new city dialog
        app.toggleAddDialog(true);
    });

    document.getElementById('butAddCity').addEventListener('click', function() {
        // Add the newly selected city
        var select = document.getElementById('selectCityToAdd');
        var selected = select.options[select.selectedIndex];
        var key = selected.value;
        var label = selected.textContent;
        if (!app.selectedCities) {
            app.selectedCities = [];
        }
        app.getForecast(key, label);
        app.selectedCities.push({
            key: key,
            label: label
        });
        app.saveSelectedCities();
        app.toggleAddDialog(false);
    });

    document.getElementById('butAddCancel').addEventListener('click', function() {
        // Close the add new city dialog
        app.toggleAddDialog(false);
    });


    /*****************************************************************************
     *
     * Methods to update/refresh the UI
     *
     ****************************************************************************/

    // Toggles the visibility of the add new city dialog.
    app.toggleAddDialog = function(visible) {
        if (visible) {
            app.addDialog.classList.add('dialog-container--visible');
        } else {
            app.addDialog.classList.remove('dialog-container--visible');
        }
    };

    // Updates a weather card with the latest weather forecast. If the card
    // doesn't already exist, it's cloned from the template.
    app.updateForecastCard = function(data) {
        //var dataLastUpdated = new Date(data.created);
        var totalRides = data.count;

        var card = app.visibleCards[data.key];
        if (!card) {
            card = app.cardTemplate.cloneNode(true);
            card.classList.remove('cardTemplate');
            card.querySelector('.location').textContent = "Total";
            card.removeAttribute('hidden');
            app.container.appendChild(card);
            app.visibleCards[data.key] = card;
        }
        card.querySelector('.location').textContent = "Total";
        card.querySelector('.numRides').textContent = data.count;

        if (app.isLoading) {
            app.spinner.setAttribute('hidden', true);
            app.container.removeAttribute('hidden');
            app.isLoading = false;
        }
    };


    /*****************************************************************************
     *
     * Methods for dealing with the model
     *
     ****************************************************************************/

    /*
     * Gets a forecast for a specific city and updates the card with the data.
     * getForecast() first checks if the weather data is in the cache. If so,
     * then it gets that data and populates the card with the cached data.
     * Then, getForecast() goes to the network for fresh data. If the network
     * request goes through, then the card gets updated a second time with the
     * freshest data.
     */
    app.getForecast = function(key, label) {

        // // TODO add cache logic here
        // if ('caches' in window) {
        //     /*
        //      * Check if the service worker has already cached this city's weather
        //      * data. If the service worker has the data, then display the cached
        //      * data while the app fetches the latest data.
        //      */
        //     caches.match(url).then(function(response) {
        //         if (response) {
        //             response.json().then(function updateFromCache(json) {
        //                 var results = json.query.results;
        //                 results.key = key;
        //                 results.label = label;
        //                 results.created = json.query.created;
        //                 app.updateForecastCard(results);
        //             });
        //         }
        //     });
        // }
        // Fetch the latest data.
        // var request = new XMLHttpRequest();
        // request.onreadystatechange = function() {
        //     if (request.readyState === XMLHttpRequest.DONE) {
        //         if (request.status === 200) {
        //             var response = JSON.parse(request.response);
        //             var results = response.query.results;
        //             results.key = key;
        //             results.label = label;
        //             results.created = response.query.created;
        //             app.updateForecastCard(results);
        //         }
        //     } else {
        //         // Return the initial weather forecast since no data is available.
        //         app.updateForecastCard(initialWeatherForecast);
        //     }
        // };
        // request.open('GET', url);
        // // request.send();
        // var data = null;
        // //total
        // var xhr = new XMLHttpRequest();
        // var results = {};
        // var rideTime = 0;
        // var WaitTime = 0;
        // var numberOfKm = 0;
        // var numberOfCities = 0;
        var url = "https://api.uber.com/v1.2/history?limit=50"
        // xhr.addEventListener("readystatechange", function() {
        //     if (this.readyState === 4) {
        //         console.log(this.responseText);
        //         var results = JSON.parse(this.responseText);
        //         results.key = "total"
        //         var count = results.count;
        //         while (count > 50) {
        //             count = count - 50;
        //             var offset = count;
        //             if (offset > 50)
        //                 offset = 50;
        //
        //             var xhrinner = new XMLHttpRequest();
        //             xhrinner.addEventListener("readystatechange", function() {
        //                 if (this.readyState === 4) {
        //                     var results1 = JSON.parse(this.responseText);
        //                     results.history = results.history + results1.history;
        //                 }
        //             });
        //             xhrinner.open("GET", url + "&offset=" + offset);
        //             xhrinner.setRequestHeader("authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiaGlzdG9yeSIsImhpc3RvcnlfbGl0ZSIsInBsYWNlcyIsInByb2ZpbGUiLCJyaWRlX3dpZGdldHMiXSwic3ViIjoiNzEyMGU5YjktYTkyMi00ODk1LWI3MWItMTE3ZTEyYjJlYzhkIiwiaXNzIjoidWJlci11czEiLCJqdGkiOiJiOTc3YWY5ZC1iZjJkLTRiMWMtYTMwYy04MTM2ZGRhYWRkNzkiLCJleHAiOjE0OTI2MTYyNDUsImlhdCI6MTQ5MDAyNDI0NSwidWFjdCI6Im9qcGRkQVpFeDQzM3l3VkJiR2VmSFVLd3lQeTNtMyIsIm5iZiI6MTQ5MDAyNDE1NSwiYXVkIjoiMm9FUlg4RXNpanlSdDhBbEY4cFpwQ2ZFTUZLSXdNOHAifQ.j7vUaP0VYf0BEYzXEBcvFMIVx_GQPU8opgPsXeRjx0YuINoxZRlw0qNzwoy-nLiGSXD79ILKWDZVthIRHXA0i0aPaHmYKCOIAbWU3aZTlgs5xyHsesbwVGruBOTguGpFY8OvLqcI46SzTPdSQs8UNi933z5hKKr2BuA81THCZjf-UJus9gYwV-jA08JHQfw7ga3QT7-Eq2lVaG0QYPqVJSlCoPb0k7efuCVtpHWmJgzbZR6KXAWTODR453ZQNZv3nRm0ObHPPBsuAVj2VpwgW1Deyoh0GuPdFSVC2nicIzmeLmkh4Yel67iyAnIniTBccQKb6_PQYkfixQeFWNUkHg");
        //             //  xhr.setRequestHeader("cache-control", "no-cache");
        //             //  xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
        //
        //             xhrinner.send(data);
        //
        //         }
        //         console.log(results);
        //     }
        // });
        //
        // xhr.open("GET", url);
        // xhr.setRequestHeader("authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiaGlzdG9yeSIsImhpc3RvcnlfbGl0ZSIsInBsYWNlcyIsInByb2ZpbGUiLCJyaWRlX3dpZGdldHMiXSwic3ViIjoiNzEyMGU5YjktYTkyMi00ODk1LWI3MWItMTE3ZTEyYjJlYzhkIiwiaXNzIjoidWJlci11czEiLCJqdGkiOiJiOTc3YWY5ZC1iZjJkLTRiMWMtYTMwYy04MTM2ZGRhYWRkNzkiLCJleHAiOjE0OTI2MTYyNDUsImlhdCI6MTQ5MDAyNDI0NSwidWFjdCI6Im9qcGRkQVpFeDQzM3l3VkJiR2VmSFVLd3lQeTNtMyIsIm5iZiI6MTQ5MDAyNDE1NSwiYXVkIjoiMm9FUlg4RXNpanlSdDhBbEY4cFpwQ2ZFTUZLSXdNOHAifQ.j7vUaP0VYf0BEYzXEBcvFMIVx_GQPU8opgPsXeRjx0YuINoxZRlw0qNzwoy-nLiGSXD79ILKWDZVthIRHXA0i0aPaHmYKCOIAbWU3aZTlgs5xyHsesbwVGruBOTguGpFY8OvLqcI46SzTPdSQs8UNi933z5hKKr2BuA81THCZjf-UJus9gYwV-jA08JHQfw7ga3QT7-Eq2lVaG0QYPqVJSlCoPb0k7efuCVtpHWmJgzbZR6KXAWTODR453ZQNZv3nRm0ObHPPBsuAVj2VpwgW1Deyoh0GuPdFSVC2nicIzmeLmkh4Yel67iyAnIniTBccQKb6_PQYkfixQeFWNUkHg");
        // //  xhr.setRequestHeader("cache-control", "no-cache");
        // //  xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
        //
        // xhr.send(data);
        //promise
        var myHeaders = new Headers();
        myHeaders.append("authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiaGlzdG9yeSIsImhpc3RvcnlfbGl0ZSIsInBsYWNlcyIsInByb2ZpbGUiLCJyaWRlX3dpZGdldHMiXSwic3ViIjoiNzEyMGU5YjktYTkyMi00ODk1LWI3MWItMTE3ZTEyYjJlYzhkIiwiaXNzIjoidWJlci11czEiLCJqdGkiOiJiOTc3YWY5ZC1iZjJkLTRiMWMtYTMwYy04MTM2ZGRhYWRkNzkiLCJleHAiOjE0OTI2MTYyNDUsImlhdCI6MTQ5MDAyNDI0NSwidWFjdCI6Im9qcGRkQVpFeDQzM3l3VkJiR2VmSFVLd3lQeTNtMyIsIm5iZiI6MTQ5MDAyNDE1NSwiYXVkIjoiMm9FUlg4RXNpanlSdDhBbEY4cFpwQ2ZFTUZLSXdNOHAifQ.j7vUaP0VYf0BEYzXEBcvFMIVx_GQPU8opgPsXeRjx0YuINoxZRlw0qNzwoy-nLiGSXD79ILKWDZVthIRHXA0i0aPaHmYKCOIAbWU3aZTlgs5xyHsesbwVGruBOTguGpFY8OvLqcI46SzTPdSQs8UNi933z5hKKr2BuA81THCZjf-UJus9gYwV-jA08JHQfw7ga3QT7-Eq2lVaG0QYPqVJSlCoPb0k7efuCVtpHWmJgzbZR6KXAWTODR453ZQNZv3nRm0ObHPPBsuAVj2VpwgW1Deyoh0GuPdFSVC2nicIzmeLmkh4Yel67iyAnIniTBccQKb6_PQYkfixQeFWNUkHg");
        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };

        var myRequest = new Request(url);
        var result = {};
        var count = 0;
        var offset = 0;
        fetch(myRequest, myInit).then(function(response) {
            console.log("fsf");
            response.json().then(function(json) {
                console.log(json);
                result = json;
                count = json.count;
                // result = JSON.parse(response);
                if (count > 50) {
                    offset = 50;
                } else {
                    offset = 0;
                }
                console.log("offsetof" + offset);

                Promise.prototype.thenReturn = function(value) {
                    return this.then(function() {
                        return value;
                    });
                };

                function fetchRemHostory(offsetLoop) {
                    var myRequestinner = new Request(url + "&offset=" + offsetLoop);
                    return new Promise(function(resolve) {
                        fetch(myRequestinner, myInit).then(function(responseInner) {
                            responseInner.json().then(function(jsonInner) {
                                result.history = result.history.concat(jsonInner.history);
                                //  result.history.length = result.history.length + jsonInner.history.length;
                                console.log(jsonInner.history.length + " <-----------------");
                                console.log(result.history.length);
                                resolve();
                            });
                            console.log(offsetLoop + "offsetLoop");

                        })
                    });
                }

                // The loop initialization
                Promise.resolve(offset).then(function loop(i) {
                    // The loop check
                    if (i < count) { // The post iteration increment
                        return fetchRemHostory(i).thenReturn((count - i) > 0 ? i + 50 : 0).then(loop);
                    }
                }).then(function() {
                    console.log("done fetching");
                    console.log(JSON.stringify(result.history));
                }).catch(function(e) {
                    console.log("error", e);
                });
            });
            //console.log("toooooooooooooooooooooooooooooooootal");
            //console.log(result.history.length);
        });
    };

    // Iterate all of the cards and attempt to get the latest forecast data
    app.updateForecasts = function() {

        app.getForecast(key);

    };

    // TODO add saveSelectedCities function here
    // Save list of cities to localStorage.
    app.saveSelectedCities = function() {
        var selectedCities = JSON.stringify(app.selectedCities);
        localStorage.selectedCities = selectedCities;
    };

    app.getIconClass = function(weatherCode) {
        // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
        weatherCode = parseInt(weatherCode);
        switch (weatherCode) {
            case 25: // cold
            case 32: // sunny
            case 33: // fair (night)
            case 34: // fair (day)
            case 36: // hot
            case 3200: // not available
                return 'clear-day';
            case 0: // tornado
            case 1: // tropical storm
            case 2: // hurricane
            case 6: // mixed rain and sleet
            case 8: // freezing drizzle
            case 9: // drizzle
            case 10: // freezing rain
            case 11: // showers
            case 12: // showers
            case 17: // hail
            case 35: // mixed rain and hail
            case 40: // scattered showers
                return 'rain';
            case 3: // severe thunderstorms
            case 4: // thunderstorms
            case 37: // isolated thunderstorms
            case 38: // scattered thunderstorms
            case 39: // scattered thunderstorms (not a typo)
            case 45: // thundershowers
            case 47: // isolated thundershowers
                return 'thunderstorms';
            case 5: // mixed rain and snow
            case 7: // mixed snow and sleet
            case 13: // snow flurries
            case 14: // light snow showers
            case 16: // snow
            case 18: // sleet
            case 41: // heavy snow
            case 42: // scattered snow showers
            case 43: // heavy snow
            case 46: // snow showers
                return 'snow';
            case 15: // blowing snow
            case 19: // dust
            case 20: // foggy
            case 21: // haze
            case 22: // smoky
                return 'fog';
            case 24: // windy
            case 23: // blustery
                return 'windy';
            case 26: // cloudy
            case 27: // mostly cloudy (night)
            case 28: // mostly cloudy (day)
            case 31: // clear (night)
                return 'cloudy';
            case 29: // partly cloudy (night)
            case 30: // partly cloudy (day)
            case 44: // partly cloudy
                return 'partly-cloudy-day';
        }
    };

    /*
     * Fake weather data that is presented when the user first uses the app,
     * or when the user has not saved any cities. See startup code for more
     * discussion.
     */
    var initialWeatherForecast = {
        key: '2459115',
        label: 'New York, NY',
        created: '2016-07-22T01:00:00Z',
        channel: {
            astronomy: {
                sunrise: "5:43 am",
                sunset: "8:21 pm"
            },
            item: {
                condition: {
                    text: "Windy",
                    date: "Thu, 21 Jul 2016 09:00 PM EDT",
                    temp: 56,
                    code: 24
                },
                forecast: [{
                        code: 44,
                        high: 86,
                        low: 70
                    },
                    {
                        code: 44,
                        high: 94,
                        low: 73
                    },
                    {
                        code: 4,
                        high: 95,
                        low: 78
                    },
                    {
                        code: 24,
                        high: 75,
                        low: 89
                    },
                    {
                        code: 24,
                        high: 89,
                        low: 77
                    },
                    {
                        code: 44,
                        high: 92,
                        low: 79
                    },
                    {
                        code: 44,
                        high: 89,
                        low: 77
                    }
                ]
            },
            atmosphere: {
                humidity: 56
            },
            wind: {
                speed: 25,
                direction: 195
            }
        }
    };
    // TODO uncomment line below to test app with fake data
    // app.updateForecastCard(initialWeatherForecast);

    /************************************************************************
     *
     * Code required to start the app
     *
     * NOTE: To simplify this codelab, we've used localStorage.
     *   localStorage is a synchronous API and has serious performance
     *   implications. It should not be used in production applications!
     *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
     *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
     ************************************************************************/

    // TODO add startup code here
    app.selectedCities = localStorage.selectedCities;
    if (app.selectedCities) {
        app.selectedCities = JSON.parse(app.selectedCities);
        app.selectedCities.forEach(function(city) {
            app.getForecast(city.key, city.label);
        });
    } else {
        /* The user is using the app for the first time, or the user has not
         * saved any cities, so show the user some fake data. A real app in this
         * scenario could guess the user's location via IP lookup and then inject
         * that data into the page.
         */
        app.updateForecastCard(initialWeatherForecast);
        app.selectedCities = [{
            key: initialWeatherForecast.key,
            label: initialWeatherForecast.label
        }];
        app.saveSelectedCities();
    }

    // TODO add service worker code here
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() {
                console.log('Service Worker Registered');
            });
    }
})();
