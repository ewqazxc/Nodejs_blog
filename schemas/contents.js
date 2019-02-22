var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    //关联字段 - 分类的id
    category: {
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },
    title: String,
    //简介
    desc: {
        type: String,
        default: ''
    },
    //内容
    content: {
        type: String,
        default: ''
    },
    //关联字段 - 用户id
    user: {
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },
    //点击量
    views: {
        type: Number,
        default: 0
    },
    addTime: {
        type: Date,
        default: new Date()
    },
    //评论信息
    comments:{
        type:Array,
        default:[]
    }
})