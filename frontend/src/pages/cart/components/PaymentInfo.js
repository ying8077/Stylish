import { useState, useEffect, useRef } from "react";
import { useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios';

function getTPDirect() {
    return new Promise((resolve, reject) => {
        if (typeof window.TPDirect !== 'undefined') {
            return resolve(window.TPDirect)
        } else {
            const script = window.document.createElement('script');
            script.src = "https://js.tappaysdk.com/tpdirect/v5.7.0";
            script.async = true;
            script.onload = () => {
                if (typeof window.TPDirect !== 'undefined') {
                    resolve(window.TPDirect);
                } else {
                    reject(new Error('failed to load TapPay sdk'));
                }
            }
            script.onerror = reject;
            window.document.body.appendChild(script);
        }
    })
}

const PaymentInfo = ({ order, checkValid, total }) => {
    const APP_ID = 125964;
    const APP_KEY = 'app_pXwRaAixl344j3LDgX9moNo4pF0zzbkmsbQQbPgiurjG46muyuxo4xO86WxC';
    const [submitDisable, setSubmitDisable] = useState(true);
    const inputNumber = useRef([]);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        getTPDirect().then((TPDirect) => {
            TPDirect.setupSDK(APP_ID, APP_KEY, 'sandbox');
            TPDirect.card.setup({
                fields: {
                    number: {
                        element: inputNumber.current[0],
                        placeholder: '**** **** **** ****'
                    },
                    expirationDate: {
                        element: inputNumber.current[1],
                        placeholder: 'MM / YY'
                    },
                    ccv: {
                        element: inputNumber.current[2],
                        placeholder: '後三碼'
                    }
                },
                styles: {
                    'input': {
                        'color': '#D3D3D3',
                        'font-size': '16px',
                        'line-height': '32px'
                    },
                    ':focus': {
                        'color': 'black'
                    },
                    '.valid': {
                        'color': 'green'
                    },
                    '.invalid': {
                        'color': 'red'
                    }
                },
                isMaskCreditCardNumber: true,
                maskCreditCardNumberRange: {
                    beginIndex: 6,
                    endIndex: 11
                }
            })

            TPDirect.card.onUpdate(update => {
                update.canGetPrime ? setSubmitDisable(false) : setSubmitDisable(true);
            })
        })
    }, []);

    function onSubmit(event) {
        event.preventDefault();
        if (checkValid() === false) {
            return toast.warning("請完成訂購資料填寫!", {
                position: "top-center"
            })
        }
        getTPDirect().then((TPDirect) => {
            const tappayStatus = TPDirect.card.getTappayFieldsStatus()
            if (tappayStatus.canGetPrime === false) {
                return alert('can not get prime');
            }

            TPDirect.card.getPrime((result) => {
                if (result.status !== 0) {
                    return alert(`get prime error ${result.msg}`);
                }

                const config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('user')
                    },

                    body: JSON.stringify({
                        "prime": result.card.prime,
                        "details": "TapPay Test",
                        "amount": total,
                        "phone_number": order.phone,
                        "name": order.receiverName,
                        "email": order.email,
                        "address": order.address,
                        "deliver_time": order.deliver
                    })
                }
                fetch('https://stylish-yjing.tk/api/orders/pay-by-prime', config)
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === "success") {
                            navigate('/thanks', { state: { orderId: data.orderId } });
                            localStorage.removeItem('cart');
                        }else if(data.code === 401){
                            toast.warning("請先登入!", { position: "top-center" })
                            navigate('/signIn');
                        }
                        else{
                            return toast.warning("付款失敗!", { position: "top-center" })
                        }
                    })
            })
        })

    }

    return (
        <div id="cardview-container" className="cardview-container">
            <h5>付款資料</h5>
            <div className="ipt-group">
                <label htmlFor="card-number">卡號</label>
                <div className="tpfield" ref={el => (inputNumber.current[0] = el)}></div>
            </div>
            <div className="ipt-group">
                <label htmlFor="card-expiration-date">卡片到期日</label>
                <div className="tpfield" ref={el => (inputNumber.current[1] = el)}></div>
            </div>
            <div className="ipt-group">
                <label htmlFor="card-ccv">後三碼</label>
                <div className="tpfield" ref={el => (inputNumber.current[2] = el)}></div>
            </div>
            <div className="side-container">
                <div className="side-row">
                    <label>總金額</label>
                    <label className="dollar-sign">NT.</label>
                    <span id="total-amount" className="dollar-value">{total}</span>
                </div>
                <div className="side-row ship">
                    <label>運費</label>
                    <label className="dollar-sign">NT.</label>
                    <span className="dollar-value">30</span>
                </div>
                <div className="side-row">
                    <label>應付金額</label>
                    <label className="dollar-sign">NT.</label>
                    <span className="dollar-value">{total + 30}</span>
                </div>
            </div>
            <button className="btn-pay" disabled={submitDisable} onClick={onSubmit}>確認付款</button>
        </div>
    )
}

export default PaymentInfo