const express = require('express');
const router = express.Router();
const db = require('../db');

const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./public/images/uploads")
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    }),
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload an image'))
        }
        const fileSize = parseInt(req.headers['content-length']);
        if (fileSize > 1000000) {
            cb(new Error('file size > 1MB'));
        }
        cb(null, true)
    }
})

//search api
router.get('/search', async (req, res) => {
    let sql_all = "SELECT `id` FROM `product` WHERE `title` LIKE CONCAT('%', ? ,'%')";
    const keyword = req.query.keyword;
    const check = await db.execute(sql_all, [keyword + ""]);
    let products = check[0];

    const numOfResults = products.length;
    const resultPerPage = 6;
    const numOfPages = Math.ceil(numOfResults / resultPerPage) - 1;
    let page = req.query.paging ? Number(req.query.paging) : 0;
    const startIndex = page * resultPerPage

    if (page > numOfPages) {
        return res.redirect(`/api/products/search?keyword=${keyword}&paging=${numOfPages}`);
    } else if (page < 0) {
        return res.redirect(`/api/products/search?keyword=${keyword}&paging=0`);
    }

    sql = "SELECT A.id, `title`, `price`, `img`, GROUP_CONCAT(DISTINCT `color_num`) as color FROM `product` AS A LEFT JOIN `product_entry` AS B ON A.id = B.product_id WHERE `title` LIKE CONCAT('%', ? ,'%') GROUP BY B.product_id LIMIT ?, ?";
    db.execute(sql, [keyword + "", startIndex + "", resultPerPage + ""])
        .then(data => {
            if (page === numOfPages) {
                let result = {
                    products: data[0]
                }
                res.send(result);
            } else if (page < numOfPages) {
                let result = {
                    next_paging: page + 1,
                    products: data[0]
                }
                res.send(result);
            }
        })
        .catch(err => {
            console.log(err);
        })
});

//category_all api
router.get('/all', (req, res) => {
    db.execute("SELECT `id` FROM `product`")
        .then(data => {
            let products = data[0];
            const numOfResults = products.length;
            const resultPerPage = 6;
            const numOfPages = Math.ceil(numOfResults / resultPerPage) - 1;
            let page = req.query.paging ? Number(req.query.paging) : 0;
            const startIndex = page * resultPerPage;

            if (page > numOfPages) {
                return res.redirect(`/api/products/all?paging=${numOfPages}`);
            } else if (page > 25) {
                return res.redirect(`/api/products/all?paging=25`);
            } else if (page < 0) {
                return res.redirect(`/api/products/all?paging=0`);
            }

            sql = "SELECT A.id, `title`, `price`, `img`, GROUP_CONCAT(DISTINCT `color_num`) as color FROM `product` AS A LEFT JOIN `product_entry` AS B ON A.id = B.product_id GROUP BY B.product_id LIMIT ?, ?";
            db.execute(sql, [startIndex + "", resultPerPage + ""])
                .then(data => {
                    if (page === numOfPages) {
                        let result = {
                            products: data[0]
                        }
                        res.send(result);
                    } else if (page < numOfPages) {
                        let result = {
                            next_paging: page + 1,
                            products: data[0]
                        }
                        res.send(result);
                    }
                })
        })
        .catch(err => {
            console.log(err);
        })
});

//category api
router.get('/:category', (req, res) => {
    let sql = "SELECT `id` FROM `product` WHERE `category` = ?";
    let category = req.params.category;

    db.execute(sql, [category + ""])
        .then(data => {
            let products = data[0];
            const numOfResults = products.length;
            const resultPerPage = 6;
            const numOfPages = Math.ceil(numOfResults / resultPerPage) - 1;
            let page = req.query.paging ? Number(req.query.paging) : 0;
            const startIndex = page * resultPerPage;

            if (page > numOfPages) {
                return res.redirect(`/api/products/${category}?paging=${numOfPages}`);
            } else if (page < 0) {
                return res.redirect(`/api/products/${category}?paging=0`);
            }

            sql = "SELECT A.id, `title`, `price`, `img`, GROUP_CONCAT(DISTINCT `color_num`) as color FROM `product` AS A LEFT JOIN `product_entry` AS B ON A.id = B.product_id WHERE `category` = ? GROUP BY B.product_id LIMIT ?, ?";
            db.execute(sql, [category + "", startIndex + "", resultPerPage + ""])
                .then(data => {
                    if (page === numOfPages) {
                        let result = {
                            products: data[0]
                        }
                        res.send(result);
                    } else if (page < numOfPages) {
                        let result = {
                            next_paging: page + 1,
                            products: data[0]
                        }
                        res.send(result);
                    }
                })
        })
        .catch(err => {
            console.log(err);
        })
});

//product details api
router.get('/', (req, res) => {
    let id = req.query.id;
    db.execute("SELECT * FROM `product` WHERE `id` = ?", [id + ""])
        .then(data => {
            product = data[0][0];

            db.execute("SELECT `color`,`color_num`, `size`, `stock` FROM `product_entry` WHERE `product_id` = ? ORDER BY FIELD(`size`, 'S', 'M', 'L')", [id + ""])
                .then(data => {
                    product.variants = data[0];
                    res.send(product);
                })
        })
});

//create product api
router.post('/', upload.single('uploaded_file'), async (req, res) => {
    let product = {
        id: Number(req.body.product_id),
        title: req.body.title,
        price: Number(req.body.price),
        category: req.body.category,
        info: req.body.info,
        description: req.body.description,
        img: `https://stylish-yjing.tk/api/images/uploads/${req.file.originalname}`
    }

    let check = await db.execute("SELECT EXISTS(SELECT * FROM `product` WHERE `id` = ?)", [product.id + ""]);
    let type = Number(Object.values(check[0][0]));
    if (type === 1) {
        res.send({ error: 'id has been created' })
    } else if (type === 0) {
        db.execute("INSERT INTO `product` VALUES (?, ?, ?, ?, ?, ?, ?)", [product.id + "", product.title + "", product.category + "", product.price + "", product.info + "", product.description + "", product.img + ""])
            .then(() => {
                res.redirect('/admin/product.html');
            })
    }
}, (error, req, res, next) => {
    res.send({ error: error.message })
});

router.post('/variants', async (req, res) => {
    let variants = {
        id: Number(req.body.product_id),
        size: req.body.size,
        color: req.body.color,
        color_num: req.body.color_num,
        stock: Number(req.body.stock)
    }
    let check = await db.execute("SELECT EXISTS(SELECT * FROM `product_entry` WHERE `product_id` = ? AND `color` = ? AND `size` = ?)", [variants.id + "", variants.color + "", variants.size + ""]);
    let type = Number(Object.values(check[0][0]));
    if (type === 1) {
        db.execute("UPDATE `product_entry` SET stock = stock + ? WHERE `product_id`= ? AND `size`= ? AND `color`= ?", [variants.stock + "", variants.id + "", variants.size + "", variants.color + ""])
            .then(() => {
                return res.redirect('/admin/product.html');
            })
    } else if (type === 0) {
        db.execute("INSERT INTO `product_entry`(`product_id`, `size`, `color`, `color_num`, `stock`) VALUES (?, ?, ?, ?, ?)", [variants.id + "", variants.size + "", variants.color + "", variants.color_num + "", variants.stock + ""])
            .then(() => {
                return res.redirect('/admin/product.html');
            })
    }
}, (error, req, res, next) => {
    res.send({ error: error.message })
});

module.exports = router;