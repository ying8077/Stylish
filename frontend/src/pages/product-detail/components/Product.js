import { useState } from "react"
import { toast } from "react-toastify"
import { v4 } from "uuid"
import info1 from "../../../assets/images/uploads/more1.jpg"
import info2 from "../../../assets/images/uploads/more2.jpg"
import "../../../assets/style/productDetail.css"

function plus(setQuantity, maxQuantity) {
    setQuantity(prev => prev < maxQuantity ? prev + 1 : prev);
}

function minus(setQuantity) {
    setQuantity(prev => prev === 1 ? prev : prev - 1);
}

function setMax(size, colorData, variants, setColorName, setSizeData, setMaxQuantity) {
    setSizeData(size);
    for (let i = 0; i < variants.length; i++) {
        if (variants[i].color_num === colorData && variants[i].size === size) {
            setMaxQuantity(variants[i].stock);
            setColorName(variants[i].color);
        }
    }
}

function disableSize(color, variants, setcolorData, setSizeData, setSizeDisable) {
    setSizeData("");
    setcolorData(color);
    let outOfStock = [];

    for (let i = 0; i < variants.length; i++) {
        setSizeDisable((sizeData) => ({ ...sizeData, [variants[i].size]: false }))
        if (variants[i].color_num === color && variants[i].stock === 0) {
            outOfStock.push(variants[i].size);
        }
    }
    for (let i = 0; i < outOfStock.length; i++) {
        setSizeDisable((sizeData) => ({ ...sizeData, [outOfStock[i]]: true }))
    }
}

const Product = ({ product }) => {
    const { id, title, price, info, description, img, variants } = product;
    const colors = [...new Set(variants?.map(variant => variant.color_num))];
    const sizes = [...new Set(variants?.map(variant => variant.size))];

    const [sizeDisable, setSizeDisable] = useState({
        S: false,
        M: false,
        L: false,
        F: false,
    })
    const [colorData, setcolorData] = useState("");
    const [colorName, setColorName] = useState("");
    const [sizeData, setSizeData] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [maxQuantity, setMaxQuantity] = useState(1);
    const [cart, setCart] = useState(localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []);

    function addItem() {
        if (colorData === "" || sizeData === "") {
            return toast.warning("請選擇顏色和尺寸!", {
                position: "top-center"
            })
        }
        const newItem = {
            id: v4(),
            productId: id,
            img: img,
            title: title,
            price: price,
            color: colorName,
            size: sizeData,
            quantity: quantity,
            stock: maxQuantity
        }
        let cartCopy = [...cart];
        let existingItem = cartCopy.find(cartItem => cartItem.productId === id && cartItem.size === newItem.size && cartItem.color === newItem.color);
        if (existingItem) {
            existingItem.quantity += newItem.quantity;
        } else {
            cartCopy.push(newItem);
        }
        toast.success("已加入購物車!", {
            position: "top-center"
        })
        setCart(cartCopy);
        localStorage.setItem("cart", JSON.stringify(cartCopy));
        window.dispatchEvent(new Event("storage"));
    }

    return (
        <div className="product-details-container">
            <div className="product-details">
                <img src={img} alt='product' />
                <div className="detail">
                    <div className="detail-title">{title}</div>
                    <div className="detail-id">{id}</div>
                    <div className="detail-price">TWD.{price}</div>
                    <div className="options">
                        <div className="variant">
                            <label>顏色</label>
                            {colors.map(color => {
                                return (
                                    <label key={color} className="color-group">
                                        <input
                                            type="radio"
                                            onChange={() => disableSize(color, variants, setcolorData, setSizeData, setSizeDisable)}
                                            checked={colorData === color}
                                        />
                                        <span className="detail-color" style={{ backgroundColor: color }}></span>
                                    </label>
                                )
                            })}
                        </div>
                        <div className="variant">
                            <label>尺寸</label>
                            {sizes.map(size => {
                                return (
                                    <label key={size} className="size-group">
                                        <input
                                            type="radio"
                                            disabled={sizeDisable[size]}
                                            onChange={() => setMax(size, colorData, variants, setColorName, setSizeData, setMaxQuantity)}
                                            checked={sizeData === size}
                                        />
                                        <span className="size">{size}</span>
                                    </label>
                                )
                            })}
                        </div>
                        <div className="variant">
                            <label className="quantity-text">數量</label>
                            <div className="quantity-add">
                                <span className="icon-minus" onClick={() => minus(setQuantity)}>-</span>
                                <span className="quantity-value">{quantity}</span>
                                <span className="icon-plus" onClick={() => plus(setQuantity, maxQuantity)}>+</span>
                            </div>
                        </div>
                        <button className="btn-sumbit" onClick={() => addItem()}>加入購物車</button>
                    </div>
                    <div className="detail-info">{info}</div>
                </div>
            </div>
            <div className="detail-descripton">
                <div className="splitter">
                    <label>更多產品資訊</label>
                </div>
                <div className="discription-text">{description}</div>
                <div className="discription-img">
                    <img src={info1} alt='more product pic' />
                    <img src={info2} alt='more product pic' />
                </div>
            </div>
        </div>
    )
}

export default Product