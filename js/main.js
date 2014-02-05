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
        try {

            // XXX DEBUG
            var mapOptions = {
                zoom: 3,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            /* 地図インスタンス生成 */
            var map = new google.maps.Map(document.getElementById('foot_mark'), mapOptions);
            /* 地理座標 */
            var latlng_1 = new google.maps.LatLng(35.763982,140.384642); /* Narita */
            var latlng_2 = new google.maps.LatLng(7.367359,134.538795); /* Koror */
            var latlng_3 = new google.maps.LatLng(10.310018,123.979627); /* Cebu */

            var bounds = new google.maps.LatLngBounds();

            var latlngs = [
                latlng_1,
                latlng_2,
                latlng_3
            ];
            var marker1 = new google.maps.Marker({
                position: latlng_1,
                map: map,
                title:"Narita"
            });
            bounds.extend(latlng_1);

            var marker2 = new google.maps.Marker({
                position: latlng_2,
                map: map,
                title:"Koror"
            });
            bounds.extend(latlng_2);

            var marker3 = new google.maps.Marker({
                position: latlng_3,
                map: map,
                title:"Cebu"
            });
            bounds.extend(latlng_3);

            map.fitBounds(bounds);

            var footmark = new google.maps.Polyline({
                path: latlngs,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
//        map.addOverlay(polyline);
            footmark.setMap(map);

        } catch(e) {
        	alert(e);
        }

        console.log("success!");

        /* コントロール追加 */
//        map.addControl(new google.maps.LargeMapControl()); /* 大きなコントロール */
//        map.addControl(new google.maps.MapTypeControl()); /* 地図タイプ切替コントロール */

        /* マーカー追加 */
//        map.addOverlay(new google.maps.Marker(latlng_1));
//        map.addOverlay(new google.maps.Marker(latlng_2));
//        map.addOverlay(new google.maps.Marker(latlng_3));

    });

    $("div#sample3").bind("pageshow", function() {

        window.fbAsyncInit = function() {
            try {
                FB.init({
                    appId      : "698356506895047", // App ID
                    status     : true, // check login status
                    cookie     : true, // enable cookies to allow the server to access the session
                    xfbml      : true  // parse XFBML
                });

//              FB.Event.subscribe('auth.authResponseChange', function(response) {
                FB.getLoginStatus(function(response){
                    if (response.status === 'connected') {
                        console.log("userID: " + response.authResponse.userID);
                        FB.api('/' + response.authResponse.userID + '/permissions', 'get', {"access_token": response.authResponse.accessToken}, function(response2) {
                            console.log(response2);
                        });
                        testAPI();
                    } else if (response.status === 'not_authorized') {
                        FB.login(function(response){
                            console.log(response);
                        }, {scope: "user_status,user_checkins"});
                    } else {
                        FB.login(function(response){
                            console.log(response);
                        }, {scope: "user_status,user_checkins"});
                    }
                });

                $("button#fblogout").on({
                    click: FB.logout()
                });

            } catch(e) {
                console.log(e);
            }

        };

        (function(d){
            try {
                var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
                if (d.getElementById(id)) {return;}
                    js = d.createElement('script'); js.id = id; js.async = true;
                    js.src = "//connect.facebook.net/en_US/all.js";
                    ref.parentNode.insertBefore(js, ref);
            } catch (e) {
                console().log(e);
            }
        }(document));

        function testAPI() {
              console.log('Welcome!  Fetching your information.... ');
              try {


                  var mapOptions = {
                          zoom: 3,
                          mapTypeId: google.maps.MapTypeId.ROADMAP
                      };

                      /* 地図インスタンス生成 */
                  var map = new google.maps.Map(document.getElementById('foot_mark2'), mapOptions);


                  var latlngs = [];
                  var bounds = new google.maps.LatLngBounds();


                  FB.api('/me?fields=checkins', function(response) {
                      console.log(response);
                      var checkinlist = $("ul#checkin-list");
                      for(i=0; i<response.checkins.data.length; i++){
                          var place = response.checkins.data[i].place;
                          console.log('you checked in, ' + place.name + '.');
                          checkinlist.append("<li>" + place.name + "(" + place.location.latitude + "," + place.location.longitude + ")</li>");

                          var latlng = new google.maps.LatLng(place.location.latitude, place.location.longitude);
                          latlngs.push(latlng);
                          bounds.extend(latlng);
                          console.log(latlng[i]);

                          var marker = new google.maps.Marker({
                              position: latlng,
                              map: map,
                              title:place.name
                          });

                      }
                  });
                  console.log(latlngs);

                  map.fitBounds(bounds);
                  var points = [];
                  points.push(latlngs[0]);
                  points.push(latlngs[1]);
                  console.log(points);
                  var footmark = new google.maps.Polyline({
                      path: points,
                      strokeColor: "#FF0000",
                      strokeOpacity: 1.0,
                      strokeWeight: 2
                  });
                  footmark.setMap(map);

//                  for (i=0; i<latlngs.length-1; i++) {
//                      var footmark = new google.maps.Polyline({
//                          path: [latlngs[i], latlngs[i+1]],
//                          strokeColor: "#FF0000",
//                          strokeOpacity: 1.0,
//                          strokeWeight: 2
//                      });
//                      footmark.setMap(map);
//                  }


              } catch (e) {
                  console.log(e);
              }
        };


    });

});