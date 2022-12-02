const request = require("supertest");
const api = require("../app.js");

describe("GET /:category", () => {
    const categorys = ["all", "women", "men", "accessories"]

    test("responds with an array of products", async () => {
        for (let category of categorys) {
            const response = await request(api).get(`/api/products/${category}`);
            expect(response.body).toHaveProperty("products");
            expect(response.body.products.length).toBeGreaterThanOrEqual(1);
            expect(response.statusCode).toBe(200);
        }
    })

    test("there should be a maximum of 6 products on a page", async () => {
        for (let category of categorys) {
            const response = await request(api).get(`/api/products/${category}`);
            expect(response.body.products.length).toBeLessThanOrEqual(6);
        }
    })

    test('should direct to page 0 if paging is not given', async () => {
        for (let category of categorys) {
            const res_default = await request(api).get(`/api/products/${category}`);
            const res_page_0 = await request(api).get(`/api/products/${category}`).query({ paging: 0 });
            expect(res_default.body).toMatchObject(res_page_0.body);
        }
    });

    test('if there is next-paging then paging + 1 will also respond with an array of products', async () => {
        const res_page_0 = await request(api).get(`/api/products/all`).query({ paging: 0 });
        const res_page_1 = await request(api).get(`/api/products/all`).query({ paging: 1 });
        expect(res_page_0.body).toHaveProperty("next_paging");
        expect(res_page_1.statusCode).toBe(200);
        expect(res_page_0.body).not.toMatchObject(res_page_1.body);
    });
})

describe("GET /search?keyword", () => {
    const keyword = '洋裝';
    const url = encodeURI(`/api/products/search?keyword=洋裝`);

    test("responds with an array of products", async () => {
        const response = await request(api).get(url);
        expect(response.body).toHaveProperty("products");
        expect(response.body.products.length).toBe(2);
        expect(response.statusCode).toBe(200);
    })

    test("there should be a maximum of 6 products on a page", async () => {
        const response = await request(api).get(url);
        expect(response.body.products.length).toBeLessThanOrEqual(6);
    })

    test('should direct to page 0 if paging is not given', async () => {
        const res_default = await request(api).get(url);
        const res_page_0 = await request(api).get(url).query({ paging: 0 });
        expect(res_default.body).toMatchObject(res_page_0.body);
    });

    test('if there is not next-paging then paging + 1 will direct to paging', async () => {
        const res_page_0 = await request(api).get(url).query({ paging: 0 });
        const res_page_1 = await request(api).get(url).query({ paging: 1 });
        expect(res_page_0.body).not.toHaveProperty("next_paging");
        expect(res_page_0.body).toMatchObject(res_page_1.body);
    });
})

describe("POST /login", () => {

    describe("given email and password", () => {
        test("response has token", async () => {
            const response = await request(api).post('/api/users/login').send({
                email: 'duck222222@gmail.com',
                password: '123456'
            });
            expect(response.body.token).toBeDefined();
            expect(response.statusCode).toBe(200);
        })
    })

    describe("when email/password is not filled or is wrong", () => {
        test("response with status code 400", async () => {
            const datas = [
                { email: '', password: '123456' },
                { email: 'duck222222@gmail.com', password: '' },
                { email: 'dc@gmail.com', password: '123456' },
                { email: 'duck222222@gmail.com', password: '123' }
            ]
            for (let data of datas) {
                const response = await request(api).post('/api/users/login').send(data);
                expect(response.statusCode).toBe(400);
            }
        })
    })
})