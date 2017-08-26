$(function(){
    console.log('js-------------');
    $("#AppendUrl").click(function() {
        console.log('click-------------');
        var urls_text  = $("#Urls").val().replace(/\r\n|\r/g, "\n");
        var urls = urls_text.split('\n');
        $.when(...CreateAjaxs(urls))
            .done(function(data) {$("#Result").text("URL追加が完了しました。" + "\n" + $("#Result").text());})
            .fail(function () {})
        ;
    });
    
    function CreateAjaxs(urls) {
        ajaxs = [];
        for (var i = 0; i < urls.length; i++) {
            if (0 == urls[i].trim().length) { continue; }
            ajaxs.push($.ajax({
                    type: 'POST',
                    url: '/AppendUrl',
                    data: JSON.stringify({"Url": urls[i]}),
                    contentType: 'application/json'
                })
                .done(function(data) {return DeferredAppendUrl(data);})
                .fail(function() {})
            );
        }
        return ajaxs;
    }
    function DeferredAppendUrl (data) {
        console.log('result------------')
        var dfd = $.Deferred();
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
        dfd.resolve();
        return dfd.promise();
    }
});

