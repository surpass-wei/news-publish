/**
 * Controller + Service
 * Created by surpass.wei@gmail.com on 2017/7/14.
 */
var path = require('path');
var fs = require('fs');
var uuid = require('uuid/v1');

var News = require('../models/News');

var newsController = {};

//  page:添加新闻
newsController.addNewsPage = function (req, res) {
    res.render('news-save', {title: '添加新闻案例', news: undefined});
};

//  page:更新新闻
newsController.updateNewsPage = function (req, res) {
    var id = req.query.id;
    News.findById(id, function (err, news) {
        if (err) {
            res.json(err);
        } else {
            res.render('news-save', {
                title: '更新新闻案例',
                news: news
            });
        }
    });
};

//  api:分页获取所有新闻
newsController.newsList = function (req, res) {
    News.findAll(req.query.page - 1, parseInt(req.query.size), {}, {'content': 0}, function (err, news, total) {
        if (err) {
            res.json(err);
        } else {
            res.json({
                total: total,
                data: news
            });
        }
    });
};

//  api:分页获取所有已发布新闻的简要信息
newsController.publishedNewsList = function (req, res) {
    News.findAll(req.query.page - 1, parseInt(req.query.size), {'state': 2}, {'content': 0}, function (err, news, total) {
        if (err) {
            res.json(err);
        } else {
            res.json({
                total: total,
                data: news
            });
        }
    });
};

//  api:获取指定新闻
newsController.getNews = function (req, res) {
    var id = req.params.id;
    News.findById(id, function (err, news) {
        if (err) {
            res.json({
                success: false,
                msg: err.message
            });
        } else {
            res.json({success: true, data: news});
        }
    })
};

//  api:保存新闻
newsController.saveNews = function (req, res, next) {
    var newsId = req.body.id;
    var newsObj = {
        title: req.body.title,
        digest: req.body.digest,
        content: req.body.content,
        state: 2
    };

    var picFile = req.files.pic;
    if (picFile) {
        var filename = uuid() + '-' + picFile.originalFilename;
        //  构建上传路径
        var targetPath = path.resolve(__dirname, '../public/upload') + '/' + filename;
        //  拷贝文件
        fs.createReadStream(picFile.path).pipe(fs.createWriteStream(targetPath));
        //  将图片路径赋值给newsObj对象
        newsObj.describeThePicture = '/upload/' + filename;
    }

    //  新增/更新操作的回调
    var cb = function (err, news) {
        if (err) {
            res.json({
                success: false,
                msg: err.message
            });
        } else {
            res.json({success: true});
        }
    };

    //  视情况来新增/更新
    if (newsId != null) {
        News.updateInfo(newsId, newsObj, cb);
    } else {
        News.createInfo(newsObj, cb);
    }
};

//  api:删除新闻
newsController.deleteNews = function (req, res) {
    var id = req.params.id;
    News.deleteInfo(id, function (err, updateCount) {
        if (err) {
            res.json({error: err});
        } else {
            res.json({success: true});
        }
    });
};

//  api:发布新闻
newsController.publishNews = function (req, res) {
    var id = req.body.id;
    var state = req.body.state;
    var news = {
        state: state
    };
    News.updateInfo(id, news, function (err, updateCount) {
        if (err) {
            res.json({success: false});
        } else {
            res.json({success: true});
        }
    });
};

//  上传图片并返回地址
newsController.uploadPic = function (req, res) {
    var picPath;    //  文件地址
    var picFile = req.files.thePic;
    if (picFile) {
        var filename = uuid() + '-' + picFile.originalFilename;
        //  构建上传路径
        var targetPath = path.resolve(__dirname, '../public/upload') + '/' + filename;
        //  拷贝文件
        fs.createReadStream(picFile.path).pipe(fs.createWriteStream(targetPath));
        picPath = 'http://' + req.headers.host + '/upload/' + filename;
    }
    res.json({path: picPath})
};

module.exports = newsController;