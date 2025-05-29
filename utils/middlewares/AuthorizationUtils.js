module.exports = class AuthorizationUtils {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  async isAuthenticated(req, res, next) {
    try {
      if (req?.isAuthenticated()) {
        return next();
      }

      res
        ?.status(401)
        .send({ isAuthenticated: false, message: "Unauthorized" });
    } catch (error) {
      next(error);
    }
  }

  async isAdmin(req, res, next) {
    try {
      if (req.user?.role === "admin") {
        return next();
      }

      res?.status(401).send({ isAdmin: false, message: "Unauthorized" });
    } catch (error) {
      next(error);
    }
  }
};
