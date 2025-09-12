const getMonthlyService = require("../services/query/statistic/getMonthlyService")
const asyncHandler = require('../middlewares/asyncHandler');

exports.getMonthlyStats = asyncHandler(async (req, res) => {
  const stat = await getMonthlyService();
  res.json(stat);
});