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

    var uid;
    var currentInfoWindow;
    $("div#sample3").bind("pageshow", function() {


        window.fbAsyncInit = function() {
            try {
                FB.init({
                    appId      : "698356506895047", // App ID
                    status     : true, // check login status
                    cookie     : true, // enable cookies to allow the server to access the session
                    xfbml      : true  // parse XFBML
                });

              FB.Event.subscribe('auth.statusChange', function(response) {
                    if (response.status === 'connected') {
                        $("div#foot_mark2").show();
                        $("button#logout-button").show();
                        console.log("userID: " + response.authResponse.userID);
                        FB.api('/' + response.authResponse.userID + '/permissions', 'get', {"access_token": response.authResponse.accessToken}, function(response2) {
                        });
                        uid = response.authResponse.userID;
                        var since = $("input#sincedate").val();
                        var until = $("input#untildate").val();
                        showCheckins(uid, since, until);
                        //showCheckins(response.authResponse.userID, "2013/01/01", "2013/12/31");
                   } else if (response.status === 'not_authorized') {
                        FB.login(function(response){
                        }, {scope: "user_status,user_checkins"});
                    } else {
                        FB.login(function(response){
                        }, {scope: "user_status,user_checkins"});
                    }
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

        function attachInfoWindow(map, marker, infowindow) {
            google.maps.event.addListener(marker, 'click', function() {
                if (currentInfoWindow != null) {
                    currentInfoWindow.close();
                }
                infowindow.open(map,marker);
                currentInfoWindow = infowindow;
            });
        }

        function showCheckins(uid, since, until) {
              console.log('Welcome!  Fetching your information.... ');
              try {

                  url = '/' + uid + '/checkins';
                  if (since != "" && until != "") {
                      url = url + '?since=' + Math.round((new Date(since)).getTime() / 1000) + '&until=' + Math.round((new Date(until)).getTime() / 1000);
                  } else if (since != "") {
                      url = url + '?since=' + Math.round((new Date(since)).getTime() / 1000);
                  } else if (until != "") {
                      url = url + '?until=' + Math.round((new Date(until)).getTime() / 1000);
                  }
                  console.log("url: " + url);
                  FB.api(url, function(response) {

                      var latlngs = [];
                      var mapOptions = {
                              zoom: 3,
                              mapTypeId: google.maps.MapTypeId.ROADMAP
                          };
                      var map = new google.maps.Map(document.getElementById('foot_mark2'), mapOptions);
                      var bounds = new google.maps.LatLngBounds();

                      var checkinlist = $("ul#checkin-list");
                      for(i=0; i<response.data.length; i++){
                          var data = response.data[i];
                          var place = data.place;
                          var created_time = new Date(data.created_time);
                          var datestr = created_time.getFullYear() + "/" + ("0"+(created_time.getMonth()+1)).slice(-2) + "/" + created_time.getDate() + " " + created_time.getHours() + ":" + created_time.getMinuts() + ":" + created_time.getSeconds();
                          checkinlist.append("<li>" + datestr + " に、" + place.name + "にチェックインしました。</li>");

                          var latlng = new google.maps.LatLng(place.location.latitude, place.location.longitude);
                          bounds.extend(latlng);
                          latlngs.push(latlng);

                          var marker = new google.maps.Marker({
                              position: latlng,
                              map: map,
                              title:place.name
                          });

                          var link = "http://www.facebook.com/" + data.id;
                          var content = "Check-In: " + place.name + "<br />"
                                      + "Date: " + datestr + "<br />"
                                      + "Message: " + data.message + "<br />"
                                         + "<a href=\"" + link + "\">" + link + "</a>";
                          var infowindow = new google.maps.InfoWindow({
                              content: content
                          });

                          attachInfoWindow(map, marker, infowindow);
                      }

                      map.fitBounds(bounds);

                      var footmark = new google.maps.Polyline({
                          path: latlngs,
                          strokeColor: "#FF0000",
                          strokeOpacity: 1.0,
                          strokeWeight: 2
                      });
                      footmark.setMap(map);
                  });

              } catch (e) {
                  console.log(e);
              }
        };

        $("button#logout-button").bind("click", function(){
            FB.logout(function(){
                $.mobile.changePage("sample3.html", {
                    allowSamePageTransition : true
                });
            });
        });

        $("button#filter-button").bind("click", function() {
            $("ul#checkin-list").empty();
            $("div#foot_mark2").empty();
            var since = $("input#sincedate").val();
            var until = $("input#untildate").val();
            showCheckins(uid, since, until);
        });

        //$("input#sincedate").datepicker();

    });

});