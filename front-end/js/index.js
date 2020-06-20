if (findGetParameter("site") === null) {
  $.ajax({
    url: "/get-all-websites",
    method: "GET",
    type: "text/json",
  })
    .always(function () {
      //$(button).html("Load Site Data...");
    })
    .done(function (evt) {
      var result = JSON.parse(evt);
      const ordered = {};
      Object.keys(result)
        .reverse()
        .forEach(function (key) {
          ordered[result[key].URL] = {};
          ordered[result[key].URL][key] = result[key];
        });
      let toShow = {};
      console.log(ordered);
      Object.keys(ordered).forEach(function (key) {
        toShow[key] = ordered[key][Object.keys(ordered[key])[0]];
        console.log(toShow);
      });
      let html =
        '<table class="table">' +
        "<thead>" +
        "<tr>" +
        '<th scope="col">Domain</th>' +
        '<th scope="col">Time</th>' +
        '<th scope="col">Status Code</th>' +
        '<th scope="col">Status Duration</th>' +
        '<th scope="col">Response Time</th>' +
        '<th scope="col">Response Time Avg</th>' +
        "</tr>" +
        "</thead>" +
        "<tbody>";
      for(key in toShow){
        var dot = toShow[key].statusCode == 200 ? "greenDot" : "redDot";
        html += '<div class="tables-doctor-content">';
          html +=
            "<tr>" +
            "<td>" +
            "<div style='display: flex;'><h2>" +
            toShow[key].URL +
            "</h2><h2 class='dot " +
            dot +
            "'></h2></div>" +
            "</td>" +
            "<td>" +
            toShow[key].time +
            "</td>" +
            "<td>" +
            toShow[key].statusCode +
            "</td>" +
            "<td>" +
            toShow[key]["status duration"] +
            "</td>" +
            "<td>" +
            toShow[key].responseTime +
            "</td>" +
            "<td>" +
            toShow[key]["avg response time"] +
            "</td>" +
            "</tr>";

        };
        html += "</tbody></table>";
        html += "</div>";
        $(".tables-doctor").html(html);
    });
} else {
  // json data
  var api = "/" + findGetParameter("site"); //httpslowchost.co.il.json
  // button trigger
  $("#view-doctors").on("click", function () {
    var button = $(this);
    $.ajax({
      url: api,
      method: "GET",
      type: "text/json",
    })
      .always(function () {
        $(button).html("Load Site Data...");
      })
      .done(function (evt) {
        // Disable button
        $(button).prop("disabled", true);
        // Set timeout for lazy loading
        let interval = 0;
        setTimeout(function () {
          var result = JSON.parse(evt);
          const ordered = {};
          Object.keys(result)
            .reverse()
            .forEach(function (key) {
              ordered[key] = result[key];
            });
          var dot =
            ordered[Object.keys(ordered)[0]].statusCode == 200
              ? "greenDot"
              : "redDot";
          var html =
            "<div style='display: flex;'><h2>" +
            getWebsiteName() +
            "</h2><h2 class='dot " +
            dot +
            "'></h2></div>";
          html += '<div class="tables-doctor-content">';
          html +=
            '<table class="table">' +
            "<thead>" +
            "<tr>" +
            '<th scope="col">Time</th>' +
            '<th scope="col">Status Code</th>' +
            '<th scope="col">Status Duration</th>' +
            '<th scope="col">Response Time</th>' +
            '<th scope="col">Response Time Avg</th>' +
            "</tr>" +
            "</thead>" +
            "<tbody>";
          for (var i in ordered) {
            html +=
              "<tr>" +
              "<td>" +
              ordered[i].time +
              "</td>" +
              "<td>" +
              ordered[i].statusCode +
              "</td>" +
              "<td>" +
              ordered[i]["status duration"] +
              "</td>" +
              "<td>" +
              ordered[i].responseTime +
              "</td>" +
              "<td>" +
              ordered[i]["avg response time"] +
              "</td>" +
              "</tr>";
          }
          html += "</tbody></table>";
          html += "</div>";
          // Set all content
          $(".tables-doctor").html(html);
        }, 1000);
      })
      .fail(function () {
        alert("Error : Failed to reach API Url or check your connection");
        $(button).prop("disabled", false);
      })
      .then(function (evt) {
        setTimeout(function () {
          $(button).css({ "background-color": "#ccc" }).hide();
        }, 1000);
      });
  });
  $("#view-doctors").trigger("click");
  setInterval(function () {
    $("#view-doctors").trigger("click");
  }, 60000);
}

function findGetParameter(parameterName) {
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

function getWebsiteName() {
  var unformatted = findGetParameter("site");
  var formatted = unformatted.replace("https", "https://");
  formatted = formatted.replace(".json", "");
  return formatted;
}
