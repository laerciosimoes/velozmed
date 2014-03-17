/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


function CallSearch() {
    // Set LocalStorage
    localStorage.Specialty = $("#cmbSpecialty").val();
    localStorage.District = encodeURIComponent($("#txtDistrict").val());
    localStorage.HealthInsurance = $("#cmbHealthInsurance").val();
    localStorage.DateRequest = $("#cmbData").val();
    localStorage.SearchURL = "/Search/" +
                            "?Specialty=" + localStorage.Specialty +
                            "&District=" + localStorage.District +
                            "&HealthInsurance=" + localStorage.HealthInsurance +
                            "&DateRequest=" + localStorage.DateRequest;

    window.location = localStorage.SearchURL;

}

$(document).ready(function () {
    if (localStorage.District == false) {
        if ($("#txtDistrict").val().trim() == "") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    position.coords
                    console.log('Your latitude is :' + lat + ' and longitude is ' + long);
                    var coord = lat.toString() + '|' + long.toString();
                    $.get("api/location", { id: coord }, function (data) {
                        $("#txtDistrict").val(data);
                    });
                }, function error(err) {
                    console.warn('ERROR(' + err.code + '): ' + err.message);
                });
            }
        }
    }

    $.getJSON("http://velozmed.azurewebsites.net/api/SpecialtyByHealthInsurance", { id: 0 }, function (json) {
        var combo = $("#cmbSpecialty");
        combo.empty();
        $.each(json, function (index, value) {
          
                selected = "";
            
            combo.append('<option value="' + index + '"' + selected + '>' + value + '</option>');
        });
     
    });

   
      

        var healthInsurance = $("#cmbHealthInsurance");
        var url = "http://velozmed.azurewebsites.net/api/HealthInsurances";

        $.getJSON(url, function (data) {
            healthInsurance.html('');
            for (i = 0; i < data.length; i++) {
                healthInsurance.append('<option value="' + data[i].Id + '">' + data[i].Name + '</option>');
            }
            healthInsurance.append('</select>');
        })




    $("#cmbSpecialty").change(function () {
        var specialty = $("#cmbSpecialty").val();
        var healthInsuranceVal = $("#cmbHealthInsurance").val();
        $.getJSON("http://velozmed.azurewebsites.net/api/HealthInsuranceBySpecialty", { id: specialty }, function (json) {
            var combo = $("#cmbHealthInsurance");
            var selected = "";
            console.log(combo);
            combo.empty();
            $.each(json, function (index, value) {
                if (healthInsuranceVal == index) {
                    selected = 'selected="selected"';
                } else {
                    selected = "";
                }

                combo.append('<option value="' + index + '"' + selected + '>' + value + '</option>');
            });

        });
    });

    $("#cmbHealthInsurance").change(function () {
        var healthInsurace = $("#cmbHealthInsurance").val();
        var specialtyVal = $("#cmbSpecialty").val();
        var selected = "";

        $.getJSON("http://velozmed.azurewebsites.net/api/SpecialtyByHealthInsurance", { id: healthInsurace }, function (json) {
            var combo = $("#cmbSpecialty");

            combo.empty();
            $.each(json, function (index, value) {
                if (specialtyVal == index) {
                    selected = 'selected="selected"';
                } else {
                    selected = "";
                }

                combo.append('<option value="' + index + '"' + selected + '>' + value + '</option>');
            });

        });
    });

    $("#imgSearch").click(function () {

        if ($("#cmbSpecialty").val() == "0" || $("#cmbSpecialty").val() == null) {
            alert("Necessario selecionar a Especialidade");
            return false;
        }
        if ($("#txtDistrict").val().trim() == "") {
            alert("Necessario informar Bairro ou Cep");
            return false;
        }
        if ($("#cmbHealthInsurance").val() == null) {
            alert("Necessario Selecionar o Tipo de Convenio");
            return false;
        }

        localStorage.SearchParam = "";
        CallSearch();

    });

    $("#btnSearch").click(function () {

        if ($("#cmbSpecialty").val() == "0" || $("#cmbSpecialty").val() == null) {
            alert("Necessario selecionar a Especialidade");
            return false;
        }
        if ($("#txtDistrict").val().trim() == "") {
            alert("Necessario informar Bairro ou Cep");
            return false;
        }
        if ($("#cmbHealthInsurance").val() == null) {
            alert("Necessario Selecionar o Tipo de Convenio");
            return false;
        }
        CallSearch();
    });


    $("input[name='campoData']").change(function () {
        if ($(this).val() == "0" && $(this).is(":checked")) {
            $('#liData').hide();
        }
        if ($(this).val() == "1" && $(this).is(":checked")) {
            $('#liData').show();
        }
    });


    if (localStorage.Specialty) {
        $("#cmbSpecialty").val(localStorage.Specialty);
    }
    if (localStorage.District) {
        $("#txtDistrict").val(decodeURIComponent(localStorage.District));
    }
    if (localStorage.HealthInsurance) {
        $("#cmbHealthInsurance").val(localStorage.HealthInsurance);
    }

    if (localStorage.DateRequest) {
        $("#cmbData").val(localStorage.DateRequest);
        if ($("#cmbData").val() == null) {
            $("#cmbData option:first").attr('selected', 'selected');
        }
    }
});


