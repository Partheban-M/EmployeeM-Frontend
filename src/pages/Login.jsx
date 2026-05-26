import { useState } from "react";
import API from "../api";

function Login() {
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const login = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post("/Auth/login", loginData);

            console.log(response.data);

            localStorage.setItem("token", response.data.token);

            window.location.href = "/employees";
        } catch (error) {
            console.log(error);
            alert("Login failed. Check username/password or backend.");
        }
    };
    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={login}>
                <input
                    type="text"
                    placeholder="Username"
                    value={loginData.username}
                    onChange={(e) =>
                        setLoginData({ ...loginData, username: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                    }
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;