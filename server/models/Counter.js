const counterSchema = new mongoose.Schema({
    collectionName: { type: String, required: true },
    count: { type: Number, required: true, default: 1 }
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
