let app = SpreadsheetApp
let sheet = app.getActiveSheet();
let sheet_name = sheet.getSheetName();

let table_name = sheet.getRange("B6").getValue();
let line_bgn = 14;
let last_row = sheet.getLastRow();


function main(){

  class Column{
    constructor(record) {
      [this.id,this.l_name,this.p_name,this.pk,this.ai,this.type,this.length,this.null,this.def,this.comment] = record;
      Column.prototype.createColumn = function(){
        let p_key = '';
        let sentence = this.p_name + ' ' + this.type;
        if (notEmpty(this.length)) {
          sentence = sentence.concat('(' + this.length + ')');
        }
        if (this.null === 'N') {
          sentence = sentence.concat(' NOT NULL');
        }
        if (this.ai === 'Y') {
          sentence = sentence.concat(' AUTO_INCREMENT');
        }
        switch (typeof(this.def)) {
          case "number":
            sentence = sentence.concat(' DEFAULT ' + this.def);
            break;
          case "string":
            if (this.def == "CURRENT_TIMESTAMP" || this.def == "NULL") {
              sentence = sentence.concat(' DEFAULT ' + this.def);
            } else if (this.def) {
              sentence = sentence.concat(' DEFAULT \'' + this.def + '\'');
            }
            break;
          default :
            break;
        }
        if (notEmpty(this.comment)) {
          sentence = sentence.concat(' COMMENT \'' + this.comment + '\'');
        }
        if (this.pk === 'Y') {
          if (this.null !== 'N') {
            return Browser.msgBox("プライマリーキーがNOT NULLではありません。");
          } else {
            if (!p_key.isBlank) {
              p_key = this.l_name;
              sentence = sentence.concat(' PRIMARY KEY')
            } else {
              // 複合プライマリキーはひとまず使わない想定
              return Browser.msgBox("プライマリーキーが２つ以上あります。１つにしてください。");
            }
          }
        }
        return sentence;
      }
    }
    
  }

  let values = sheet.getRange(line_bgn,1,last_row - line_bgn + 1,10).getValues();
  let arr = [];
  for (i = 0; i <= last_row - line_bgn; i++) {
    let c = new Column(values[i]);
    let column = c.createColumn();
    if (i != last_row - line_bgn) {
    column = column.concat(',');
    }
    arr[i] = column
  }
  fs = 'CREATE TABLE `' + table_name + '` (';
  ls = ') ENGINE= InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET=utf8'
  arr.unshift(fs);
  arr.push(ls);
  let contents = arr.join('\n');

  let new_sheet = app.getActiveSpreadsheet().insertSheet();
  new_sheet.setName(sheet_name + "_DDL");
  new_sheet.getRange(1,1).setValue(contents);
}

function notEmpty(v) {
    return Boolean(
        typeof v == 'string' ?
            v && v != 0 :
        typeof v == 'object' ?
            v && Object.keys(v).length :
            v
    );
}


function writeCreateTable(t_name, columns){
  
  
}
