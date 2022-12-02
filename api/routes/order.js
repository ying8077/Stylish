const express = require('express');
const router = express.Router();
const db = require('../db');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { wrapAsync } = require('../util/util');
require('dotenv').config();

const {
    getTotalRevenue,
    getColorSales,
    getAllPrice,
    getHotGroup,
} = require('../controllers/order_controller');

router.route('/dashboard/revenue').get(wrapAsync(getTotalRevenue));
router.route('/dashboard/colors').get(wrapAsync(getColorSales));
router.route('/dashboard/prices').get(wrapAsync(getAllPrice));
router.route('/dashboard/hots').get(wrapAsync(getHotGroup));

router.post('/pay-by-prime', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
            if (err) {
                return res.json({ status: 'error', code: 401, message: '付款失敗，請先登入!' })
            } else {
                const userId = payload.user_id;
                let order = {
                    amount: Number(req.body.amount),
                    phoneNum: req.body.phone_number,
                    receiverName: req.body.name,
                    email: req.body.email,
                    address: req.body.email,
                    deliver: req.body.deliver_time
                }
                let newOrder = await db.execute("INSERT INTO `order`(`user_id`, `receiver_name`, `phone_number`, `address`, `receiver_email`, `delivery_time`, `amount`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [1 + "", order.receiverName + "", order.phoneNum + "", order.address + "", order.email + "", order.deliver + "", order.amount + "", 'unpaid']);
                const order_id = newOrder[0].insertId;

                const post_data = {
                    "prime": req.body.prime,
                    "partner_key": process.env.PAYMENT_PARTNER_KEY,
                    "merchant_id": "ying8077_CTBC",
                    "amount": order.amount,
                    "details": "TapPay Test",
                    "cardholder": {
                        "phone_number": order.phoneNum,
                        "name": order.receiverName,
                        "email": order.email,
                        "address": order.address
                    },
                    "remember": true
                }

                const payByPrime = await axios({
                    method: 'post',
                    url: 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime',
                    data: post_data,
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.PAYMENT_PARTNER_KEY,
                        'Set-cookie': 'SameSite=None; Secure',
                        'Access-Control-Allow-Credentials': true
                    }
                })
                const result = payByPrime.data.status;
                if (result === 0) {
                    const newPayment = await db.execute("INSERT INTO `payment`(`order_id`) VALUES (?)", [order_id + ""]);
                    const updateOrder = await db.execute("UPDATE `order` SET `status`= 'paid' WHERE `id` = ?", [order_id + ""]);
                    return res.json({ status: "success", message: "付款成功", orderId: order_id })
                } else {
                    return res.json({ status: "error", code: result, message: "付款失敗" })
                }
            }
        })
    } catch (e) {
        return res.json({ status: 'error', code: 401, message: '付款失敗，請先登入!' })
    }
})

module.exports = router;
