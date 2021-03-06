//*********************************//
// 第5問（記述式）専用集計スクリプト    //
//*********************************//
function myFunction() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 各シートの取得
  // var sheet1 = ss.getActiveSheet();
  var sheet1 = ss.getSheetByName('sample');
  var sheet2 = ss.getSheetByName('result');
  
  // レコード数
  var recordNum = sheet1.getLastRow();
  
  // 全データを配列で取得
  var records = sheet1.getRange(2, 1, recordNum, 4).getValues();
  Logger.log(records);
  
  var usermap = {};
  for (var i = 0; i < records.length; i++) {
    // 1件ごとの解答データ
    var userData = records[i];
    
    var userTime = userData[0];
    var userName = userData[1];
    var userAnswer = userData[2];
    var recordPoint = userData[3];
    
    if (!userName) {
      continue;
    }
    
    if (!usermap[userName]) {
      usermap[userName] = {
        time: 0,
        point: 0,
      };
    }

    // 複数解答しているユーザーの場合、古い方の解答は採用しない
    if (userTime < usermap[userName].time) {
      continue;
    }
      
    usermap[userName].time = userTime;
    usermap[userName].point = recordPoint;
  }
  
  Logger.log(usermap);
  
  var result = convertToSheetData_(usermap);
  sheet2.getRange(1, 1, result.length, 2).setValues(result);
  Logger.log(result);
}


// シートに出力できる形式にコンバート
function convertToSheetData_(usermap) {
  return Object.keys(usermap).filter(function(userName) {
    // ポイントがあるデータのみにフィルタリング
    return usermap[userName].point > 0;
  }).map(function(userName) {
    return [userName, usermap[userName].point];
  });
}
