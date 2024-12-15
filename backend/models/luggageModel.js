// models/luggageModel.js
class LuggageModel {
  constructor(id, name, status, location, num_lugg, trackingLink, userId) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.location = location;
    this.num_lugg = num_lugg;
    this.trackingLink = trackingLink;
    this.userId = userId;
  }
}

module.exports = LuggageModel;
