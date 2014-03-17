$.widget("ui.combobox", {
    _create: function () {
        var self = this;
        var select = this.element.hide(),
          selected = select.children(":selected"),
          value = selected.val() ? selected.text() : "";
        var input = $("<input />")
          .insertAfter(select)
          .val(value)
          .autocomplete({
              delay: 0,
              minLength: 0,
              source: function (request, response) {
                  var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                  response(select.children("option").map(function () {
                      var text = $(this).text();
                      if (this.value && (!request.term || matcher.test(text)))
                          return {
                              label: text,
                              value: text,
                              option: this
                          };
                  }));
              },
              select: function (event, ui) {
                  console.log("Call Select -> " + this.id  + " => " + event.id);
                  ui.item.option.selected = true;
                  self._trigger("selected", event, {
                      item: ui.item.option
                  });
              },
              change: function (event, ui) {

                  if (!ui.item) {
                      var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
                      valid = false;
                      select.children("option").each(function () {
                          if (this.value.match(matcher)) {
                              this.selected = valid = true;
                              return false;
                          }
                      });
                      if (!valid) {
                          // remove invalid value, as it didn't match anything
                          $(this).val("");
                          select.val("");
                          return false;
                      }
                  }
              }
          })
          .addClass("ui-widget ui-widget-content ui-corner-left");


    }
});

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


    $("#cmbSpecialty").change(function () {
        var specialty = $("#cmbSpecialty").val();
        var healthInsuranceVal = $("#cmbHealthInsurance").val();
        $.getJSON("/api/HealthInsuranceBySpecialty", { id: specialty }, function (json) {
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

        $.getJSON("/api/SpecialtyByHealthInsurance", { id: healthInsurace }, function (json) {
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
        if ($("#txtDistrict").val().trim() == "" ) {
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


    if(localStorage.Specialty) {
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

