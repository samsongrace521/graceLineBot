var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: '1553329312',
  channelSecret: '82986980f63b2f1fad7af428ac0a0f70',
  channelAccessToken: 'ZHcGSnnInWxVJkwWjz2TEQ4Rmu7GFIZ82nqK/nnPckbR1zw9z0anx90lCndweFGfOalYMXdtp4DW7CUJrtZ3HpSTwf6osEKNCrBdY2muaHYUR8Dq8skykzIAQbmea2pMPRXC7eTa6vIjJoDcP3nd8AdB04t89/1O/w1cDnyilFU='
});

//這一段的程式是專門處理當有人傳送文字訊息給LineBot時，我們的處理回應
bot.on('message', function(event) {
  if (event.message.type = 'text') {
     var msg = getReplyMsg(event.message.text);
   // var msg = '你好~~~';
  //收到文字訊息時，直接把收到的訊息傳回去

    event.reply(msg).then(function(data) {
      // 傳送訊息成功時，可在此寫程式碼 
      console.log(msg);
    }).catch(function(error) {
      // 傳送訊息失敗時，可在此寫程式碼 
      console.log('錯誤產生，錯誤碼：'+error);
    });
  }
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log('目前的port是', port);
});

function getReplyMsg(request){
    var response = '';
    if(request == 'test'){
        response = '測試';
    }else{
      response = request;
    }
    return response+'<<你好';

}