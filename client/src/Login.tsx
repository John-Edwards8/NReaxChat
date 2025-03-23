import "./Login.css";

const Login = ({setToken} : any) => {
    return (
        <div className="login-card">
            <div className="card-header">
                <div className="log">Login</div>
            </div>
            <form>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input required name="username" id="username" type="text" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input required name="password" id="password" type="password" />
                </div>
                <div className="form-group">
                    <input value="Login" type="submit" />
                </div>
            </form>
        </div>
    );
}

export default Login