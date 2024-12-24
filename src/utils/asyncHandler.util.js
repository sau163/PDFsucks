const asyncHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise
    .resolve(reqHandler(req, res, next))
    .catch((error) => next(error));
  }
}

export { asyncHandler };
