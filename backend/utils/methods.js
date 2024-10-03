const extractPaginationDetailsFromQuery = (req) => {
  const page = +req.query.page || 1; // Default page is 1
  const perPage = +req.query.perPage || 5; // Default page size is 10
  const skip = (page - 1) * perPage;
  const limit = +perPage || 5;

  return {
    page,
    perPage,
    skip,
    limit,
  };
};

module.exports = {
  extractPaginationDetailsFromQuery,
};
