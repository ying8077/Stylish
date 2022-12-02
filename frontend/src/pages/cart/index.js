import Header from "../../components/Header"
import Footer from "../../components/Footer"
import CartItems from "./components/CartItems"
import OrderInfo from "./components/OrderInfo"
import "../../assets/style/cart.css"
import { useState } from "react"

const Cart = () => {
    const [total, setTotal] = useState(getTotal());

    function getTotal() {
        const localCart = localStorage.getItem("cart");
        let existentItem = localCart ? JSON.parse(localCart) : [];
        let total = 0;
        for (let i = 0; i < existentItem.length; i++) {
            total += existentItem[i].quantity * existentItem[i].price
        }
        return total
    }

    return (
        <>
            <Header />
            <CartItems setTotal={() => setTotal(getTotal)}/>
            <OrderInfo total={total}/>
            <Footer />
        </>
    )
}

export default Cart