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
    var authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiaGlzdG9yeSIsImhpc3RvcnlfbGl0ZSIsInBsYWNlcyIsInByb2ZpbGUiLCJyaWRlX3dpZGdldHMiXSwic3ViIjoiNzEyMGU5YjktYTkyMi00ODk1LWI3MWItMTE3ZTEyYjJlYzhkIiwiaXNzIjoidWJlci11czEiLCJqdGkiOiJiOTc3YWY5ZC1iZjJkLTRiMWMtYTMwYy04MTM2ZGRhYWRkNzkiLCJleHAiOjE0OTI2MTYyNDUsImlhdCI6MTQ5MDAyNDI0NSwidWFjdCI6Im9qcGRkQVpFeDQzM3l3VkJiR2VmSFVLd3lQeTNtMyIsIm5iZiI6MTQ5MDAyNDE1NSwiYXVkIjoiMm9FUlg4RXNpanlSdDhBbEY4cFpwQ2ZFTUZLSXdNOHAifQ.j7vUaP0VYf0BEYzXEBcvFMIVx_GQPU8opgPsXeRjx0YuINoxZRlw0qNzwoy-nLiGSXD79ILKWDZVthIRHXA0i0aPaHmYKCOIAbWU3aZTlgs5xyHsesbwVGruBOTguGpFY8OvLqcI46SzTPdSQs8UNi933z5hKKr2BuA81THCZjf-UJus9gYwV-jA08JHQfw7ga3QT7-Eq2lVaG0QYPqVJSlCoPb0k7efuCVtpHWmJgzbZR6KXAWTODR453ZQNZv3nRm0ObHPPBsuAVj2VpwgW1Deyoh0GuPdFSVC2nicIzmeLmkh4Yel67iyAnIniTBccQKb6_PQYkfixQeFWNUkHg";

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
    app.QueryString = function() {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
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
        for (var prCount = 0, len = parsedRidesData.data.length; prCount < len; prCount++) {
            if (parsedRidesData.data[prCount].cityName == cityName)
                return prCount;
        }
        return -1;
    };
    app.getSampledata = function getSampledata() {
        var sampleData = {
            cityName: "",
            distance: 0,
            rideTime: 0,
            waitTime: 0,
            numberOfRides: 0
        };
        return sampleData;

    };
    app.updateCards = function(data) {
        //var dataLastUpdated = new Date(data.created);
        var totalRides = data.count;
        var cityNames = "";
        var allRides = data.history;
        var parsedRides = {
            count: [],
            data: []
        };
        parsedRides.count = totalRides;
        var tempData = app.getSampledata();
        tempData.cityName = "Total";
        tempData.numberOfRides = 1;
        tempData.distance = allRides[0].distance;
        tempData.rideTime = allRides[0].end_time - allRides[0].start_time;
        tempData.waitTime = allRides[0].start_time - allRides[0].request_time;
        parsedRides.data[0] = JSON.parse(JSON.stringify(tempData));
        tempData.cityName = allRides[0].start_city.display_name;
        parsedRides.data[1] = JSON.parse(JSON.stringify(tempData));
        var j = 2;
        cityNames = allRides[0].start_city.display_name;
        for (var i = 1, len = allRides.length; i < len; i++) {
            var loc = app.findCityInRides(parsedRides, allRides[i].start_city.display_name);
            parsedRides.data[0].numberOfRides = parsedRides.data[0].numberOfRides + 1;
            parsedRides.data[0].distance = parsedRides.data[0].distance + allRides[i].distance;
            parsedRides.data[0].rideTime = parsedRides.data[0].rideTime + (allRides[i].end_time - allRides[i].start_time);
            parsedRides.data[0].waitTime = parsedRides.data[0].waitTime + (allRides[i].start_time - allRides[i].request_time);
            if (loc != -1) {
                parsedRides.data[loc].numberOfRides = parsedRides.data[loc].numberOfRides + 1;
                parsedRides.data[loc].distance = parsedRides.data[loc].distance + allRides[i].distance;
                parsedRides.data[loc].rideTime = parsedRides.data[loc].rideTime + (allRides[i].end_time - allRides[i].start_time);
                parsedRides.data[loc].waitTime = parsedRides.data[loc].waitTime + (allRides[i].start_time - allRides[i].request_time);
            } else {
                // parsedRides.data[j] = {
                //     cityName: "",
                //     distance: 0,
                //     rideTime: 0,
                //     waitTime: 0,
                //     numberOfRides: 0
                // };
                parsedRides.data[j] = app.getSampledata();
                parsedRides.data[j].cityName = allRides[i].start_city.display_name;
                parsedRides.data[j].numberOfRides = 1;
                parsedRides.data[j].distance = allRides[i].distance;
                parsedRides.data[j].rideTime = (allRides[i].end_time - allRides[i].start_time);
                parsedRides.data[j].waitTime = (allRides[i].start_time - allRides[i].request_time);
                cityNames = cityNames + "," + parsedRides.data[j].cityName;
                j++;
            }
        }
        console.log(parsedRides);
        console.log(cityNames);
        console.log(" iiiiiiiiiiiiiiiiiiiii");
        var card = app.visibleCards[parsedRides.data[0].cityName];
        if (!card) {
            card = app.cardTemplate.cloneNode(true);
            card.classList.remove('cardTemplate');
            card.querySelector('.location').textContent = parsedRides.data[0].cityNames;
            card.removeAttribute('hidden');
            app.container.appendChild(card);
            app.visibleCards[parsedRides.data[0].cityName] = card;
        }
        card.querySelector('.location').textContent = parsedRides.data[0].cityName;
        card.querySelector('.numRides').textContent = parsedRides.data[0].numberOfRides;
        card.querySelector('.WaitTime').textContent = parsedRides.data[0].waitTime + " seconds";
        card.querySelector('.numCities').textContent = cityNames;
        card.querySelector('.rideTime').textContent = parsedRides.data[0].rideTime + " seconds";
        card.querySelector('.distance ').textContent = parsedRides.data[0].distance + " miles";
        for (var i = 1; i < parsedRides.data.length; i++) {
            var card = app.visibleCards[parsedRides.data[i].cityName];
            if (!card) {
                card = app.cardTemplate.cloneNode(true);
                card.classList.remove('cardTemplate');
                card.querySelector('.location').textContent = parsedRides.data[i].cityNames;
                card.removeAttribute('hidden');
                app.container.appendChild(card);
                app.visibleCards[parsedRides.data[i].cityName] = card;
            }
            card.querySelector('.location').textContent = parsedRides.data[i].cityName;
            card.querySelector('.numRides').textContent = parsedRides.data[i].numberOfRides;
            card.querySelector('.WaitTime').textContent = parsedRides.data[i].waitTime + " seconds";
            card.querySelector('.numCities').setAttribute('hidden', true);
            card.querySelector('.rideTime').textContent = parsedRides.data[i].rideTime + " seconds";
            card.querySelector('.distance ').textContent = parsedRides.data[i].distance + " miles";
            console.log(parsedRides.data[i].cityName);
        }
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
    app.getdata = function() {
        var codeString = app.QueryString()
        console.log(codeString);
        var data = "client_secret:_QepKRSc0h11Am21rHt9109mFlHlG6V_O1AiJCLb\r\nclient_id:2oERX8EsijyRt8AlF8pZpCfEMFKIwM8p\r\ngrant_type:authorization_code\r\nredirect_uri:" + window.location.href + "\r\ncode:" + codeString.code;
        var fetchAuthToken = "NA"
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                console.log(this.responseText);
                if (this.responseText != null)
                    fetchAuthToken = this.responseText.access_token;
            }
        });

        xhr.open("POST", "https://login.uber.com/oauth/v2/token?client_secret=_QepKRSc0h11Am21rHt9109mFlHlG6V_O1AiJCLb&client_id=2oERX8EsijyRt8AlF8pZpCfEMFKIwM8p&grant_type=authorization_code&redirect_uri=" + encodeURIComponent(window.location.href) + "&code=" + codeString.code);

        xhr.send(data);

        // var url1 = "https://login.uber.com/oauth/v2/token?client_secret=_QepKRSc0h11Am21rHt9109mFlHlG6V_O1AiJCLb&client_id=2oERX8EsijyRt8AlF8pZpCfEMFKIwM8p&grant_type=authorization_code&redirect_uri=http%3A%2F%2F127.0.0.1%3A8887%2F&code=" + codeString.code;
        //
        //
        // var myHeaders1 = new Headers();
        // myHeaders1.append("authorization", "Bearer " + authToken);
        // var myInit1 = {
        //     method: 'post',
        //     headers: myHeaders1,
        //     mode: 'cors',
        //     cache: 'default',
        //     data: data
        // };
        //
        // var myRequest1 = new Request(url1);
        // fetch(myRequest1, myInit1).then(function(response) {
        //     console.log("fsf");
        //     response.json().then(function(json) {
        //         console.log(json);
        //     });
        // });
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
        if (fetchAuthToken.length > 100) {
            myHeaders.append("authorization", "Bearer " + fetchAuthToken);
        } else {
            myHeaders.append("authorization", "Bearer " + authToken);
        }
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
