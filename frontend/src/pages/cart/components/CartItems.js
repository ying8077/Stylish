import { useState } from "react";
import Item from "./Item";

const CartItems = ({ setTotal }) => {
    const localCart = localStorage.getItem("cart");
    const [cart, setCart] = useState(localCart ? JSON.parse(localCart) : []);
    return (
        <div className="cart-container">
            <div className="cart-header">
                <label>購物車({cart.length})</label>
                <label>數量</label>
                <label>單價</label>
                <label>小計</label>
            </div>
            <div className="cart-items">
                {cart.map((item) => {
                    const { id } = item;
                    return (
                        <Item
                            key={id}
                            item={item}
                            cart={cart}
                            setCart={setCart}
                            setTotal={setTotal}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default CartItems