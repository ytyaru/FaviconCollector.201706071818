$(function(){
    console.log('js-------------');
    $("#AppendUrl").click(function() {
        console.log('click-------------');
        var textData = JSON.stringify({"Urls": $("#Urls").val()});
        console.log(textData)
        $.ajax({
            type:'POST',
            url:'/AppendUrls',
            data:textData,
            contentType:'application/json',
            success:function(data) {
                console.log('result------------')
                var r = JSON.parse(data.ResultSet)
                console.log(r);
                if ('message' in r) {
                    $("#Result").text(r['message'] + $("#Result").text());
                    delete r['message']
                }
                if ('exception' in r) {
                    $("#Result").text(r['exception'] + $("#Result").text());
                    delete r['exception']
                }
                for (classname in r) {
                    a = $('a[href="'+ r[classname]['href'] +'"]');
                    // 既存なら更新する
                    if (a[0]) {
                        a.attr('title', r[classname]['title'])
                        a.children("img").attr('src', r[classname]['src'])
                        $("#Result").text("更新 " + r[classname]['href'] + "\n" + $("#Result").text());
                    }
                    // 無いなら新規追加する
                    else {
                        $('#Icons').append(
                            '<a href="'+r[classname]['href']+'" title="'+r[classname]['title']+'"><img class="base64-icon '+r[classname]+'" src="'+r[classname]['src']+'"></img></a>'
                        );
                        $("#Result").text("追加 " + r[classname]['href'] + "\n" + $("#Result").text());
                    }
                }
            }
        });
    });
});

