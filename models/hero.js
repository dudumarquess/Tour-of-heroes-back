const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HeroSchema = new Schema({
    //id:
    name: {type: String, required: true},
    petId: {type: Schema.Types.ObjectId, ref: "Pet", default: null}
});

HeroSchema.virtual("url").get(function() {
    return `catalog/hero/${this.id}`;
});

module.exports = mongoose.model("Hero", HeroSchema);