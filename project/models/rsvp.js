const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    connection: {type: Schema.Types.ObjectId, ref: 'connection'},
    value: {type: String}
})

module.exports = mongoose.model('rsvp', rsvpSchema);