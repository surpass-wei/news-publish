var express = require('express');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = express.Router();
var newsController = require('../control/news.controller');

router.get('/add', newsController.addNewsPage);
router.get('/update', newsController.updateNewsPage);
router.post('/upload-pic', multipartMiddleware, newsController.uploadPic);

router.route('/')
    .get(newsController.newsList)
    .post(multipartMiddleware, newsController.saveNews)
    .put(newsController.publishNews);

router.route('/:id')
    .get(newsController.getNews)
    .delete(newsController.deleteNews);

router.get('/types/simple', newsController.publishedNewsList);

module.exports = router;
