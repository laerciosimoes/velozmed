function ShowMore(physicianId, colId) {
    $("#lnkMore" + physicianId + "_" + colId).hide();
    $("#divMore" + physicianId + "_" + colId).show();
}

function ShowPhysician(physicianId, specialtyId, district, healthInsuranceId, dateSearch, numDays, patientId) {

    $.get("/physician/ProfilePhysician/", {
            physicianId: physicianId, 
            specialtyId: specialtyId, 
            district: district, 
            healthInsuranceId: healthInsuranceId, 
            dateSearch: dateSearch, 
            numDays: numDays, 
            patientId: patientId}, function (data) {
        $("#dialog-physician").html(data);
        $("#dialog-physician").dialog({
            width: 900,
            height: 540,
            modal: true,
            autoOpen: false,
            close: function (event, ui) { },
            buttons: {
                Fechar: function () {
                    $(this).dialog("close");
                }
            }
        });
        $("#dialog-physician").dialog("open");
    });

}



function SetAppointment(physicianId, hour, dateRequest, specialtyId, healthInsuranceId, patientId, clinicId) {
    var userId = $("#hidUserId").val();
    if(userId == "IsNull")
    {
        localStorage.SearchParam = "SetAppointment("+ physicianId  +", '" + hour + "', '" + dateRequest + "', " + specialtyId + ", " + healthInsuranceId +  "," + patientId + "," + clinicId + ") ";
        var urlLogin = "/Account/Login?returnUrl=" + encodeURIComponent(localStorage.SearchURL);

        window.location = urlLogin;
    }
    else
    {
        if (patientId == "-1")
        {
            patientId = $("#hidPatientId").val();
        }
        var strId = physicianId.toString().concat("_", hour, "_", dateRequest, "_", specialtyId, "_", healthInsuranceId, "_", patientId, "_", clinicId);
        $.get("/request/appointment", { PhysicianId: physicianId,
                                        Hour: hour,
                                        DateRequest: dateRequest, 
                                        SpecialtyId : specialtyId, 
                                        HealthInsuranceId : healthInsuranceId, 
                                        PatientId : patientId, 
                                        ClinicId : clinicId}, function (data) {
       // $.get("/api/Appointment", { id: strId }, function (data) {
            $("#dialog-appointment").html(data);
            $("#dialog-appointment").dialog({
                width: 800,
                height: 560,
                modal: true,
                autoOpen: false,
                close: function(event, ui) {
                    localStorage.SearchParam = null;
                },
                buttons: {
                    "Agendar Consulta": function () {

                        if ($("#txtReason").val().trim() == "")
                        {
                            alert("Necessario informar o Motivo");
                        } else {
                            $(this).dialog("close");

                            $("#divWaiting").show();

                            $.post("/Request/Summary", {
                                PhysicianId: physicianId,
                                Hour: hour,
                                DateRequest: dateRequest,
                                SpecialtyId: specialtyId,
                                HealthInsuranceId: healthInsuranceId,
                                PatientId: patientId,
                                Request: false,
                                Name: $("#txtName").val(),
                                Phone: $("#txtPhone").val(),
                                Reason: $("#txtReason").val(),
                                Plan:  $("#cmbPlan").val(),
                                Who: $('input[name=radWho]:checked').val(),
                                ClinicId: clinicId
                            }, function (data) {
                                ShowSummary(data,true);
                            });
                        }
                    },
                    Cancelar: function () {
                        $(this).dialog("close");
                    }
                }
            });
            $('#txtPhone').inputmask('(99) 9999[9]-9999');
            $("#dialog-appointment").dialog("open");
            $("input[name='radWho']").change(function () {

                if ($(this).val() == '0') {
                    $('.liWho').hide();
                }
                if ($(this).val() == '1' ) {
                    $('.liWho').show();
                }
            });
        });
    }
}

function ShowSummary(data, showDiv) {
    var divHeight = 460;
    if (showDiv == false) {
        divHeight = 350;
    }
    $("#dialog-summary").html(data);
    $("#dialog-summary").dialog({
        width: 800,
        height: divHeight,
        modal: true,
        autoOpen: false,
        close: function (event, ui) {
            localStorage.SearchParam = null;
            window.location = localStorage.SearchURL;
        },
        buttons: {
            Voltar: function () {
                $(this).dialog("close");
                window.location = "/";
            }
        }
    });
    $("#divWaiting").hide();
    if (showDiv == false) {
        $("#divAppointment").hide();
    }

    $("#dialog-summary").dialog("open");
}

