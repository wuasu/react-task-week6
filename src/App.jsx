/* eslint-disable no-unused-vars */

import {useState} from "react";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProdustPage";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <>
      {isAuth ? (
        <ProductPage setIsAuth={setIsAuth} />
      ) : (
          <LoginPage setIsAuth={setIsAuth} />
      )}
    </>
  );
}

export default App;
