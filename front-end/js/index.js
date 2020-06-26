if (findGetParameter("site") === null) {
  indexPageAjax();
  indexPageLoop();
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
          let sortedResponseTimeChart = [];
          let lables = [];
          let ii = 0;
          Object.keys(result)
            .reverse()
            .forEach(function (key) {
              ordered[key] = result[key];
              //console.log(sortedResponseTimeChart)
              lables.unshift(result[key].time);
              ii++;
              sortedResponseTimeChart.unshift(parseInt(result[key].responseTime.replace("ms", "").replace("s", "")));
            });
            
            console.log(sortedResponseTimeChart)
            var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'line',
            
                // The data for our dataset
                data: {
                    labels: lables,
                    datasets: [{
                        label: 'Reponse Times (ms)',
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: sortedResponseTimeChart
                    }]
                },
            
                // Configuration options go here
                options: {}
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
            '<th scope="col">Is Cached</th>' +
            "</tr>" +
            "</thead>" +
            "<tbody>";
          ii = 0;
          let showMore = '';
          for (var i in ordered) {
            if (ii === 20 && !clickedShowAll) {
              showMore = 'show-more';
              html += ' <tr>   <td></td><td></td>    <td></td>       <td class="show-more-button">Show all</td> <td></td><td></td>           </tr>';
            }
            ii++;
            ordered[i].cachedResponse =
              typeof ordered[i].cachedResponse == "undefined"
                ? "not tested"
                : ordered[i].cachedResponse;
            html +=
              "<tr class='"+showMore+"'>" +
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
              "<td>" +
              ordered[i].cachedResponse +
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

function indexPageAjax() {
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
      Object.keys(result).forEach(function (key) {
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
        '<th scope="col">Is Cached</th>' +
        "</tr>" +
        "</thead>" +
        "<tbody>";
      for (key in toShow) {
        var dot = toShow[key].statusCode == 200 ? "greenDot" : "redDot";
        toShow[key].cachedResponse =
          typeof toShow[key].cachedResponse == "undefined"
            ? "not tested"
            : toShow[key].cachedResponse;
        html += '<div class="tables-doctor-content">';
        html +=
          "<tr>" +
          "<td>" +
          "<div style='display: flex;'><a href='/index.html?site=" +
          toShow[key].URL.replace(/[\\/:"*?<>|]+/, "") +
          ".json'><h2>" +
          toShow[key].URL +
          "</h2></a><h2 class='dot " +
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
          "<td>" +
          toShow[key].cachedResponse +
          "</td>" +
          "</tr>";
      }
      html += "</tbody></table>";
      html += "</div>";
      $(".tables-doctor").html(html);
    });
}

function indexPageLoop() {
  setInterval(function () {
    indexPageAjax();
  }, 60000);
}

let clickedShowAll = false;
$(document).on("click", ".show-more-button", function () {
  clickedShowAll = true;
  $(".show-more").css('display', 'table-row');
});