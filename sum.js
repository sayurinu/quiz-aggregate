//****************************//
// 合計得点集計スクリプト       //
// 必要シート: result1~5, sum  //
//****************************//

function main() {
  // 5シート分の解答を集計する
  var usermap = {};
  for (var i = 1; i <= 5; i++) {
    editUsermap_(i, usermap);
  }
    
  var result = convertToSheetData_(usermap);
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('sum');
  
  sheet.getRange(1, 1, result.length, 2).setValues(result);
  Logger.log(result);
}


/**
 * 読み込んだシートの得点を加算していく
 */
function editUsermap_(num, usermap) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // シートの取得
  var sheetName = 'result' + num;
  Logger.log(sheetName);
  var sheet = ss.getSheetByName('result' + num);
  
  // レコード数
  var recordNum = sheet.getLastRow();
  if (!recordNum) {
    return;
  }
  
  // 全データを配列で取得
  var records = sheet.getRange(1, 1, recordNum, 2).getValues();
  Logger.log(records);
  
  for (var i = 0; i < records.length; i++) {
    // 1件ごとの解答データ
    var userData = records[i];
    
    var userName = userData[0];
    var userPoint = userData[1];
    
    if (!userName) {
      continue;
    }
    
    if (!usermap[userName]) {
      usermap[userName] = 0;
    }

    usermap[userName] += userPoint;
  }
  
  Logger.log(usermap);
}


/**
 * シートに出力できる形式にコンバート
 */
function convertToSheetData_(usermap) {
  // 得点順でソート
  var sortedList = Object.keys(usermap).sort(function(a, b) {
    return usermap[b] - usermap[a];
  });
  
  return sortedList.map(function(userName) {
    return [userName, usermap[userName]];
  });
}