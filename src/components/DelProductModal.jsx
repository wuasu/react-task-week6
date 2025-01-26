/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { useRef, useEffect } from "react";
import { Modal } from "bootstrap";
import axios from "axios";

function DelProductModal({
  rowProduct,
  getProducts,
  isOpen,
  setIsOpen,
}) {
     const BASE_URL = import.meta.env.VITE_BASE_URL;
     const API_PATH = import.meta.env.VITE_API_PATH;
      const delProductModalRef = useRef(null);
     
    
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
    
    //關閉刪除視窗
    const handleCloseDelProductModal = () => {
     //取得實例
        const modalInstance = Modal.getInstance(delProductModalRef.current);
        modalInstance.hide();
        setIsOpen(false);
    };
    
    useEffect(() => {
          getProducts();
        //建立 Modal 實例
        new Modal(delProductModalRef.current, {
          backdrop: true,
        });
    }, []);
    
    useEffect(() => {
      if (isOpen) {
        const modalInstance = Modal.getInstance(delProductModalRef.current);
        if (modalInstance) {
          modalInstance.show();
        }
      }
    }, [isOpen]);

  return (
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
  );
}

DelProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  getProducts: PropTypes.func.isRequired,
  rowProduct: PropTypes.object.isRequired,
};
export default DelProductModal;
