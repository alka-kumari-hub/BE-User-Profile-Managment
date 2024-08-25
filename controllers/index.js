const { users } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await users.findOne({
      where: { email },
    });
    if (!user) {
      res
        .status(422)
        .json({ data: { message: "Invalid Username", success: false } });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Wrong password", 401);
    }

    const token = jwt.sign({ ...user.dataValues }, process.env.JWT_SECRET);
    res
      .status(200)
      .json({ message: "Login Successfully", success: false, token });
  } catch (err) {
    next(err);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const payload = {
      name,
      email,
      password: hashedPassword,
    };
    const user = await users.findOne({
      where: { email },
    });

    if (user) {
      throw new Error("This email is already registered", 502);
    }

    await users.create(payload);
    res.status(200).json({ message: "User Register successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserByUserId = async (req, res, next) => {
  try {
    const { id } = req.currentUser;
    const user = await users.findOne({
      where: { id },
      attributes: ["id", "name", "email", "mobile"],
    });
    if (!user) throw new Error("User not found");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.currentUser;
    const { name, email, mobile } = req.body;
    const record = {
      name,
      email,
      mobile,
    };
    await users.update(record, {
      where: { id },
    });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};
