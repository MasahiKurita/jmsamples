$(document).bind("pageinit", function() {

	$("div#main").on("pageshow", function() {
    	//ここに処理を記述
    	//alert("Content List");
	});

	$("div#sample1").on("pageshow", function() {
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

});