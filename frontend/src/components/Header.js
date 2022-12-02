import { useState } from "react";
import { useNavigate } from "react-router";


function handleKeyDown(e,keyword){
    if (e.key === 'Enter' && keyword!=="") {
        window.location.replace(`/?keyword=${keyword}`);
    }
}

const Header = () => {
    const [quantity, setQuantity] = useState(getQuantity());
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    function keywordChange(e){
        setKeyword(e.target.value);
        localStorage.getItem('user');
    }

    function getQuantity(){
        const cart = localStorage.getItem("cart");
        return cart ? JSON.parse(cart).length : 0
    }

    function navigateMember(){
        if(localStorage.getItem('user') !== null){
            navigate('/profile');
        }else{
            navigate('/signIn');
        }
    }

    window.addEventListener('storage', () => {
        setQuantity(getQuantity());
    })

    return <header>
        <a href="/" className="logo"> </a>
        <div className="category">
            <a className="category-women" href="/?category=women">
                <label>女裝</label>
            </a>
            <a className="category-men" href="/?category=men">
                <label>男裝</label>
            </a>
            <a className="category-accessories" href="/?category=accessories">
                <label>配件</label>
            </a>
        </div>
        <div className="header-right">
            <div className="search">
                <input type="checkbox" id="control-search" />
                <label htmlFor="control-search" className="icon-search img"></label>
                <input type="search" onChange={keywordChange} onKeyDown={(e) => handleKeyDown(e,keyword)}/>
            </div>
            <div className="tab">
                <a href="/cart" className="tab-item">
                    <div className="cart">
                        <div className="icon-cart img"></div>
                        {quantity > 0 ? (<div className="cart-quantity">{quantity}</div>) : ('')}
                    </div>
                    <label>購物車</label>
                </a>
                <button className="tab-item" onClick={navigateMember}>
                    <div className="icon-profile img"></div>
                    <label>會員</label>
                </button>
            </div>
        </div>
    </header>
}

export default Header