const router = require('express').Router();
const reactionController = require('../controllers/reactionController');
const mapHealthStatusRoute = require('../utils/eureka/healthStatusRoute');

mapHealthStatusRoute(router);
router.get('/of-current-user',reactionController.getReactionOfCurrentUser);
router.get('/of-target',reactionController.getReactionOfTargetWithPagination);
router.post('/react',reactionController.react);
router.delete('/cancel/:id',reactionController.cancelReact);
router.delete('/of-target/:target',reactionController.deleteAllReactOfTarget);

module.exports = router;
