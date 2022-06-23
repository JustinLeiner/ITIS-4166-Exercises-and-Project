const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema ({
    title: {type: String, required: [true, 'title is required']},
    author: {type: String, required: [true, 'author is required']},
    content: {type: String, requried: [true, 'content is required'], 
        minlength: [10, 'the content should have at least 10 characters']}
},
{timestamps: true}

);

// collection name is stories in the db
module.exports = mongoose.model('Story', storySchema);

