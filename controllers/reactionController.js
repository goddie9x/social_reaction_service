const BasicController = require('../utils/controllers/basicController');
const bindMethodsWithThisContext = require('../utils/classes/bindMethodsWithThisContext');
const reactionService = require('../services/reactionService');

class ReactionController extends BasicController {
    constructor() {
        super();
        bindMethodsWithThisContext(this);
    }
    async getReactionOfTargetWithPagination(req, res) {
        try {
            const reactionsInfo = await reactionService.getReactionOfTargetWithPagination({ ...req.query, ...req.body });
            res.status(201).json(reactionsInfo);
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }

    async getReactionOfCurrentUser(req, res) {
        try {
            const payload = { id: req.body.currentUser.userId, targetType: req.body.targetType, page: req.body.page }
            const reactionsInfo = await reactionService.getReactionByUser(payload);

            res.status(201).json(reactionsInfo);
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async react(req, res) {
        try {
            const reaction = await reactionService.react(req.body);
            res.status(201).json(reaction);
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async cancelReact(req, res) {
        try {
            const reaction = await reactionService.cancelReact({ id: req.params.id });

            res.status(201).json(reaction);
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async deleteAllReactOfTarget(req, res) {
        try {
            const reaction = await reactionService.deleteAllReactOfTarget(req.body);

            res.status(201).json(reaction);
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
}

module.exports = new ReactionController();