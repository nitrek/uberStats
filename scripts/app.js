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
        app.refreshCards();
    });

    // document.getElementById('butAdd').addEventListener('click', function() {
    //     // Open/show the add new city dialog
    //     app.toggleAddDialog(true);
    // });

    // document.getElementById('butAddCity').addEventListener('click', function() {
    //     // Add the newly selected city
    //     var select = document.getElementById('selectCityToAdd');
    //     var selected = select.options[select.selectedIndex];
    //     var key = selected.value;
    //     var label = selected.textContent;
    //     if (!app.selectedCities) {
    //         app.selectedCities = [];
    //     }
    //    // app.getdata(key, label);
    //     app.selectedCities.push({
    //         key: key,
    //         label: label
    //     });
    //     app.saveSelectedCities();
    //     app.toggleAddDialog(false);
    // });

    // document.getElementById('butAddCancel').addEventListener('click', function() {
    //     // Close the add new city dialog
    //     app.toggleAddDialog(false);
    // });


    /*****************************************************************************
     *
     * Methods to update/refresh the UI
     *
     ****************************************************************************/

    // Toggles the visibility of the add new city dialog.
    // app.toggleAddDialog = function(visible) {
    //     if (visible) {
    //         app.addDialog.classList.add('dialog-container--visible');
    //     } else {
    //         app.addDialog.classList.remove('dialog-container--visible');
    //     }
    // };

    // Updates a weather card with the latest weather forecast. If the card
    // doesn't already exist, it's cloned from the template.
    // result city-name: distance: numberofrides: waittime: ridetime:
    app.findCityInRides = function(parsedRidesData, cityName) {
        for (var prCount = 0, len = parsedRidesData.length; prCount < len; prCount++) {
            if (parsedRidesData.data.cityName == cityName)
                return i;
        }
    }
    app.updateCards = function(data) {
        //var dataLastUpdated = new Date(data.created);
        var totalRides = data.count;
        var cityNames = {};
        var allRides = data.history;
        var sampleData = {
            cityName: "",
            distance: "",
            rideTime: "",
            waitTime: "",
            numberOfRides: ""
        };
        var parsedRides = {
            count: [],
            data: []
        };
        for (var i = 0, len = allRides.length; i < len; i++) {
            console.log(parsedRides.data.length);
            console.log(sampleData);
            console.log(sampleData.cityName);
        }


        console.log(i + " iiiiiiiiiiiiiiiiiiiii");
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
     * getdata() first checks if the weather data is in the cache. If so,
     * then it gets that data and populates the card with the cached data.
     * Then, getdata() goes to the network for fresh data. If the network
     * request goes through, then the card gets updated a second time with the
     * freshest data.
     */
    app.getdata = function(key, label) {

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
        //                 app.updateCards(results);
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
        //             app.updateCards(results);
        //         }
        //     } else {
        //         // Return the initial weather forecast since no data is available.
        //         app.updateCards(initialWeatherForecast);
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

                function fetchRemHistory(offsetLoop) {
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
                Promise.resolve(offset).then(function loop(k) {
                    // The loop check
                    if (k < count) { // The post iteration increment
                        return fetchRemHistory(k).thenReturn((count - k) > 0 ? k + 50 : k + count).then(loop);
                    }
                }).then(function() {
                    console.log("done fetching");
                    console.log(JSON.stringify(result.history));
                    result.key = "total";
                    app.updateCards(result)
                }).catch(function(e) {
                    console.log("error", e);
                });
            });
            //console.log("toooooooooooooooooooooooooooooooootal");
            //console.log(result.history.length);
        });
    };

    // Iterate all of the cards and attempt to get the latest forecast data
    app.refreshCards = function() {
        app.getdata();
    };

    /************************************************************************
     *
     * Code required to start the app
     ************************************************************************/
    //start loading
    app.getdata();

    // service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() {
                console.log('Service Worker Registered');
            });
    }
})();
