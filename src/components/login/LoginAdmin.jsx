import {useContext, useEffect, useState} from "react";
import "./style.scss";
import axios from "axios";
import {MyContext} from "../App/App";
import {useNavigate} from "react-router-dom";
import {useOnKeyPress} from "./useOnKeyPress";

const LoginAdmin = () => {
    let value = useContext(MyContext);
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const HandleLogin = () => {
        if (phone.trim().length > 0 && password.trim().length > 0) {
            let user = {
                username: phone,
                password
            };
            axios.post(`${value.url}/dashboard/login/`, user).then((response) => {
                localStorage.setItem("admin", response.data.user)
                localStorage.setItem("token", response.data.token);
                window.location.pathname = '/';
                localStorage.setItem("lng", "uz")
            }).catch((error) => {
                if (error.response.status === 404 || error.response.status === 400) {
                    setError(true)
                }
            });

        } else alert("Formani to'ldiring")

    };

    const Clear = () => {
        setPhone("");
        setPassword("");
    };

    useOnKeyPress(HandleLogin, 'Enter');
    useOnKeyPress(Clear, 'Delete');

    return <div className="login-container">

        <div className="login-card">
            <div className="logo">
                <img src="./images/logo1.png" alt=""/>
            </div>
            <div className="error">
                {error && "Login yoki parol xato"}
            </div>
            <div className="input_box">
                <input value={phone} onChange={(e) => {
                    setPhone(e.target.value)
                    setError(false)
                }} placeholder="Username" type="text"/>
                <input value={password} onChange={(e) => {
                    setPassword(e.target.value)
                    setError(false)
                }} placeholder="Password"
                       type="password"/>
            </div>

            <div onClick={HandleLogin} onKeyUp={() => console.log("enter")} className="btn-login">
                Kirish
            </div>
        </div>
    </div>
};

export default LoginAdmin;