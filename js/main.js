$(document).bind("mobileinit", function() {
     $.mobile.page.prototype.options.addBackBtn = true;
});

$(document).bind("pageinit", function() {

    $("div#main").bind("pageshow", function() {
        //ここに処理を記述
        //alert("Content List");
    });

    $("div#sample1").bind("pageshow", function() {
        // XXX DEBUG
        //alert("Sample1");
        //ユーザーの現在の位置情報を取得
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

        function successCallback(position) {
              var gl_text = "緯度：" + position.coords.latitude + "<br>";
                gl_text += "経度：" + position.coords.longitude + "<br>";
                gl_text += "高度：" + position.coords.altitude + "<br>";
                gl_text += "緯度・経度の誤差：" + position.coords.accuracy + "<br>";
                gl_text += "高度の誤差：" + position.coords.altitudeAccuracy + "<br>";
                gl_text += "方角：" + position.coords.heading + "<br>";
                gl_text += "速度：" + position.coords.speed + "<br>";
                document.getElementById("show_result").innerHTML = gl_text;

                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var myOptions = {
                    zoom: 15,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    title:"You are here!"
                });
        }

        /***** 位置情報が取得できない場合 *****/
        function errorCallback(error) {
          var err_msg = "";
          switch(error.code)
          {
            case 1:
              err_msg = "位置情報の利用が許可されていません";
              break;
            case 2:
              err_msg = "デバイスの位置が判定できません";
              break;
            case 3:
              err_msg = "タイムアウトしました";
              break;
          }
          document.getElementById("show_result").innerHTML = err_msg;
          //デバッグ用→　document.getElementById("show_result").innerHTML = error.message;
        }

    });

    $("div#sample2").bind("pageshow", function() {
        // XXX DEBUG
        var myLatLng = new google.maps.LatLng(0, -180);
        var mapOptions = {
            zoom: 3,
            center: myLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        /* 地図インスタンス生成 */
        var map = new google.maps.Map(document.getElementById('foot_mark'), mapOptions);
        /* 地理座標 */
        var latlng_1 = new google.maps.LatLng(35.763982,140.384642); /* Narita */
        var latlng_2 = new google.maps.LatLng(10.310018,123.979627); /* Koror */
        var latlng_3 = new google.maps.LatLng(7.367359,134.538795); /* Cebu */

        var latlngs = [
            latlng_1,
            latlng_2,
            latlng_3
        ];
        var polyline = new goolge.maps.Polyline(latlngs,  "#008800",  3, 0.5);
        map.addOverlay(polyline);
//        polyline.setMap(map);

        /* コントロール追加 */
        map.addControl(new google.maps.LargeMapControl()); /* 大きなコントロール */
        map.addControl(new google.maps.MapTypeControl()); /* 地図タイプ切替コントロール */

        /* マーカー追加 */
        map.addOverlay(new google.maps.Marker(latlng_1));
        map.addOverlay(new google.maps.Marker(latlng_2));
        map.addOverlay(new google.maps.Marker(latlng_3));

    });
});