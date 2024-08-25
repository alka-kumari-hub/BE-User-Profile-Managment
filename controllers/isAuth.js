const { users } = require("../models");
const jwt = require("jsonwebtoken");

module.exports.isAuth = async (req, res, next) => {
  let token = req.get("Authorization");
  try {
    if (!token) throw new Error("You are not able to act. Please Login !!");

    token = token.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
    if (decodedToken) {
      const user = await users.findOne({
        raw: true,
        where: { id: decodedToken?.id },
      });
      if (user) {
        req.currentUser = decodedToken;
        return next();
      }
    }
    throw new Error("Your Login Id Expired So, Please Login Again");
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};
