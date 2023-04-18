const mongoose =require('mongoose');
const {Schema} = mongoose;
const notesSchema = new mongoose.Schema({
    user: {
        // Used as an foregin key to store id of other model in it 
        //in order to link them
        type: mongoose.Schema.Types.ObjectId,
        // Refrence Model is set
        ref: 'user'
    },
    title:{
        type: String,
        required : true
    },
    description:{
        type: String,
        required : true,
    },
    tag: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }

})
module.exports = mongoose.model("notes",notesSchema);