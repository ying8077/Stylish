import { useState, useRef } from "react";
import Input from "../../../components/Input";
import PaymentInfo from "./PaymentInfo";

const OrderInfo = ({ total }) => {
    const validRef = useRef([]);
    const [values, setValues] = useState({
        receiverName: "",
        phone: "",
        email: "",
        address: "",
        deliver: "X"
    });

    const inputs = [
        {
            id: 0,
            label: "收件者姓名",
            name: "receiverName",
            type: "text",
            errorMessage: "必填",
            required: true,
        },
        {
            id: 1,
            label: "電話",
            name: "phone",
            type: "text",
            errorMessage: "電話不符合格式",
            pattern: `((?=(09))[0-9]{10})$`,
            required: true,
        },
        {
            id: 2,
            label: "Email",
            name: "email",
            type: "email",
            errorMessage: "email不符合格式",
            required: true,
        },
        {
            id: 3,
            label: "地址",
            name: "address",
            type: "text",
            errorMessage: "必填",
            required: true,
        }
    ];

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    function checkValid() {
        let result = true;
        for (let i = 0; i < inputs.length; i++) {
            if (validRef.current[i].checkValidity() === false) {
                return result = false;
            }
        }
        return result
    }

    return (
        <>
            <div className="order-container">
                <h5>訂購資料</h5>
                {inputs.map((input) => (
                    <Input
                        key={input.id}
                        {...input}
                        onChange={onChange}
                        forwordref={validRef}
                    />
                ))}
                <div className="ipt-group radio">
                    <label>配送時間</label>
                    <div className="radio-group">
                        <label><input type="radio" name="deliver" value="8-12" onChange={onChange} checked={values.deliver === "8-12"} />08:00-12:00</label>
                        <label><input type="radio" name="deliver" value="14-18" onChange={onChange} checked={values.deliver === "14-18"} />14:00-18:00</label>
                        <label><input type="radio" name="deliver" value="X" onChange={onChange} checked={values.deliver === "X"} />不指定</label>
                    </div>
                </div>
            </div>
            <PaymentInfo 
                order={values} 
                checkValid={checkValid} 
                total={total}
            />
        </>
    )
}

export default OrderInfo