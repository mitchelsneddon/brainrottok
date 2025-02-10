import React from "react";
import { Modal } from "react-bootstrap";
import { FaVolumeUp, FaSpinner } from "react-icons/fa";

const ArticleModal = ({
  showModal,
  handleCloseModal,
  selectedArticle,
  loadingDescription,
  fullDescription,
  handleVoiceText,
  voiceLoading,
}) => {
  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      centered
      size="lg"
      className="custom-modal"
      onEnter={() => (document.body.style.overflow = "hidden")}
      onExited={() => (document.body.style.overflow = "auto")}
    >
      <Modal.Header closeButton className="bg-dark text-white text-center">
        <Modal.Title>{selectedArticle?.title || "Loading..."}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body bg-dark text-white text-center">
        <div className="content-container">
          <img
            src={
              selectedArticle?.thumbnail || "https://via.placeholder.com/600"
            }
            alt={selectedArticle?.title}
            className="article-image mb-3 mx-auto d-block"
            style={{ maxWidth: "300px", borderRadius: "8px" }}
          />
          {loadingDescription ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="modal-text-container">
              <p className="modal-text py-3" style={{ lineHeight: "1.6" }}>
                {fullDescription}
              </p>
              <div className="d-flex justify-content-center flex-column">
                <button
                  className="btn btn-light text-dark my-3"
                  onClick={() => handleVoiceText(fullDescription)}
                >
                  {voiceLoading ? (
                    <FaSpinner className="spinner" />
                  ) : (
                    <>
                      Read this to me <FaVolumeUp />
                    </>
                  )}
                </button>
                <a
                  href={`https://en.wikipedia.org/wiki/${selectedArticle?.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-light text-dark my-3"
                >
                  Read Full Article
                </a>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ArticleModal;
