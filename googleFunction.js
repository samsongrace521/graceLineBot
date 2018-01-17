var google = require('googleapis');
var googleAuth = require('google-auth-library');
var HashMap = require('hashmap');

var timer_g;
var dataMap = new HashMap();

//底下輸入client_secret.json檔案的內容
var myClientSecret={"installed":{"client_id":"726747823242-fuabmvh9cnjb1jtvb4ukaomojlsm5mbi.apps.googleusercontent.com","project_id":"fifth-trainer-192301","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"oAhzpqJ23cF66OXnQ5yQbK6o","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}};

var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(myClientSecret.installed.client_id,myClientSecret.installed.client_secret, myClientSecret.installed.redirect_uris[0]);

//底下輸入sheetsapi.json檔案的內容
oauth2Client.credentials ={"access_token":"ya29.GltEBdiqLCnzoilppRKkBwrDjWOk1g-WQE7zSAnM6LW4WtV4M1AwjeyKRW0-yhJf_aCIaWYOFM24187aVdk6MVSJXEto6rdJCtQrdJqd-bvWrEqsZi1YTsHbiPZM","refresh_token":"1/3lHGhmlFr8oYXR8pjTvH4RBNhCYUCwG47ReSXC9nx80","token_type":"Bearer","expiry_date":1516069699404};

//試算表的ID，引號不能刪掉
var mySheetId='1Zr1aX_67ANZz-9k1wocTe-d40hYjWYTKT7lti2ndLmI';


class googleFunction {
	_getData() {
		return dataMap;
	};
	_getGoogleFormData() {
		clearTimeout(timer_g);
		console.log('開始撈google 表單資料');
		require('jsdom/lib/old-api').env("", function(err, window) {
			if (err) {
				console.error(err);
				return;
			}

			var $ = require("jquery")(window);
			$.ajax({
				url: "https://spreadsheets.google.com/feeds/list/1Zr1aX_67ANZz-9k1wocTe-d40hYjWYTKT7lti2ndLmI/od6/public/values?alt=json",
				type: 'GET'
			}).done(function(result) {
				console.log('撈完google 表單資料 開始裝map');
				$.each(result, function(i) {
					var tmp = result['feed']['entry'];
					tmp.forEach(function(e, i) {
						var key = e.gsx$key.$t;
						var value = e.gsx$value.$t;
						if (key != null && key != '') {
							dataMap[key] = value;
						}

					});
				});
				console.log('撈完google 表單資料' + dataMap);
			}).fail(function() {
				console.log('撈完google 表單資料 發生錯誤');
				debugger
			});
		});

		timer_g = setInterval(new googleFunction()._getGoogleFormData, 60 * 1000); // 每半小時抓取一次新資料
	};

	//這是將取得的資料儲存進試算表的函式
	appendMyRow(userId) {
		var request = {
			auth: oauth2Client,
			spreadsheetId: mySheetId,
			range: encodeURI('工作表1'),
			insertDataOption: 'INSERT_ROWS',
			valueInputOption: 'RAW',
			resource: {
				"values": [
					'123'
				]
			}
		};
		var sheets = google.sheets('v4');
		sheets.spreadsheets.values.append(request, function(err, response) {
			if (err) {
				console.log('The API returned an error: ' + err);
				return;
			}
		});
	}
}



module.exports = googleFunction;