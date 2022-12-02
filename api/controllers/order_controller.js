const axios = require('axios');
const validator = require('validator');
const Order = require('../models/order_model');

const getOrderData = async (req, res) => {
    const response = await axios.get("http://35.75.145.100:1234/api/1.0/order/data");
    const data = await response.data;

    for (let i = 0; i < data.length; i++) {
        const orderId = await Order.getOrder(data[i].total);
        await Order.getOrderDetails(orderId, data[i].list);
    }
}

const getTotalRevenue = async (req, res) => {
    const result = await Order.getTotal();
    res.send({ status: 200, data: result });
}

const getColorSales = async (req, res) => {
    const result = await Order.getColorSales();
    const data = {
        quantity: [],
        color_code: [],
        color_name: []
    }

    for (let i = 0; i < result.length; i++) {
        data.quantity.push(result[i].qty);
        data.color_code.push(result[i].color_code);
        data.color_name.push(result[i].color_name);
    }

    res.status(200).send(data);
}

const getAllPrice = async (req, res) => {
    const result = await Order.getAllPrice();
    let allPrice = [];
    const data = {
        price: [],
        qty: []
    };

    for (let i = 0; i < result.length; i++) {
        allPrice = allPrice.concat(Array(result[i].quantity).fill(result[i].price));
    }

    res.status(200).send(allPrice);
}

const getHotGroup = async (req, res) => {
    const result = await Order.getHot(5);
    const top5 = [];
    for (let i = 0; i < result.length; i++) {
        top5.push({ 
            "id": result[i].product_id,
            "sizes" : await Order.getSizeGroup(result[i].product_id)
     });
    }
   
    res.status(200).send(top5);
}

module.exports = {
    getTotalRevenue,
    getColorSales,
    getAllPrice,
    getHotGroup
}