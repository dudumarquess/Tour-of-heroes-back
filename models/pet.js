const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PetSchema = new Schema({
    name: {type: String, required: true}
});

PetSchema.virtual("url").get(function(){
    return `catalog/pet/${this.id}`;

});

module.exports = mongoose.model("Pet", PetSchema);