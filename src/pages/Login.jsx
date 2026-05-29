import { useState } from "react";
import API from "../api";

function Login() {
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const login = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await API.post("/Auth/login", loginData);

            localStorage.setItem("token", response.data.token);

            window.location.href = "/employees";
        } catch (error) {
            alert("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>Employee Management</h1>
                    <p>Professional Admin Portal</p>
                </div>

                <form onSubmit={login} className="login-form">
                    <div className="input-group">
                        <label>Username</label>

                        <input
                            type="text"
                            placeholder="Enter username"
                            value={loginData.username}
                            onChange={(e) =>
                                setLoginData({
                                    ...loginData,
                                    username: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={loginData.password}
                            onChange={(e) =>
                                setLoginData({
                                    ...loginData,
                                    password: e.target.value,
                                })
                            }
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;