const { user } = require('../../models');
require('dotenv').config();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const schema = Joi.object({
    fullname: Joi.string().min(6).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(8).required(),
  });
  const { error } = schema.validate(req.body);
  const emailExists = await user.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (emailExists) {
    res.status(500).send({
      status: 'failed',
      message: 'email already exists',
    });
    return false;
  }
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  try {
    const saltRounds = await bcrypt.genSalt(10);
    const hashingPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = await user.create({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashingPassword,
      status: 'user',
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    res.status(200).send({
      status: 'success',
      data: {
        user: {
          fullname: newUser.fullname,
          email: newUser.email,
          token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: 'server error',
    });
  }
};

exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(8).required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    const isValid = await bcrypt.compare(req.body.password, userExist.password);
    if (!isValid) {
      return res.status(400).send({
        status: 'failed',
        message: 'email/password incorrect',
      });
    }
    const token = jwt.sign({ id: userExist.id }, process.env.JWT_SECRET);
    res.status(200).send({
      status: 'success',
      data: {
        user: {
          fullname: userExist.fullname,
          email: userExist.email,
          token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: 'email/password incorrect',
    });
  }
};
