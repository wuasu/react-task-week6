/* eslint-disable no-unused-vars */

import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProdustPage";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

 
  // 分頁
  // const [pageInfo, setPageInfo] = useState({});
  // const [page, setPage] = useState(1);
 

  return (
    <>
      {isAuth ? (
        <ProductPage
          setIsAuth={setIsAuth}
        />
      ) : (
          <LoginPage
            setIsAuth={setIsAuth}
          />
      )}
    </>
  );
}

export default App;
