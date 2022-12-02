import { useLocation, useNavigate } from 'react-router-dom';
const Thankyou = () => {
    const location = useLocation();
    const navigate = useNavigate();
    function toHomePage(){
        navigate('/');
    }        
    return (
        <div className="thank-container">
            <div className="icon-check"></div>
            <div className="thank-info">
                <h3>感謝您的購買</h3>
                <div>已收到您的訂單，訂單編號
                    <span className='orderId'>{location.state.orderId}</span>號!
                </div>
            </div>
            <button className="btn-back" onClick={()=>{toHomePage()}}>回到首頁</button>
        </div>
    )
}

export default Thankyou