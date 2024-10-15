const BasicService = require('../utils/services/basicService');
const bindMethodsWithThisContext = require('../utils/classes/bindMethodsWithThisContext');
const Reaction = require('../models/reaction');

class ReactionService extends BasicService {
    constructor() {
        super();
        bindMethodsWithThisContext(this);
    }
    async getReactionOfTargetWithPagination(payloads) {
        const { target, targetType, currentUser } = payloads;
        //todo check user can view that first
        const reactionCountsPromise = Reaction.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                },
            },
        ]);
        const topReactionsPromise = Reaction.aggregate([
            { $match: { target, targetType } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
                $group: {
                    _id: '$type',
                    reactions: { $push: '$$ROOT' }
                },
            },
            {
                $project: {
                    _id: 1,
                    reactions: { $slice: ['$reactions', 10] }
                },
            }
        ]);
        const [reactionCounts, topReactions] = await Promise.all([reactionCountsPromise, topReactionsPromise]);

        return {
            reactionCounts,
            topReactions,
        };
    }
    async getReactionByUser(payloads) {
        const { id, targetType, page } = payloads;

        const { results: reactions, totalDocuments, totalPages } = await this.getPaginatedResults({
            model: Reaction,
            query: {
                user: id,
                targetType,
            },
            page,
        });
        return {
            reactions,
            totalDocuments,
            totalPages
        };
    }
    async react(payloads) {
        const { target, targetType, type, currentUser } = payloads;
        let reaction = await Reaction.findOne({
            target,
            targetType,
            user: currentUser.userId,
        });

        if (reaction) {
            await reaction.delete();
        }
        //push notification to the target owner so that you must query the target first
        reaction = new Reaction({
            target,
            targetType,
            type,
            user: currentUser.userId,
        });

        return await reaction.save();
    }
    async cancelReact(payloads) {
        const { id } = payloads;
        const reaction = await Reaction.findByIdAndDelete(id);

        return reaction;
    }
    async deleteAllReactOfTarget(payloads) {
        const { target, targetType } = payloads;

        const results = await Reaction.deleteMany({
            target,
            targetType
        });

        return results;
    }
}

module.exports = new ReactionService();