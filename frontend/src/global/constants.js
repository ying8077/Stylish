import axios from "axios"
const hostname = 'https://stylish-yjing.tk/api';

export const apiOrder = axios.create({
    baseURL: `${hostname}/orders/dashboard`,
    headers: {
        "Content-Type": "application/json",
    }
})

export const apiProduct = axios.create({
    baseURL: `https://stylish-yjing.tk/api/products`,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    }
})

export const apiUser = axios.create({
    baseURL: `https://stylish-yjing.tk/api/users`,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    }
})