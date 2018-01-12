var linebot = require('linebot');
var express = require('express');
// const emojiSearch = require('demo-emoji-search');

const jQuery = require('jquery')
const jsdom = require("jsdom");
// var jsdom = require("node-jsdom");
// const { JSDOM } = jsdom;

var bot = linebot({
  channelId: '1553329312',
  channelSecret: '82986980f63b2f1fad7af428ac0a0f70',
  channelAccessToken: 'ZHcGSnnInWxVJkwWjz2TEQ4Rmu7GFIZ82nqK/nnPckbR1zw9z0anx90lCndweFGfOalYMXdtp4DW7CUJrtZ3HpSTwf6osEKNCrBdY2muaHYUR8Dq8skykzIAQbmea2pMPRXC7eTa6vIjJoDcP3nd8AdB04t89/1O/w1cDnyilFU='
});

var timer;
var pm = [];
_getJSON();

// 這一段的程式是專門處理當有人傳送文字訊息給LineBot時，我們的處理回應
bot.on('message', function(event) {
   console.log('開始了!!!');
  if (event.message.type = 'text') {
    var msg ='';
     try{
         msg = _getReplyMsg(event.message.text);
     }catch(e){
         msg = e.message;
     }

   // var msg = '你好~~~';
  // 收到文字訊息時，直接把收到的訊息傳回去
	if(msg != null){
		 event.reply(msg).then(function(data) {
		      // 傳送訊息成功時，可在此寫程式碼
		      console.log(msg);
		    }).catch(function(error) {
		      // 傳送訊息失敗時，可在此寫程式碼
		      console.log('錯誤產生，錯誤碼：'+error);
		    });
	}
   
  }
});
const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log('目前的port是', port);
});


function _getReplyMsg(msg){
    var replyMsg = '';
     try{  
        if (msg.toUpperCase().indexOf('HI') != -1 || msg.indexOf('你好') != -1 || msg.indexOf('妳好') != -1) {
        	replyMsg = 'hello!';
        }else if (msg.toUpperCase().indexOf('HELP') != -1) {
            replyMsg = _getHelp();
        }else if (msg.toUpperCase().indexOf('PM2.5') != -1) {
        	if(pm!=null && pm.length > 0){
        		if(msg.indexOf('區域') != -1){
        			replyMsg='你可以查詢的區域有: ';
        			pm.forEach(function(e, i) {                       
                        replyMsg += e[0]+' ';
                    });
        		}else{
        			   pm.forEach(function(e, i) {
                           if (msg.indexOf(e[0]) != -1) {
                             replyMsg = e[0] + '的 PM2.5 數值為 ' + e[1];
                           }
                         });
        		}
        	 
        	    
        	}else{
        		  replyMsg = '還沒撈到資料';
        	}
        

            if (replyMsg == '') {
              replyMsg = '請輸入正確的地點';
            }
        }else if(msg.indexOf('經緯度') != -1){
          try{
              var gisdata =  msg.replace('經緯度','').split(',');
              console.log('>>>>'+gisdata[0].replace('經緯度','')+','+gisdata[1]);
              var wgsxdata = twd97_to_latlng(Number(gisdata[0]), Number(gisdata[1]));
              replyMsg = wgsxdata.lat+','+wgsxdata.lng
          }catch(e){H
               replyMsg = e.message+'..'+e.name;
          }
          

        }

// if (replyMsg == '') {
// replyMsg = '不知道「'+msg+'」是什麼意思 :p';
// }
 }catch(e){
             replyMsg = e.message+'..'+e.name;
        }


    return  replyMsg;

}

function _getJSON() {
  clearTimeout(timer);
  console.log('開始撈pm2.5公開資料');
  require('jsdom/lib/old-api').env("", function(err, window) {
	    if (err) {
	        console.error(err);
	        return;
	    }
	 
	    var $ = require("jquery")(window);
	    $.ajax({			
			url : "http://opendata2.epa.gov.tw/AQX.json",
			type: 'GET'
		}).done(function(result) {
			 pm = [];
			$.each(result,function(i){
				  pm[i] = [];
			      pm[i][0] = this.SiteName;
			      pm[i][1] = this['PM2.5'] * 1;
			      pm[i][2] = this.PM10 * 1;
			});
			  console.log('撈完pm2.5公開資料'+pm.length);
		}).fail(function() {
			debugger
		});  
	});
 
  timer = setInterval(_getJSON, 60*30); // 每半小時抓取一次新資料
}

