//const {v4: uuidv4} = require('uuid');
const { DateTime } = require('luxon');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    name: {type: String, required: [true, 'name is required']},
    topic: {type: String, required: [true, 'topic is required']},
    description: {type: String, required: [true, 'content is required'], minlength: [15, 'the content should have at the minimum 15 characters']},
    location: {type: String, required: [true, 'location is required']},
    date: {type: String, required: [true, 'date is required']},
    startTime: {type: String, required: [true, 'start time is required']},
    endTime: {type: String, required: [true, 'end time is required']},
    hostname: {type: Schema.Types.ObjectId, ref: 'User'},//{type: String, required: [true, 'hostname is required']},
    imgURL: {type: String, required: [true, 'url is required']}
}
);

module.exports = mongoose.model('connection', connectionSchema);
