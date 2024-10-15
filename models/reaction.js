const mongoose = require('../configs/mongo');
const REACTION = require('../utils/constants/reaction');

const REACTION_TYPE_ARRAY = Object.values(REACTION.TYPE);
const REACTION_TARGET_TYPE_ARRAY = Object.values(REACTION.TARGET_TYPE);

const ReactionSchema = new mongoose.Schema({
    target: {
        type: String,
        required: true
    },
    targetType: {
        type: Number,
        enum: REACTION_TARGET_TYPE_ARRAY,
        required: true,
    },
    type: {
        type: Number,
        enum: REACTION_TYPE_ARRAY,
        default: REACTION.TYPE.LIKE
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ReactionSchema.index({
    target: 1,
    targetType: 1,
    user: 1,
    createdAt: -1
});
ReactionSchema.index({
    user: 1,
    target: 1,
    targetType: 1,
    createdAt: -1
});

module.exports = mongoose.model('Reaction', ReactionSchema);
