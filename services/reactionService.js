const BasicService = require('../utils/services/basicService');
const bindMethodsWithThisContext = require('../utils/classes/bindMethodsWithThisContext');
const Reaction = require('../models/reaction');
const { BadRequestException } = require('../utils/exceptions/commonExceptions');
const { TARGET_TYPE, TYPE } = require('../utils/constants/reaction');

const TARGET_TYPE_ARRAY = Object.values(TARGET_TYPE);
const TYPE_ARRAY = Object.values(TYPE);

class ReactionService extends BasicService {
    constructor() {
        super();
        bindMethodsWithThisContext(this);
    }
    async getReactionOfTargetWithPagination({ target, targetType, currentUser }) {
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
            { $match: { target, targetType: Number(targetType) } },
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
    async getReactionByUser({ id, targetType, page }) {
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
    async react({ target, targetType, type, currentUser }) {
        if (!target || !TARGET_TYPE_ARRAY.includes(targetType) || !TYPE_ARRAY.includes(type)) {
            throw new BadRequestException('You must provide both target, target type and type of reaction')
        }
        await Reaction.findOneAndDelete({
            target,
            targetType,
            user: currentUser.userId,
        });

        //push notification to the target owner so that you must query the target first
        const reaction = new Reaction({
            target,
            targetType,
            type,
            user: currentUser.userId,
        });

        return await reaction.save();
    }
    async cancelReact({ id }) {
        const reaction = await Reaction.findByIdAndDelete(id);

        return reaction;
    }
    async deleteAllReactOfTarget({ target, targetType, currentUser }) {
        if (!target || !TARGET_TYPE_ARRAY.includes(targetType)) {
            throw new BadRequestException('You must provide both target and target type')
        }
        const results = await Reaction.deleteMany({
            target,
            targetType
        });

        return results;
    }
}

module.exports = new ReactionService();