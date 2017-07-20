/**
 * 管理员首页JS
 * Created by dell on 2017/7/7.
 */
(function () {
    //  格式化日期
    Date.prototype.Format = function (fmt) {
        var o = {
            "y+": this.getFullYear(),
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S+": this.getMilliseconds()             //毫秒
        };
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                if (k === "y+") {
                    fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
                }
                else if (k === "S+") {
                    var lens = RegExp.$1.length;
                    lens = lens === 1 ? 3 : lens;
                    fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens));
                }
                else {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
        }
        return fmt;
    };

    var $newsTable = $("#news-table");

    var tableInit = {
        fieldsArray: [
            {
                field: '_id',
                title: '编号',
                visible: false
            }, {
                field: 'title',
                title: '标题'
            }, {
                field: 'state',
                title: '状态',
                align: 'center',
                formatter: function (value) {
                    var str;
                    switch (value) {
                        case 1:
                            str = '<span class="label label-primary">暂存</span>';
                            break;
                        case 2:
                            str = '<span class="label label-success">发布</span>';
                            break;
                        default:
                            str = '<span class="label label-info">未知</span>';
                    }
                    return str;
                },
                width: '100'
            }, {
                field: 'meta.updateAt',
                title: '最后更新',
                align: 'center',
                width: '200',
                formatter: function (value) {
                    return new Date(value).Format("yyyy-MM-dd hh:mm:ss");
                }
            }, {
                title: '操作',
                field: 'realName',
                align: 'center',
                width: '200',
                formatter: function (value, row) {
                    var pName;
                    var state;
                    if (row.state === 1) {
                        pName = "发布";
                        state = 2;
                    } else {
                        pName = "取消发布";
                        state = 1;
                    }
                    var p = '<a class="publish-link" data-id="' + row._id + '" data-state="' + state + '" href="#" title="' + pName + '" style="margin-right: 10px">' + pName + '</a>';
                    var e = '<a href="/news/update?id=' + row._id + '" title="修改" style="margin-right: 10px">修改</a>';
                    var d = '<a class="delete-link" data-id="' + row._id + '" href="#" title="删除" style="margin-right: 10px">删除</a>';
                    return p + e + d;
                }
            }
        ],

        clientInit: function () {
            $newsTable.bootstrapTable('destroy');
            $newsTable.bootstrapTable({
                url: '/news',
                method: 'GET',
                dataType: 'json',
                striped: true,
                pageList: [15, 45, 100],
                pageSize: 10,
                pagination: true,
                sidePagination: "server",
                toolbar: "#toolbar",
                showRefresh: true,
                /**
                 * 这是一个大坑！
                 * 设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
                 * 设置为limit可以获取limit, offset, search, sort, order
                 * */
                queryParamsType: "undefined",
                queryParams: function (params) {
                    return {
                        page: params.pageNumber,   //页码
                        size: params.pageSize  //页面大小
                    };
                },
                //这里我查看源码的，在ajax请求成功后，发放数据之前可以对返回的数据进行处理，返回什么部分的数据，比如我的就需要进行整改的！
                responseHandler: function (res) {
                    return {
                        total: res.total,
                        rows: res.data
                    };
                },
                uniqueId: '_id',
                columns: tableInit.fieldsArray

            })
        },

        eventInit: function () {
            //  删除
            $newsTable.on('click', '.delete-link', function () {
                var newsId = $(this).attr('data-id');
                var r = confirm('确认删除？');
                if (r) {
                    $.ajax({
                        url: "/news/" + newsId,
                        method: "DELETE"
                    }).done(function (data) {
                        if (data.success) {
                            alert('删除成功');
                            $newsTable.bootstrapTable('refresh');
                        } else {
                            alert('删除失败');
                        }
                    });
                }
            });
            //  发布
            $newsTable.on('click', '.publish-link', function () {
                var newsId = $(this).attr('data-id');
                var newsState = $(this).attr('data-state');
                var r = confirm('确认操作？');
                if (r) {
                    $.ajax({
                        url: "/news",
                        method: "PUT",
                        data: {
                            id: newsId,
                            state: newsState
                        }
                    }).done(function (data) {
                        if (data.success) {
                            $newsTable.bootstrapTable('refresh');
                        } else {
                            alert(data.msg);
                        }
                    });
                }
            })
        }
    };

    var init = function () {
        tableInit.clientInit();
        tableInit.eventInit();
    };

    init();
})();