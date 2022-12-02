import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Product from "./components/Product"
import { useState, useEffect } from "react";
import { apiProduct } from "../../global/constants";
import { useSearchParams } from "react-router-dom"

const getProduct = (id) => apiProduct.get(`?id=${id}`);

async function getData(id,setData) {
    const response = await getProduct(id);
    const product = response.data;
    setData(product);
}

const ProductDetail = () => {
    const [data, setData] = useState([]);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        getData(id,setData);
    },[id])

    return (
        <>
            <Header/>
            <Product product={data}/>
            <Footer />
        </>
    )
}

export default ProductDetail