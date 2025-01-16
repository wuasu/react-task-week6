/* eslint-disable no-unused-vars */

import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

function App() {
  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example",
  });

  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const [modalStatus, setModalStatus] = useState(null);

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
  const productModalRef = useRef(null);
  const delProductModalRef = useRef(null);

  const handleChange = (e) => {
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

        getProducts();

        setIsAuth(true);
      })
      .catch((error) => {
        alert(error + "登入失敗");
      });
  };

  const getProducts = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products`
      );
      setProducts(res.data.products);
    } catch (error) {
      alert("取得產品失敗");
    }
  }, [BASE_URL, API_PATH]);

  const checkUserLogin = useCallback(async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`);
      getProducts();
      setIsAuth(true);
    } catch (error) {
      console.error(error);
    }
  }, [BASE_URL, getProducts]);

  useEffect(() => {
    const token = document.cookie.replace(
      // eslint-disable-next-line no-useless-escape
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    checkUserLogin();
  }, [checkUserLogin]);

  useEffect(() => {
    //建立 Modal 實例
    new Modal(productModalRef.current, {
      backdrop: true,
    });

    new Modal(delProductModalRef.current, {
      backdrop: true,
    });
  }, []);

  //打開Modal
  const handleOpenProductModal = (status, product) => {
    setModalStatus(status);
    //判斷是新增還是編輯
    if (status === "add") {
      setRowProduct(defaultModalState);
    } else {
      setRowProduct(product);
    }

    //取得實例
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  //關閉新增Modal
  const handleCloseProductModal = () => {
    //取得實例
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const handleOpenDelProductModal = (product) => {
    setRowProduct(product);
    //取得實例
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.show();
  };

  const handleCloseDelProductModal = () => {
    //取得實例
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
  };

  const handleModalInputChange = (e) => {
    const { value, name, checked, type } = e.target;
    setRowProduct({
      ...rowProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  //編輯副圖欄位
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const subImages = [...rowProduct.imagesUrl];
    subImages[index] = value;

    setRowProduct({
      ...rowProduct,
      imagesUrl: subImages,
    });
  };

  //新增附圖
  const addImage = () => {
    const newImage = [...rowProduct.imagesUrl, ""];
    setRowProduct({
      ...rowProduct,
      imagesUrl: newImage,
    });
  };

  //刪除附圖
  const delImage = () => {
    const subImages = [...rowProduct.imagesUrl];
    subImages.pop(); //移除最後一張圖
    setRowProduct({
      ...rowProduct,
      imagesUrl: subImages,
    });
  };

  //新增產品
  const createProduct = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
        data: {
          ...rowProduct,
          origin_price: Number(rowProduct.origin_price),
          price: Number(rowProduct.price),
          is_enabled: rowProduct.is_enabled ? 1 : 0,
        },
      });
    } catch (error) {
      alert("新增產品失敗");
    }
  };

  //編輯產品
  const editProduct = async () => {
    try {
      await axios.put(
        `${BASE_URL}/v2/api/${API_PATH}/admin/product/${rowProduct.id}`,
        {
          data: {
            ...rowProduct,
            origin_price: Number(rowProduct.origin_price),
            price: Number(rowProduct.price),
            is_enabled: rowProduct.is_enabled ? 1 : 0,
          },
        }
      );
    } catch (error) {
      alert("編輯產品失敗");
    }
  };

  //刪除產品
  const delProduct = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/v2/api/${API_PATH}/admin/product/${rowProduct.id}`,
        {
          data: {
            ...rowProduct,
            origin_price: Number(rowProduct.origin_price),
            price: Number(rowProduct.price),
            is_enabled: rowProduct.is_enabled ? 1 : 0,
          },
        }
      );
    } catch (error) {
      alert("刪除產品失敗");
    }
  };

  //確定btn
  const updateProduct = async () => {
    const apiCall = modalStatus === "add" ? createProduct : editProduct;
    try {
      await apiCall();
      getProducts();
      handleCloseProductModal();
    } catch (error) {
      alert("更新產品失敗");
    }
  };


  const handleDeleteProduct = async () => {
    try {
      await delProduct();
      getProducts();
      handleCloseDelProductModal();
    } catch (error) {
      alert("刪除產品失敗");
    }
    
  }

  return (
    <>
      {isAuth ? (
        <div className="container py-5">
          <div className="row">
            <div className="col">
              <div className="d-flex justify-content-between">
                <h2>產品列表</h2>
                <button
                  onClick={() => {
                    handleOpenProductModal("add");
                  }}
                  type="button"
                  className="btn btn-primary"
                >
                  建立新的產品
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((row) => (
                    <tr key={row.id}>
                      <th scope="row">{row.title}</th>
                      <td>{row.origin_price}</td>
                      <td>{row.price}</td>
                      <td>{row.is_enabled ? "啟用" : "未啟用"}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            onClick={() => {
                              handleOpenProductModal("edit", row);
                            }}
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => handleOpenDelProductModal(row)}
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
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
                onChange={handleChange}
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
                onChange={handleChange}
                name="password"
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary">登入</button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}

      {/********  新增編輯modal ********/}
      <div
        ref={productModalRef}
        id="productModal"
        className="modal"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">
                {modalStatus === "add" ? "新增產品" : "編輯產品"}
              </h5>
              <button
                onClick={handleCloseProductModal}
                type="button"
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        value={rowProduct.imageUrl}
                        onChange={handleModalInputChange}
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img
                      src={rowProduct.imageUrl}
                      alt={rowProduct.title}
                      className="img-fluid"
                    />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {rowProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => {
                            handleImageChange(e, index);
                          }}
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}
                    <div className="btn-group w-100">
                      {rowProduct.imagesUrl.length < 5 &&
                        rowProduct.imagesUrl[
                          rowProduct.imagesUrl.length - 1
                        ] !== "" && (
                          <button
                            onClick={addImage}
                            className="btn btn-outline-primary btn-sm w-100"
                          >
                            新增圖片
                          </button>
                        )}

                      {rowProduct.imagesUrl.length > 1 && (
                        <button
                          onClick={delImage}
                          className="btn btn-outline-danger btn-sm w-100"
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      value={rowProduct.title}
                      onChange={handleModalInputChange}
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      value={rowProduct.category}
                      onChange={handleModalInputChange}
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={rowProduct.unit}
                      onChange={handleModalInputChange}
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={rowProduct.origin_price}
                        onChange={handleModalInputChange}
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        value={rowProduct.price}
                        onChange={handleModalInputChange}
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={rowProduct.description}
                      onChange={handleModalInputChange}
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      value={rowProduct.content}
                      onChange={handleModalInputChange}
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      checked={rowProduct.is_enabled}
                      onChange={handleModalInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                onClick={handleCloseProductModal}
                type="button"
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={updateProduct}
                type="button"
                className="btn btn-primary"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>

      {/********  刪除modal ********/}
      <div
        ref={delProductModalRef}
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                onClick={handleCloseDelProductModal}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除
              <span className="text-danger fw-bold">{rowProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleCloseDelProductModal}
                type="button"
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handleDeleteProduct}
                type="button"
                className="btn btn-danger"
              >
                確定刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
