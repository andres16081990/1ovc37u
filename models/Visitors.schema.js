'use strict'

const mongoose = require('mongoose');


const VisitorsSchema = new mongoose.Schema({
    path : {
        type: String},
    date :{
        type: Date,
        default: Date.now()},
    userAgent :{
        type: Object},
    count: {
        type: Number,
        default : 1}
});

module.exports = mongoose.model('pageView',VisitorsSchema);