const {Schema, model, Types} = require("mongoose")

const schema = new Schema({
    // owner: {type: Types.ObjectId, ref: 'User'},    //связка с пользователем
    index: {type: Number, require: true},
    message: {type: String, require: true},
    id: {type: String, require: true, unique: true},
    parentId: {type: String, require: true}
})

module.exports = model("Todo", schema)