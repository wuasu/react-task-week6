/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { useState, useRef, useEffect, useCallback } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import Pagination from "../components/Pagination";
import ProductModal from "../components/ProductModal";

function ProductPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const delProductModalRef = useRef(null);

  const [modalStatus, setModalStatus] = useState(null);
  const [products, setProducts] = useState([]);
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

  const getProducts = useCallback(
    async (page = 1) => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
        );
        setProducts(res.data.products);
        setPageInfo(res.data.pagination);
      } catch (error) {
        alert("取得產品失敗");
      }
    },
    [BASE_URL, API_PATH]
  );

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
    //取得實例
    //   const modalInstance = Modal.getInstance(productModalRef.current);
    //   modalInstance.show();
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

  //刪除產品
  const delProduct = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/v2/api/${API_PATH}/admin/product/${rowProduct.id}`
      );
    } catch (error) {
      alert("刪除產品失敗");
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
  };

  return (
    <>
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
                    <td>
                      {row.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
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
        {/* 分頁 */}
        <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
      </div>
      {/********  新增編輯modal ********/}
      <ProductModal
        modalStatus={modalStatus}
        rowProduct={rowProduct}
        getProducts={getProducts}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
      />
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
  ProductPage.propTypes = {
    // products: PropTypes.array,
    // handleOpenDelProductModal: PropTypes.func,
    // getProducts: PropTypes.func,
    //pageInfo: PropTypes.object,
    setIsAuth: PropTypes.func,
  };
export default ProductPage;
