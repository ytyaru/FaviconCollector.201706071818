$(function(){
    console.log('js-------------');
    console.log($('#Icons').children());
    now_cursor = $('#Icons').children()[0];
    cursor_index = 0;
    if (0 < $('#Icons').children().length) { $('#Icons').children()[cursor_index].focus(); }
    console.log(now_cursor);
    console.log('width = ' + $('#Icons').width());
    console.log('height = ' + $('#Icons').height());
    // 1行あたりのファビコン表示数
    function GetOneLineFaviconNum() {
        if (0 == $('#Icons').children().length) { return 0; }
        return parseInt($('#Icons').width() / $('#Icons a:first-child').width());
    }
    // 全部で何行ファビコンがあるか
    function GetAllLineNum() {
        line_num = GetOneLineFaviconNum();
        if (0 >= line_num) { return 0; }
        return parseInt($('#Icons').children().length / GetOneLineFaviconNum()) + 1
    }
    // 最終行の1個目のインデックスを取得する
    function GetLastLineFirstIndex() {
        return (GetAllLineNum() - 1) * GetOneLineFaviconNum();
    }
    $('html').keydown(function(e){
        switch(e.which) {
            case 39: // →
                if (cursor_index == $('#Icons').children().length - 1) { cursor_index = 0; } else { cursor_index++; }
                console.log(cursor_index);
                console.log($('#Icons').children()[cursor_index].focus());
                break;
            case 37: // ←
                if (cursor_index == 0) { cursor_index = $('#Icons').children().length - 1; } else { cursor_index--; }
                console.log(cursor_index);
                console.log($('#Icons').children()[cursor_index].focus());
                break;
            case 38: // ↑
                line_num = GetOneLineFaviconNum();
                // すでに先頭行の場合、最終行に移動する
                if (cursor_index - line_num < 0) {
                    // 最終行に同一列がない場合、末尾列に移動する
                    if ((GetLastLineFirstIndex() + cursor_index) > $('#Icons').children().length) {
                        cursor_index = $('#Icons').children().length - 1;
                    } else {
                        cursor_index = GetLastLineFirstIndex() + cursor_index;
                    }
                } else {
                    cursor_index -= line_num;
                }
                console.log(cursor_index);
                console.log($('#Icons').children()[cursor_index].focus());
                break;
            case 40: // ↓
                line_num = GetOneLineFaviconNum();
                // すでに最終行の場合、先頭行に移動する
                if (cursor_index + line_num > $('#Icons').children().length - 1) {
                    cursor_index = cursor_index - GetLastLineFirstIndex();
                    console.log(cursor_index);
                    if (0 > cursor_index) {cursor_index = $('#Icons').children().length - 1;}
                } else { cursor_index += line_num; }
                console.log(cursor_index);
                console.log($('#Icons').children()[cursor_index].focus());
                break;
            default:
                console.log(e.which)
                break;
        }
    });
});

