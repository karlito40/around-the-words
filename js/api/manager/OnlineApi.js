'use strict';

(function(exports){

function OnlineApi(){};

OnlineApi.prototype = Object.create(Api.Api.prototype);
OnlineApi.prototype.constructor = OnlineApi;

OnlineApi.prototype._call = function(path, method, params, callback)
{

	if(!navigator.onLine) {
		if(callback) {
			callback({
				error: 1,
				message: "HTTP Request"
			});
		}
		return;
	}

	var obscData = {
		graph: path,
		method: method,
		params: params,
		d: Date.now()
	};

 	// var sa = '1f87c7027a89d1a84ebdddab67b6193b' + ATW.App.getPlayer().fbId;
 	var sa = '1f87c7027a89d1a84ebdddab67b6193b';
	obscData = btoa(JSON.stringify(obscData));

	obscData = CryptoJS.MD5(obscData + sa) + "." + obscData;

	var data = {
		// path: "api/handle",
		enc: obscData
	};


	if(typeof signed_request != "undefined") data.signed_request = signed_request;

	var dataTab = [];
	for(var key in data) dataTab.push(key+'='+data[key]);

	var postData = dataTab.join('&');
	var xhr = new XMLHttpRequest();
	var url = 'api.php';
	if(EXPORT_PLATFORM != 'facebook') {
		url = WWW_PROD + url
	}

	xhr.open('GET', url + '?'+postData, true);
	// xhr.open('POST', 'api.php', true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
	// xhr.setRequestHeader("Content-length", postData.length);
	xhr.setRequestHeader("Accept", "application/json, text/javascript");
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	// xhr.send(postData);

	try{
		xhr.send(null);
	} catch(e) {
		if(callback) {
			callback({
				error: 1,
				message: "HTTP Request"
			});
		}

	}
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4) {
			if(xhr.status == 200) {
				var response = xhr.responseText;
				// console.log('response', response);
				if(xhr.responseText[0] == '{') {
					response = JSON.parse(response);
				}

				if(response && response.maj) {
					IS_PATCHING = true;
					var patchScene = new PatchScene();
					patchScene.start();
				}

				if(callback) {
					callback(response);
				}

			} else if(callback) {
				callback({
					error: 1,
					message: "HTTP Request"
				});
			}


		}
	};

	return xhr;



	return $.ajax({
		type: "POST",
		dataType: "json",
		url: "api.php",
		data: data,
		success: function(response){
			if(response && response.maj) {
				IS_PATCHING = true;
				var patchScene = new PatchScene();
				patchScene.start();
			}

			if(callback) {
				callback(response);
			}
		},
		error : function(response) {
			if(callback) {
				callback({
					error: 1,
					message: "HTTP Request"
				});
			}
		}
	});
};

exports.OnlineApi = OnlineApi;

})(window.Api = window.Api || {});