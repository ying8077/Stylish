import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const SignIn = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    function onSubmit(event) {
        event.preventDefault();
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                "email": values.email,
                "password": values.password
            })
        }
        fetch('https://stylish-yjing.tk/api/users/login', config)
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    toast.success("登入成功", { position: "top-center" });
                    localStorage.setItem('user', data.token);
                    navigate('/profile');
                } else {
                    toast.warning(data.message, { position: "top-center" });
                }
            })
    }

    return (
        <div className="login">
            <div className="header">
                <h3>登入</h3>
                <a href="/signUp">註冊新帳號</a>
            </div>
            <form action="/users/login" method="post">
                <input type="text" className="form-control" placeholder="信箱" name="email" onChange={onChange} />
                <input type="password" className="form-control" placeholder="密碼" name="password" onChange={onChange} />
                <div className="d-grid col-12">
                    <input type="submit" value="submit" className="btn btn-default btn-success" onClick={onSubmit} />
                </div>
            </form>
            <div className="d-grid col-12">
                <a href="http://localhost:8000/api/users/auth/facebook" className="btn btn-primary">Sign in with Facebook</a>
            </div>
        </div>
    )
}

export default SignIn