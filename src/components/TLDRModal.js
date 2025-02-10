import React from "react";
import { Modal } from "react-bootstrap";
import { FaVolumeUp, FaSpinner } from "react-icons/fa";

const TLDRModal = ({
  showTLDRModal,
  setShowTLDRModal,
  tldrArticle,
  tldrSummary,
  tldrLoading,
  error,
  handleVoiceText,
  voiceLoading,
}) => {
  return (
    <Modal
      show={showTLDRModal}
      onHide={() => setShowTLDRModal(false)}
      centered
      size="lg"
      className="custom-modal"
    >
      <Modal.Header closeButton className="bg-dark text-white text-center">
        <Modal.Title>TLDR Summary</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white text-center">
        {tldrArticle && (
          <img
            src={tldrArticle.thumbnail || "https://via.placeholder.com/600"}
            alt={tldrArticle.title}
            className="article-image mb-3 mx-auto d-block"
            style={{ maxWidth: "300px", borderRadius: "8px" }}
          />
        )}

        {error ? (
          <div className="text-danger mb-3">{error}</div>
        ) : tldrLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="modal-text-container">
            <h4 className="mb-3">{tldrArticle?.title}</h4>
            <p className="modal-text py-3" style={{ lineHeight: "1.6" }}>
              {tldrSummary}
            </p>
            <button
              className="btn btn-light text-dark my-3"
              onClick={() => handleVoiceText(tldrSummary)}
            >
              {voiceLoading ? (
                <FaSpinner className="spinner" />
              ) : (
                <>
                  Read this to me <FaVolumeUp />
                </>
              )}
            </button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default TLDRModal;
