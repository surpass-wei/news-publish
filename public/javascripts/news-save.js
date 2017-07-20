/**
 * 保存新闻
 * Created by dell on 2017/7/10.
 */
(function () {
    var $newsContent = $('#news-content');
    $newsContent.summernote({
        lang: 'zh-CN',
        toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline']],
            ['fontSize', ['fontsize']],
            ['para', ['ul', 'ol']],
            ['insert', ['picture', 'link', 'table', 'hr']]
        ],
        height: 500,
        placeholder: '输入内容...',
        callbacks: {
            onImageUpload: function (files) {
                sendFile(files[0]); //  将内容中的图片上传到后台
            }
        }
    });

    function sendFile(file) {
        var data = new FormData();
        data.append("thePic", file);
        $.ajax({
            data: data,
            type: "POST",
            url: "/news/upload-pic",
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                $('#news-content').summernote('insertImage', data.path, function ($image) {
                    $image.css('width', $image.width());
                    $image.css('height', $image.height());
                });
            }
        });
    }

    $("#news-save-btn").on('click', function () {
        var data = new FormData();

        var id = $("#news-id").attr("news-id");
        var pic = $("#news-pic")[0].files[0];
        var title = $("#news-title").val();
        var digest = $("#news-digest").val();
        var content = $('#news-content').summernote('code');

        if (id != null) {
            data.append('id', id);
        } else {
            if (pic == null) {
                alert("请上传描述图片");
                return;
            }
        }
        data.append('pic', pic);
        data.append('title', title);
        data.append('digest', digest);
        data.append('content', content);

        var contentIsEmpty = $newsContent.summernote('isEmpty');
        if (title == null || title.replace(/(^\s*)|(\s*$)/g, "").length === 0 || digest == null || digest.replace(/(^\s*)|(\s*$)/g, "").length === 0 || contentIsEmpty) {
            alert("请检查内容是否完整");
            return;
        }
        $.ajax({
            url: "/news",
            type: "POST",
            data: data,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.success) {
                    alert("保存成功");
                    window.location.href = "/";
                } else {
                    alert("保存失败");
                }
            }
        });
    })

    if ($('#news-id').attr('news-id') != null) {
        var contentCode = $newsContent.attr('code');
        $newsContent.summernote('code', contentCode);
    }
})();
