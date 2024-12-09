// models/luggageModel.js
class LuggageModel {
  constructor(id, name, status, location, num_lugg, trackingLink) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.location = location;
    this.num_lugg = num_lugg;
    this.trackingLink = trackingLink;
  }
}

module.exports = LuggageModel;
