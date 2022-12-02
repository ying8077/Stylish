import Select from "react-select";
import { useState } from "react";

const Item = ({ item, cart, setCart, setTotal }) => {
    const { id, productId, color, size, img, price, title, quantity, stock } = item;
    const [subTotal, setSubTotal] = useState(quantity * price);

    function appendOption(stock) {
        let options = [];
        for (let i = 1; i < stock + 1; i++) {
            options.push({ value: i, label: i })
        }
        return options
    }

    function handleChange(selected) {
        let cartCopy = [...cart];
        let existentItem = cartCopy.find(item => item.id === id);
        let newQuantity = selected.value;

        existentItem.quantity = newQuantity;
        setCart(cartCopy);
        localStorage.setItem("cart", JSON.stringify(cartCopy));
        setSubTotal(newQuantity * price);
        setTotal();
    }

    function removeItem() {
        let cartCopy = [...cart]
        cartCopy = cartCopy.filter(item => item.id !== id);
        setCart(cartCopy);
        localStorage.setItem('cart', JSON.stringify(cartCopy));
        window.dispatchEvent(new Event("storage"));
    }

    return (
        <div className="cart-item">
            <div className="cart-info">
                <img src={img} alt="product" />
                <div className="cart-detail">
                    <div className="cart-title">{title}</div>
                    <div className="cart-item-id">{productId}</div>
                    <div className="cart-variant">
                        <label className="cart-variant-label">顏色</label>
                        <label>{color}</label>
                    </div>
                    <div className="cart-variant">
                        <label className="cart-variant-label">尺寸</label>
                        <label>{size}</label>
                    </div>
                </div>
            </div>
            <div className="cart-item-bottom">
                <label>數量</label>
                <Select
                    options={appendOption(stock)}
                    defaultValue={appendOption(stock)[quantity - 1]}
                    onChange={handleChange}
                />
            </div>
            <div className="cart-item-bottom">
                <label>單價</label>
                <div>TWD.{price}</div>
            </div>
            <div className="cart-item-bottom">
                <label>小計</label>
                <div>TWD.{subTotal}</div>
            </div>
            <div className="cart-remove" onClick={removeItem}></div>
        </div>
    )
}

export default Item