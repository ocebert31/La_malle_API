const statisticService = require("../services/statistic")
const asyncHandler = require('../middlewares/asyncHandler');

exports.getMonthlyStats = asyncHandler(async (req, res) => {
  const stat = await statisticService.getMonthlyStats();
  res.json(stat);
});