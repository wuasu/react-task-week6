/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { useState, useRef, useEffect, useCallback } from "react";
import { Modal } from "bootstrap";
import axios from "axios";

function ProductModal({
  modalStatus,
  rowProduct,
  getProducts,
  isOpen,
  setIsOpen,
}) {
  const [modalData, setModalData] = useState(rowProduct);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;
  const productModalRef = useRef(null);
  const [fileInputValue, setFileInputValue] = useState(""); //上傳圖片input

  //關閉新增Modal
  const handleCloseProductModal = () => {
    //取得實例
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
    setIsOpen(false);
    setFileInputValue(""); // 清空 上傳圖片input 的值
  };

  useEffect(() => {
    setModalData({
      ...rowProduct,
    });
  }, [rowProduct]);


  useEffect(() => {
    //取得產品列表
    getProducts();
    //建立 Modal 實例
    new Modal(productModalRef.current, {
      backdrop: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    
useEffect(() => {
  if (isOpen) {
    const modalInstance = Modal.getInstance(productModalRef.current);
    if (modalInstance) {
      modalInstance.show();
    }
  }
}, [isOpen]);


  const handleModalInputChange = (e) => {
    const { value, name, checked, type } = e.target;
    setModalData({
      ...modalData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  //編輯副圖欄位
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const subImages = [...modalData.imagesUrl];
    subImages[index] = value;

    setModalData({
      ...modalData,
      imagesUrl: subImages,
    });
  };

  //新增附圖
  const addImage = () => {
    const newImage = [...modalData.imagesUrl, ""];
    setModalData({
      ...modalData,
      imagesUrl: newImage,
    });
  };

  //刪除附圖
  const delImage = () => {
    const subImages = [...modalData.imagesUrl];
    subImages.pop(); //移除最後一張圖
    setModalData({
      ...modalData,
      imagesUrl: subImages,
    });
  };

  // 新增產品(不在這裡catch error)
  const createProduct = async () => {
    await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
      data: {
        ...modalData,
        origin_price: Number(modalData.origin_price),
        price: Number(modalData.price),
        is_enabled: modalData.is_enabled ? 1 : 0,
      },
    });
  };

  // 編輯產品(不在這裡catch error)
  const editProduct = async () => {
    await axios.put(
      `${BASE_URL}/v2/api/${API_PATH}/admin/product/${modalData.id}`,
      {
        data: {
          ...modalData,
          origin_price: Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0,
        },
      }
    );
  };

  // 確定btn
  const updateProduct = async () => {
    const apiCall = modalStatus === "add" ? createProduct : editProduct;
    try {
      await apiCall();
      getProducts();
      handleCloseProductModal();
    } catch (error) {
      //失敗的話不關掉modal
      if (modalStatus === "add") {
        alert("新增產品失敗");
      } else if (modalStatus === "edit") {
        alert("編輯產品失敗");
      }
    }
  };

  // 上傳圖片
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file-to-upload", file);
    try {
      const res = await axios.post(
        `${BASE_URL}/v2/api/${API_PATH}/admin/upload`,
        formData
      );
      const uploadedimageUrl = res.data.imageUrl;
      setModalData({
        ...modalData,
        imageUrl: uploadedimageUrl,
      });
    } catch (error) {
      alert("上傳圖片失敗");
    }
  };

  return (
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
                  <div className="mb-5">
                    <label htmlFor="fileInput" className="form-label">
                      {" "}
                      圖片上傳{" "}
                    </label>
                    <input
                      value={fileInputValue}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="form-control"
                      id="fileInput"
                      onChange={handleFileChange}
                    />
                  </div>

                  <label htmlFor="primary-image" className="form-label">
                    主圖
                  </label>
                  <div className="input-group">
                    <input
                      value={modalData.imageUrl}
                      onChange={handleModalInputChange}
                      name="imageUrl"
                      type="text"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img
                    src={modalData.imageUrl}
                    alt={modalData.title}
                    className="img-fluid"
                  />
                </div>

                {/* 副圖 */}
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {modalData.imagesUrl?.map((image, index) => (
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
                    {modalData.imagesUrl.length < 5 &&
                      modalData.imagesUrl[modalData.imagesUrl.length - 1] !==
                        "" && (
                        <button
                          onClick={addImage}
                          className="btn btn-outline-primary btn-sm w-100"
                        >
                          新增圖片
                        </button>
                      )}

                    {modalData.imagesUrl.length > 1 && (
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
                    value={modalData.title}
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
                    value={modalData.category}
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
                    value={modalData.unit}
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
                      value={modalData.origin_price}
                      onChange={handleModalInputChange}
                      name="origin_price"
                      id="origin_price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入原價"
                      min="0"
                      onInput={(e) => {
                        if (e.target.value < 0) e.target.value = 0; // 避免輸入負數
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      value={modalData.price}
                      onChange={handleModalInputChange}
                      name="price"
                      id="price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入售價"
                      min="0"
                      onInput={(e) => {
                        if (e.target.value < 0) e.target.value = 0; // 避免輸入負數
                      }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    value={modalData.description}
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
                    value={modalData.content}
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
                    checked={modalData.is_enabled}
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
  );

}
  ProductModal.propTypes = {
    modalStatus: PropTypes.oneOf(["add", "edit"]).isRequired,
    rowProduct: PropTypes.object.isRequired,
    getProducts: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
  };
export default ProductModal;
