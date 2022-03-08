exports.get404 = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      csrfToken: req.csrfToken(),
      docTitle: "Page not found",
      path: "/404",
    });
};

exports.get500 = (req, res, next) => {
  res
    .status(500)
    .render("500", {
      csrfToken: req.csrfToken(),
      docTitle: "500",
      path: "/500",
    });
};

exports.handleServerError = (err,next) => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  next(error);
}