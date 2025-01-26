import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types"; 


const BASE_URL = import.meta.env.VITE_BASE_URL;
function LoginPage(props) {

  const [account, setAccount] = useState({
    username: "@gmail.com",
    password: "",
  });
  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAccount({ ...account, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/v2/admin/signin`, account)
      .then((res) => {
        const { token, expired } = res.data;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        axios.defaults.headers.common["Authorization"] = token;

        //props.getProducts();

        props.setIsAuth(true);
      })
      .catch((error) => {
        alert(error + "登入失敗");
      });
  };
    
    //   const checkUserLogin = useCallback(async () => {
    //     try {
    //       await axios.post(`${BASE_URL}/v2/api/user/check`);
    //       props.getProducts();
    //       props.setIsAuth(true);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    //   }, [BASE_URL, props.getProducts]);

    //   useEffect(() => {
    //     const token = document.cookie.replace(
    //       // eslint-disable-next-line no-useless-escape
    //       /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
    //       "$1"
    //     );
    //     axios.defaults.headers.common["Authorization"] = token;
    //     checkUserLogin();
    //   }, [checkUserLogin]);


  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">請先登入</h1>
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input
            defaultValue={account.username}
            type="email"
            className="form-control"
            id="username"
            placeholder="name@example.com"
            onChange={handleInputChange}
            name="username"
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            defaultValue={account.password}
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            onChange={handleInputChange}
            name="password"
          />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary">登入</button>
      </form>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
}

LoginPage.propTypes = {
 // getProducts: PropTypes.func.isRequired,
  setIsAuth: PropTypes.func,
};

export default LoginPage;
