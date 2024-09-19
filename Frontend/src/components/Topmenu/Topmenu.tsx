import React, { FC, useState } from "react";
import globus from "../../image/Globus.png";
import logining from "../../image/autor.png";
import logo_autor from "../../image/autorisation_mage.png";
import "./Topmenu.css";

interface TopmenuProps {}

const Topmenu: FC<TopmenuProps> = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            nickname.length == 0 ||
            password.length == 0 ||
            (!isLogin && email.length == 0)
        ) {
            return;
        }

        if (isLogin) await sendLoginRequest(nickname, password);
        else await sendRegisterRequest(email, nickname, password);
    };

    const sendLoginRequest = async (nickname: string, password: string) => {
        const response = await fetch("https://localhost:7101/api/Auth/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Username: nickname, Password: password })
        });
        const data = await response.json();

        if (!response.ok) {
            alert("Error occurred!");
            return;
        }

        handleCloseModal();
        localStorage.setItem("token", data.token);

        alert("Logged in successfully!");

        setEmail("");
        setNickname("");
        setPassword("");
    };

    const sendRegisterRequest = async (
        email: string,
        nickname: string,
        password: string
    ) => {
        const response = await fetch(
            "https://localhost:7101/api/Auth/register",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Email: email,
                    Username: nickname,
                    Password: password
                })
            }
        );

        if (response.ok) {
            alert("User was registered successfully!");
            setIsLogin(true);
            setEmail("");
            setNickname("");
            setPassword("");
            return;
        }

        alert("Error occurred!");
    };

    return (
        <div className="centralB">
            <div className="imagesdiv">
                <img src={globus} className="item" alt="Globus" />
                <h3 className="footer-logo">
                    <span className="highlight">News</span>
                </h3>
                <img
                    src={logining}
                    className="item"
                    alt="Login"
                    onClick={handleOpenModal}
                />
            </div>

            <div className="stroke"></div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span
                            className="close-button"
                            onClick={handleCloseModal}>
                            &times;
                        </span>

                        <img
                            src={logo_autor}
                            alt="Logo"
                            className="modal-logo"
                        />

                        <form onSubmit={handleLoginSubmit}>
                            {!isLogin && (
                                <input
                                    type="email"
                                    className="modal-input"
                                    placeholder="Введите адрес електронной почты"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            )}
                            <input
                                type="text"
                                className="modal-input"
                                placeholder="Введите имя пользователя"
                                value={nickname}
                                onChange={e => setNickname(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className="modal-input"
                                placeholder="Введите пароль"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />

                            <button type="submit" className="modal-button">
                                {isLogin ? "Login" : "Register"}
                            </button>
                            <p
                                className="toggle-status"
                                onClick={() => setIsLogin(x => !x)}>
                                {isLogin
                                    ? "I don't have an account"
                                    : "Back to login"}
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Topmenu;
