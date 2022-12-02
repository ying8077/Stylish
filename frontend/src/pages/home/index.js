import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Product from "./components/Product"
import CarouselFade from "./components/Carousel"
import { useState, useEffect } from "react";
import "../../assets/style/index.css"
import "../../assets/style/home-mobile.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiProduct } from "../../global/constants";

const getProductList = (category) => apiProduct.get(`/${category}`);

async function getData(setData) {
    const response = await getProductList(getCategory());
    const products = response.data.products;
    setData(products);
}

function getCategory() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has('keyword')) {
        return `search?keyword=${urlParams.get('keyword')}`;
    }
    return urlParams.get("category") ?? "all"
}

const Home = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getData(setData);
    },[])

    return <>
        <Header />
        <CarouselFade />
        <Product product={data}/>
        <Footer />
    </>
}

export default Home