function ShowRequest(strId) {
    var userId = $("#hidUserId").val();
    if (userId == "IsNull") {

        localStorage.SearchParam = "ShowRequest('" + strId + "') ";
        var urlLogin = "/Account/Login?returnUrl=" + encodeURIComponent(localStorage.SearchURL);

        window.location = urlLogin;
   }
    else {

        if (strId.indexOf('IsNull') > 0) {
            patientId = $("#hidPatientId").val();
            strId = strId.replace('IsNull', patientId);
        }
        
        $.get("/Request/Create", { id: strId }, function (data) {
            $("#dialog-request").html(data);
            $("#dialog-request").dialog({
                width: 400,
                height: 500,
                modal: true,
                autoOpen: false,
                close: function (event, ui) {
                    localStorage.SearchParam = null;
                },
                buttons: {
                    "Solicitar Consulta": function () {

                        if ($("#txtReason").val().trim() == "") {
                            alert("Necessario informar o Motivo");
                        } else {
                            $(this).dialog("close");
                            $.post("/Request/Summary", {
                                PhysicianId: -1,
                                Hour: $("#cmbHour").val(),
                                DateRequest: $("#cmbData").val(),
                                SpecialtyId: $("#hidSpecialtyId").val(),
                                HealthInsuranceId: $("#hidHealthinsuranceId").val(),
                                PatientId: $("#hidPatientId").val(),
                                Request: true,
                                Reason: $("#txtReason").val(),
                                Plan: $("#cmbPlan").val(),
                            }, function (data) {
                                ShowSummary(data,false);
                            });
                        }
                    },
                    Cancelar: function () {
                        $(this).dialog("close");
                    }
                }
            });
            $("#dialog-request").dialog("open");
           
        });
    }
}

function SearchPhysicians(id) {
    var url = "";
    var html = "";
    url = "/api/SearchPhysician/" + id;

    $.getJSON(url, null, function (json) {
        html += "<div id='divRequest'>";
        html += "Não encontrou a data ideal para a consulta? <a href='javascript:ShowRequest(\"" + id + "\")'>Solicite aqui sua consulta</a>. Iremos procurar um médico para atendê-lo na data Solicitada";
        html += "</div>";

        html += "<table cellspacing='0'>";
        html += "<thead>";
        html += "<tr>";
        html += "   <th>Médico</th>";
        html += "  <th>Agenda para atendimento (Clique no horário desejado)</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";

        for (var i = 0; i < json.length; i++) {
            var dto = json[i];


            html += "<tr>";
            html += "<td class='pessoa'>";
            html += "<p class='foto'>";
            html += dto.ShowPhysician;
            html += "<img src='" + dto.PhotoUrl + "' />";
            html += "</a>";
            html += "</p>";
            html += "<div class='info'>";
            html += "<p class='medico'>";
            html += dto.ShowPhysician;
            html += "<strong>" + dto.Name + "</strong>";
            html += "</a>";
            html += "</p>";
            html += "<ul>";

            $.each(dto.Specialties, function (index, value) {
                html += "<li>" + value + "</li>";
            })

            html += "</ul>";
       
            html += "</div>";
            html += "<div class='locais'>";
            html += "<p><b>Locais em que atende:</b></p>";

            html += "<ul>";
            $.each(dto.Clinics, function (index, line) {
                html += "<li>";

                if (dto.Clinics.length > 1) {
                    html += " <span class='spanlocal'>Local " + line.Letter + "</span>";
                }
              
                html += "<b>" + line.Info[0] + "</b>";
                html += "</li>";
                html += "<li>" + line.Info[1] + "</li>";
            })
            
            html += "</ul>";

            html += "</div>";
            html += "</td>";
            html += "<td class='agenda'>";
            html += dto.AgendaHtml;
            html += "</td>";
            html += "</tr>";

        }
        html += "</tbody>";
        html += "</table>";

        $("#divSearch").html(html);
        $("#divWaiting").hide();

        if (localStorage.SearchParam) {
            if (localStorage.SearchParam != "") {
                eval(localStorage.SearchParam);
            }
        }

    });
}

