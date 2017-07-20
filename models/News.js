/**
 * Entity+Dao
 * Created by surpass.wei@gmail.com on 2017/7/14.
 */
var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
    describeThePicture: String,
    digest: String,
    title: String,
    content: String,
    state: Number,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

NewsSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

//  静态方法，方便Model层调用
NewsSchema.statics = {
    /**
     *
     * @param page  当前页码，0开始计数
     * @param pageSize  每页数据量
     * @param condition 条件
     * @param filter    对结果对象过滤字段
     * @param cb    对调函数
     * @returns {*}
     */
    findAll: function (page, pageSize, condition, filter, cb) {
        var start = page * pageSize;
        var total;
        this.count(condition, function (err, c) {
            total = c;
        });
        return this
            .find(condition, filter)
            .skip(start).limit(pageSize)
            .sort({'meta.updateAt': 'desc'})
            .exec(function (err, datas) {
                cb(err, datas, total);
            });
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id}).exec(cb);
    },
    createInfo: function (news, cb) {
        return this
            .create(news, cb);
    },
    updateInfo: function (id, news, cb) {
        var conditions = {_id: id};
        var options = {};
        var update = {$set: news};
        return this
            .update(conditions, update, options, cb);
    },
    deleteInfo: function (id, cb) {
        var conditions = {_id: id};
        return this
            .remove(conditions, cb);
    }
};

//  Model:用来操作数据库
var News = mongoose.model('news', NewsSchema);

module.exports = News;