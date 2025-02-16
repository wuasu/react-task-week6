/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import ReactLoading from "react-loading";
import { Link } from "react-router-dom";

function ProductsPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const [modalStatus, setModalStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  // 分頁
  const [pageInfo, setPageInfo] = useState({});
  const [page, setPage] = useState(1);

  //欄位預設值
  const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""],
  };

  const [rowProduct, setRowProduct] = useState(defaultModalState);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

  const getProducts = useCallback(
    async (page = 1) => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
        );
        setProducts(res.data.products);
        setPageInfo(res.data.pagination);
      } catch (error) {
        // alert("取得產品失敗");
      }
    },
    [BASE_URL, API_PATH]
  );

  const addCartItem = async (product_id, qty) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty), //記得轉數字
        },
      });

      // console.log("加入購物車成功:", response.data);
    } catch (error) {
      alert("加入購物車失敗");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      setIsScreenLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        alert("取得產品失敗");
      } finally {
        setIsScreenLoading(false);
      }
    };
    getProducts();
  }, []);

  const handlePageChange = async (page) => {
    setPage(page);
    await getProducts(page);
  };

  //打開Modal
  const handleOpenProductModal = (status, product) => {
    setModalStatus(status);
    //判斷是新增還是編輯
    if (status === "add") {
      setRowProduct(defaultModalState);
    } else {
      setRowProduct(product);
    }
    setIsProductModalOpen(true);
  };

  //打開刪除Modal
  const handleOpenDelProductModal = (product) => {
    setRowProduct(product);
    setIsDelProductModalOpen(true);
  };

  return (
    <>
      <div className="container">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ width: "200px" }}>
                  <img
                    className="img-fluid"
                    src={product.imageUrl}
                    alt={product.title}
                  />
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價 {product.origin_price} 元</del>
                  <div className="h5">特價 {product.price}元</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <Link
                      to={`/products/${product.id}`}
                      className="btn btn-outline-secondary"
                    >
                      查看更多
                    </Link>
                    <button
                      disabled={isLoading}
                      onClick={() => {
                        addCartItem(product.id, 1);
                      }}
                      type="button"
                      className="btn btn-outline-danger d-flex align-items-center gap-2"
                    >
                      加到購物車
                      {isLoading && (
                        <ReactLoading
                          type={"spin"}
                          color={"#000"}
                          height={"1.5rem"}
                          width={"1.5rem"}
                        />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isScreenLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            zIndex: 999,
          }}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
    </>
  );
}
ProductsPage.propTypes = {
  setIsAuth: PropTypes.func,
};
export default ProductsPage;
