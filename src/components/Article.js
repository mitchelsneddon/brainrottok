import React from "react";
import {
  FaBookOpen,
  FaPaperPlane,
  FaSpinner,
  FaVolumeUp,
} from "react-icons/fa";

const Article = ({
  article,
  handleTLDR,
  tldrLoading,
  openArticleModal,
  handleVoice,
  handleShare,
  category,
  voiceLoading,
}) => {
  return (
    <div
      className="article bg-dark"
      style={{
        backgroundImage: `url(${article.thumbnail})`,
      }}
    >
      <div className="overlay d-flex flex-column justify-content-end text-left px-3 pb-5">
        <h1 className="article-title pb-2">{article.title}</h1>
        <p className="article-extract mb-0">{article.extract}</p>
        <div className="hashtags py-3">
          <span className="hashtag">#{category}</span>
        </div>
        <div className="d-flex gap-2 justify-content-space-between mb-5">
          <button
            className="btn hashtag border-0"
            onClick={() => handleTLDR(article)}
            disabled={tldrLoading}
          >
            {tldrLoading ? (
              <FaSpinner className="spinner mb-1" />
            ) : (
              <h1 className="ai-button mb-0">tldr</h1>
            )}
          </button>
          <button
            className="btn hashtag border-0"
            onClick={() => openArticleModal(article)}
          >
            <FaBookOpen className="mb-1" />
          </button>
          <button
            className="btn hashtag border-0"
            onClick={() => handleVoice(article)}
            disabled={voiceLoading}
          >
            {voiceLoading ? (
              <FaSpinner className="spinner mb-1" />
            ) : (
              <FaVolumeUp className="mb-1" />
            )}
          </button>
          <button
            className="btn hashtag border-0"
            onClick={() => handleShare(article)}
          >
            <FaPaperPlane className="mb-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Article;
