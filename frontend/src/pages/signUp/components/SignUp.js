import { useState } from "react";
import { useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";

const SignUp = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        userName: "",
        email: "",
        password: ""
    });

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    function onSubmit(event){
        event.preventDefault();
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                "userName": values.userName,
                "email": values.email,
                "password": values.password
            })
        }
        fetch('https://stylish-yjing.tk/api/users', config)
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    toast.success("註冊成功", { position: "top-center" });
                    navigate('/signIn');
                }else{
                    toast.warning(data.message, { position: "top-center" });
                }
            })
    }

    return (
        <div className="register">
            <h3>註冊</h3>
            <form>
                <input type="text" className="form-control" placeholder="姓名" name="userName" onChange={onChange} />
                <input type="text" className="form-control" placeholder="信箱" name="email" onChange={onChange} />
                <input type="password" className="form-control" placeholder="密碼" name="password" onChange={onChange} />
                <div className="d-grid col-12">
                    <input type="submit" value="submit" className="btn btn-default btn-success" onClick={onSubmit}/>
                </div>
            </form>
        </div>
    )
}

export default SignUp