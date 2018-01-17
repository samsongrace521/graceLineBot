var google = require('googleapis');
var googleAuth = require('google-auth-library');
var HashMap = require('hashmap');

console.log('hello~~~~~~~~~~~~~~~~~~~~1');
var timer_g;
var dataMap = new HashMap();
dataMap['1'] = '1';
dataMap['2'] = '2';
module.exports = _getData;
module.exports = _getGoogleFormData;

_getData: function() {
		console.log('hello~~~~~~~~~~~~~~~~~~~~this:' + this.dataMap);
		return this.dataMap;
	}

_getGoogleFormData: function() {
	clearTimeout(this.timer_g);
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
						this.dataMap[key] = value;
					}

				});
			});
			console.log('撈完google 表單資料' + this.dataMap.length);
		}).fail(function() {
			console.log('撈完google 表單資料 發生錯誤');
			debugger
		});
	});

	this.timer_g = setInterval(this._getGoogleFormData, 60 * 30); // 每半小時抓取一次新資料
}