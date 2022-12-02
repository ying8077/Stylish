import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Profile = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('user')
        }
    }

    useEffect(() => {
        fetch('https://stylish-yjing.tk/api/users/profile', config)
            .then(res => res.json())
            .then(data => {
                if (data.status !== "error") {
                    setUserName(data.user_name);
                    setEmail(data.email);
                } else {
                    toast.warning(data.message, { position: "top-center" });
                }
            })
    }, [])

    function onSubmit() {
        toast.success("已登出", { position: "top-center" });
        localStorage.removeItem("user");
        navigate('/');
    }

    return (
        <div className="profile-container">
            <h3>個人資料</h3>
            <div className="profile">
                <div className="profile-name">
                    <label>名稱</label>
                    <span>{userName}</span>
                </div>
                <div className="profile-email">
                    <label>信箱</label>
                    <span>{email}</span>
                </div>
            </div>
            <button className="btn-logOut" onClick={onSubmit}>登出</button>
        </div>
    )
}

export default Profile