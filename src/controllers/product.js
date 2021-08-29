const { product } = require('../../models');

exports.getProducts = async (req, res) => {
  try {
    const products = await product.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });
    res.send({
      status: 'success',
      data: {
        products,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.detailProduct = async (req, res) => {
  try {
    const idProduct = req.params.id;
    const findProduct = await product.findOne({
      where: {
        id: idProduct,
      },
    });
    const { id, title, price, image, status } = findProduct;
    res.send({
      status: 'success',
      data: {
        product: {
          id,
          title,
          price,
          image,
          status,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.addProduct = async (req, res) => {
  const productExists = await product.findOne({
    where: {
      title: req.body.title,
    },
  });
  if (productExists) {
    res.status(500).send({
      status: 'failed',
      message: 'product already exists',
    });
    return false;
  }
  try {
    const newProduct = await product.create({ ...req.body });
    const { id, title, price, image, status } = newProduct;
    res.send({
      status: 'success',
      data: {
        product: {
          id,
          title,
          price,
          image,
          status,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const idProduct = req.params.id;
    await product.update(req.body, {
      where: {
        id: idProduct,
      },
    });
    const findProduct = await product.findOne({
      where: {
        id: idProduct,
      },
    });
    const { id, title, price, image, status } = findProduct;
    res.send({
      status: 'success',
      data: {
        product: {
          id,
          title,
          price,
          image,
          status,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await product.destroy({
      where: {
        id,
      },
    });
    res.send({
      status: 'success',
      data: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};