function _getHelp(){
  var replyMsg = '1. 輸入PM2.5 [地點]可查詢當地PM2.5  2. 輸入經緯度 [GISX],[GISY]我們會幫你轉換成經度,緯度';



  return replyMsg;
}

function twd97_to_latlng(x, y) {
  var pow = Math.pow, M_PI = Math.PI;
  var sin = Math.sin, cos = Math.cos, tan = Math.tan;
  var a = 6378137.0, b = 6356752.314245;
  var lng0 = 121 * M_PI / 180, k0 = 0.9999, dx = 250000, dy = 0;
  var e = pow((1 - pow(b, 2) / pow(a, 2)), 0.5);
 
  x -= dx;
  y -= dy;

  var M = y / k0;

  var mu = M / (a * (1.0 - pow(e, 2) / 4.0 - 3 * pow(e, 4) / 64.0 - 5 * pow(e, 6) / 256.0));
  var e1 = (1.0 - pow((1.0 - pow(e, 2)), 0.5)) / (1.0 + pow((1.0 - pow(e, 2)), 0.5));

  var J1 = (3 * e1 / 2 - 27 * pow(e1, 3) / 32.0);
  var J2 = (21 * pow(e1, 2) / 16 - 55 * pow(e1, 4) / 32.0);
  var J3 = (151 * pow(e1, 3) / 96.0);
  var J4 = (1097 * pow(e1, 4) / 512.0);

  var fp = mu + J1 * sin(2 * mu) + J2 * sin(4 * mu) + J3 * sin(6 * mu) + J4 * sin(8 * mu);

  var e2 = pow((e * a / b), 2);
  var C1 = pow(e2 * cos(fp), 2);
  var T1 = pow(tan(fp), 2);
  var R1 = a * (1 - pow(e, 2)) / pow((1 - pow(e, 2) * pow(sin(fp), 2)), (3.0 / 2.0));
  var N1 = a / pow((1 - pow(e, 2) * pow(sin(fp), 2)), 0.5);

  var D = x / (N1 * k0);

  var Q1 = N1 * tan(fp) / R1;
  var Q2 = (pow(D, 2) / 2.0);
  var Q3 = (5 + 3 * T1 + 10 * C1 - 4 * pow(C1, 2) - 9 * e2) * pow(D, 4) / 24.0;
  var Q4 = (61 + 90 * T1 + 298 * C1 + 45 * pow(T1, 2) - 3 * pow(C1, 2) - 252 * e2) * pow(D, 6) / 720.0;
  var lat = fp - Q1 * (Q2 - Q3 + Q4);
  console.log('計算中3:fp:'+fp+',Q1:'+Q1+',Q2:'+Q2+',Q3:'+Q3+',Q4'+Q4+',lat:'+lat);
  var Q5 = D;
  var Q6 = (1 + 2 * T1 + C1) * pow(D, 3) / 6;
  var Q7 = (5 - 2 * C1 + 28 * T1 - 3 * pow(C1, 2) + 8 * e2 + 24 * pow(T1, 2)) * pow(D, 5) / 120.0;
  var lng = lng0 + (Q5 - Q6 + Q7) / cos(fp);
  console.log('計算中4:Q5:'+Q5+',Q6:'+Q6+',lng:'+lng);
  lat = (lat * 180) / M_PI;
  lng = (lng * 180) / M_PI;
  console.log('計算中5:lat:'+lat+',lng:'+lng+',M_PI:'+M_PI);
  
  console.log('計算完畢:'+lat+','+lng);
  return {
    lat: lat.toFixed(6),
    lng: lng.toFixed(6)
  };
}

var Unicode = {
	stringify: function (str) {
        var res = [],
	    len = str.length;
        for (var i = 0; i < len; ++i) {
	       res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
	    }

	    return str ? "\\u" + res.join("\\u") : "";
	},
    parse: function (str) {

	        str = str.replace(/\\/g, "%");
	        return unescape(str);
	}
};
