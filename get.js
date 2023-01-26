var name_to_data;
$(document).ready(function () {
    // Get value on button click
    $("#mybtn").click(function () {
        var input_str = $("#getinput").val();
        base_url = "https://yh-finance.p.rapidapi.com/auto-complete?q="
        base_url = base_url + input_str + "&region=US";

        const settings = {
            "async": true,
            "crossDomain": true,
            "url": base_url,
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": "a6d2b478femsh81f4f8c1d9e360bp10c78fjsn1564baa974ef",
                "X-RapidAPI-Host": "yh-finance.p.rapidapi.com"
            }
        };

        $
            .ajax(settings)
            .done(function (response) {
                console.log(response);
                name_to_data = response["quotes"][0]["symbol"];
                console.log(name_to_data);

                base_url_alpha = "https://alpha-vantage.p.rapidapi.com/query?function=TIME_SERIES_DAILY_ADJUSTED" +
                        "&symbol=";
                base_url_alpha = base_url_alpha + name_to_data + "&outputsize=compact&datatype=" +
                        "json";

                const settings_alpha = {
                    "async": true,
                    "crossDomain": true,
                    "url": base_url_alpha,
                    "method": "GET",
                    "headers": {
                        "X-RapidAPI-Key": "a6d2b478femsh81f4f8c1d9e360bp10c78fjsn1564baa974ef",
                        "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com"
                    }
                };

                $
                    .ajax(settings_alpha)
                    .done(function (response) {
                        console.log(response);
                        analyze(response);
                    });

                base_url_over = "https://alpha-vantage.p.rapidapi.com/query?function=OVERVIEW&symbol=";
                base_url_over = base_url_over + name_to_data + "&outputsize=compact&datatype=js" +
                        "on";

                const settings_over = {
                    "async": true,
                    "crossDomain": true,
                    "url": base_url_over,
                    "method": "GET",
                    "headers": {
                        "X-RapidAPI-Key": "a6d2b478femsh81f4f8c1d9e360bp10c78fjsn1564baa974ef",
                        "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com"
                    }
                };

                $
                    .ajax(settings_over)
                    .done(function (response) {
                        console.log(response);
                        analyze_over(response);
                    });

                base_url_news = "https://free-news.p.rapidapi.com/v1/search?q=";
                base_url_news = base_url_news + name_to_data + "&lang=en";

                const settings_news = {
                    "async": true,
                    "crossDomain": true,
                    "url": base_url_news,
                    "method": "GET",
                    "headers": {
                        "X-RapidAPI-Key": "a6d2b478femsh81f4f8c1d9e360bp10c78fjsn1564baa974ef",
                        "X-RapidAPI-Host": "free-news.p.rapidapi.com"
                    }
                };

                $
                    .ajax(settings_news)
                    .done(function (response) {
                        console.log(response);
                        analyze_news(response);

                    });

                $("#to_be_hidden").css("display", "block");
                document
                    .getElementById("companyName")
                    .scrollIntoView();

            });

    });
});

function analyze(data) {

    let symbolC = data["Meta Data"]["2. Symbol"];
    let date = data["Meta Data"]["3. Last Refreshed"];
    date = date.split(" ")
    date = date[0]
    let price = data["Time Series (Daily)"][date]["5. adjusted close"];
    $("#price").html('$' + parseFloat(price).toFixed(2));

    let items = data["Time Series (Daily)"];
    let dates = Object.keys(items);
    let len = dates.length;
    dates.sort();
    let priceData = [];
    for (let i = 0; i < len; i++) {
        let price = items[dates[i]]["5. adjusted close"];
        priceData.push(price);
    }

    console.log(priceData);
    let colorGraph = '#e63939';
    let colorUnder = '#e6393972';
    let last_element = parseFloat(priceData[99])
    let first_element = parseFloat(priceData[0])

    if (last_element > first_element) {
        colorGraph = '#39e673';
        colorUnder = '#39e67372';
    }

    $("#canvas").remove();
    $(".container_c").append('<canvas id="canvas" ></canvas>');

    var ctx = $('#canvas').html(myChart);
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: symbolC,
                    data: priceData,
                    fill: true,
                    backgroundColor: colorUnder,
                    borderColor: colorGraph,
                    borderWidth: 2
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
    myChart.resize();

}

function analyze_over(data2) {
    let companyName = data2["Name"]
    let overview = data2["Description"]
    let high = data2["52WeekHigh"]
    let low = data2["52WeekLow"]
    let move = data2["50DayMovingAverage"]
    console.log(overview)
    $("#companyName").html(companyName);
    $("#overview").html(overview);
    $("#high").html("52 Week High    : $" + high)
    $("#low").html("52 Week Low     : $" + low)
    $("#avg").html("Moving Average  : $" + move)
}

function analyze_news(data3) {
    let news = data3["articles"][0]["title"];
    let news1 = data3["articles"][1]["title"];
    let news2 = data3["articles"][2]["title"];

    let newsLink = data3["articles"][0]["link"]
    let newsLink1 = data3["articles"][1]["link"]
    let newsLink2 = data3["articles"][2]["link"]

    $("#header").html("Top Stories")
    $("#news_line_1").html(
        "<a href='" + newsLink + "'>" + news + "</a><br>"
    )
    $("#news_line_2").html(
        "<a href='" + newsLink1 + "'>" + news1 + "</a><br>"
    )
    $("#news_line_3").html(
        "<a href='" + newsLink2 + "'>" + news2 + "</a><br>"
    )
}
