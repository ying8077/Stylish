const db = require('../db');
const validator = require('validator');

const getOrder = async (orderAmount) => {
    const [result] = await db.execute('INSERT INTO `order`(amount) VALUES(?)', [orderAmount]);
    return result.insertId;
}

const getOrderDetails = async (orderId, orderData) => {
    for (let i = 0; i < orderData.length; i++) {
        let createOrder = [orderId, orderData[i].id, orderData[i].price, orderData[i].color.code, orderData[i].color.name, orderData[i].size, orderData[i].qty];
        const [result] = await db.execute('INSERT INTO `order_line_item`(`order_id`, `product_id`, `price`, `color_code`, `color_name`, `size`, `quantity`) VALUES (?,?,?,?,?,?,?)', createOrder);
    }
}

const getTotal = async() => {
    const [total] = await db.execute('SELECT SUM(amount) as total FROM `order`');
    return total[0];
}

const getColorSales = async() => {
    const [result] = await db.execute('SELECT SUM(quantity) as qty,`color_code`,`color_name` FROM `order_line_item` GROUP BY `color_code`;');
    return result;
}

const getAllPrice = async() => {
    const [result] = await db.execute('SELECT `price`, `quantity` FROM `order_line_item` ORDER BY `price`');
    return result;
}

const getHot = async(topN) => {
    const [result] = await db.execute('SELECT `product_id` FROM `order_line_item` GROUP BY `product_id` ORDER BY SUM(quantity) DESC LIMIT ?', [topN]);
    return result;
}

const getSizeGroup = async(product_id) => {
    const [result] = await db.execute('SELECT `size`,SUM(quantity) as qty FROM `order_line_item` WHERE `product_id` = ? GROUP BY `size` ORDER BY `size` DESC', [product_id]);
    return result;
}

module.exports = {
    getOrder,
    getOrderDetails,
    getTotal,
    getColorSales,
    getAllPrice,
    getHot,
    getSizeGroup,
};