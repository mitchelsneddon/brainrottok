import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import axios from "axios";
import Article from "./components/Article";
import ArticleModal from "./components/ArticleModal";
import TLDRModal from "./components/TLDRModal";
import brainrotlogo from "./assets/brainrotloading.GIF";

const MemoizedArticle = memo(Article);
const MemoizedArticleModal = memo(ArticleModal);
const MemoizedTLDRModal = memo(TLDRModal);

const ArticleView = ({ category, setLoading }) => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [fullDescription, setFullDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [tldrSummary, setTldrSummary] = useState("");
  const [tldrLoading, setTldrLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTLDRModal, setShowTLDRModal] = useState(false);
  const [tldrArticle, setTldrArticle] = useState(null);
  const [voiceLoading, setVoiceLoading] = useState(false);

  const containerRef = useRef(null);
  const touchStartYRef = useRef(null);
  const swipeProcessedRef = useRef(false);
  const articlesCacheRef = useRef({});

  const formatArticle = useCallback((articleData) => {
    return {
      title: articleData.title,
      extract: articleData.extract
        ? articleData.extract.substring(0, 275) +
          (articleData.extract.length > 275 ? "..." : "")
        : "No summary available.",
      thumbnail:
        articleData.thumbnail?.source ||
        `https://picsum.photos/800/600?random=${Math.floor(
          Math.random() * 1000
        )}`,
      category: articleData.category || "Uncategorized",
    };
  }, []);

  /**
   * fetchArticles now accepts a flag, isInitialFetch, to differentiate between:
   * - an initial load (or category change) where we may use cached articles
   * - subsequent fetches (e.g. via scrolling) which should always fetch new articles.
   *
   * Note: We no longer depend on the "articles" state in this function to avoid
   * triggering an infinite loop.
   */
  const fetchArticles = useCallback(
    async (isInitialFetch = false) => {
      setLoading(true);
      setIsFetchingMore(true);
      let newArticles = [];

      if (isInitialFetch && articlesCacheRef.current[category]) {
        newArticles = articlesCacheRef.current[category];
      } else {
        let searchQuery;
        switch (category) {
          case "Music":
            searchQuery =
              '"musicians" OR "music genres" OR "musical instruments" OR "albums" OR "songs"';
            break;
          case "History":
            searchQuery =
              'history OR "historical figure" OR "historical event" OR "historical period"';
            break;
          case "Science":
            searchQuery =
              'science OR "space" OR "chemistry" OR "biology" OR "physics"';
            break;
          case "Sport":
            searchQuery = '"sport" OR "sport teams" OR "sporting players"';
            break;
          default:
            searchQuery = category;
        }
        try {
          const response = await axios.get(
            `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
              searchQuery
            )}&srsort=random&srlimit=15&format=json&origin=*`
          );
          const articleTitles = response.data.query.search.map(
            (article) => article.title
          );
          const detailPromises = articleTitles.map(async (title) => {
            try {
              const detailResponse = await axios.get(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
                  title
                )}`
              );
              return formatArticle(detailResponse.data);
            } catch (error) {
              console.error("Error fetching article details:", error);
              return null;
            }
          });
          newArticles = (await Promise.all(detailPromises)).filter(
            (article) => article !== null
          );
          if (isInitialFetch) {
            articlesCacheRef.current[category] = newArticles;
          }
        } catch (error) {
          console.error("Error fetching articles:", error);
        }
      }

      setArticles((prev) => [...prev, ...newArticles]);
      setIsFetchingMore(false);
      setLoading(false);
    },
    [category, formatArticle, setLoading]
  );

  useEffect(() => {
    setArticles([]);
    setCurrentIndex(0);
    fetchArticles(true);
  }, [category, fetchArticles]);

  const handleScroll = useCallback(
    (direction) => {
      if (showModal || showTLDRModal || isFetchingMore) return;
      if (direction === "down") {
        if (currentIndex === articles.length - 1) {
          fetchArticles();
          return;
        }
        setCurrentIndex((prev) => prev + 1);
      } else if (direction === "up") {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    },
    [
      articles.length,
      currentIndex,
      showModal,
      showTLDRModal,
      isFetchingMore,
      fetchArticles,
    ]
  );

  const wheelHandler = useCallback(
    (e) => {
      if (showModal || showTLDRModal || isFetchingMore) return;
      if (e.deltaY > 0) {
        handleScroll("down");
      } else if (e.deltaY < 0) {
        handleScroll("up");
      }
    },
    [handleScroll, isFetchingMore, showModal, showTLDRModal]
  );

  const handleTouchStart = useCallback((e) => {
    swipeProcessedRef.current = false;
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartYRef.current === null) return;
      if (swipeProcessedRef.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartYRef.current - touchEndY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleScroll("down");
        } else {
          handleScroll("up");
        }
        swipeProcessedRef.current = true;
      }
      touchStartYRef.current = null;
    },
    [handleScroll]
  );

  useEffect(() => {
    if (
      !isFetchingMore &&
      articles.length > 0 &&
      articles.length - currentIndex <= 6
    ) {
      fetchArticles();
    }
  }, [currentIndex, articles.length, isFetchingMore, fetchArticles]);

  const currentArticle = articles[currentIndex] || {
    title: "Loading...",
    extract: "",
    thumbnail: "",
  };

  const performTextToSpeech = async (text) => {
    const azureSpeechKey =
      process.env.REACT_APP_AZURE_SPEECH_KEY ||
      window.REACT_APP_CONFIG?.REACT_APP_AZURE_SPEECH_KEY;
    const azureSpeechRegion =
      process.env.REACT_APP_AZURE_SPEECH_REGION ||
      window.REACT_APP_CONFIG?.REACT_APP_AZURE_SPEECH_REGION;
    if (!azureSpeechKey || !azureSpeechRegion) {
      console.error("Azure Speech key or region is not configured.");
      return;
    }
    const azureEndpoint = `https://${azureSpeechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const ssml = `
      <speak version="1.0" xml:lang="en-US">
        <voice xml:lang="en-US" xml:gender="Female" name="en-US-AriaNeural">
          ${text}
        </voice>
      </speak>
    `;
    try {
      const response = await fetch(azureEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3",
          "Ocp-Apim-Subscription-Key": azureSpeechKey,
          "User-Agent": "Brainrot",
        },
        body: ssml,
      });
      if (!response.ok) {
        throw new Error(`Azure TTS error: ${response.statusText}`);
      }
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error in Azure Text-to-Speech:", error);
    }
  };

  const handleVoice = async (article) => {
    setVoiceLoading(true);
    await performTextToSpeech(article.extract);
    setVoiceLoading(false);
  };

  const handleVoiceText = async (text) => {
    setVoiceLoading(true);
    await performTextToSpeech(text);
    setVoiceLoading(false);
  };

  const openArticleModal = async (article) => {
    document.body.style.overflow = "hidden";
    setLoadingDescription(true);
    setShowModal(true);
    setSelectedArticle({
      title: article.title,
      thumbnail: article.thumbnail,
    });
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=false&explaintext=true&titles=${encodeURIComponent(
          article.title
        )}&format=json&origin=*`
      );
      const page = Object.values(response.data.query.pages)[0];
      setFullDescription(page.extract || "No full description available.");
      setLoadingDescription(false);
    } catch (error) {
      console.error("Error fetching full description:", error);
      setFullDescription("Failed to load description.");
      setLoadingDescription(false);
    }
  };

  const handleCloseModal = () => {
    document.body.style.overflow = "auto";
    setShowModal(false);
  };

  const handleTLDR = async (article) => {
    setTldrLoading(true);
    setError("");
    setTldrArticle(null);
    setTldrSummary("");
    try {
      setTldrArticle({
        title: article.title,
        thumbnail: article.thumbnail,
      });
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=false&explaintext=true&titles=${encodeURIComponent(
          article.title
        )}&format=json&origin=*`
      );
      const page = Object.values(response.data.query.pages)[0];
      const fullDesc = page.extract || "No full description available.";
      const openaiApiKey = window.REACT_APP_CONFIG?.REACT_APP_OPENAI_API_KEY;
      const openaiEndpoint = window.REACT_APP_CONFIG?.REACT_APP_OPENAI_ENDPOINT;
      const openaiDeploymentName =
        window.REACT_APP_CONFIG?.REACT_APP_OPENAI_DEPLOYMENT_NAME;
      const aiResponse = await axios.post(
        `${openaiEndpoint}/openai/deployments/${openaiDeploymentName}/chat/completions?api-version=2023-05-15`,
        {
          messages: [
            {
              role: "system",
              content:
                "You are an assistant that creates TLDR summaries of wikipedia articles in a fun way that makes them interesting, no emojis.",
            },
            {
              role: "user",
              content: `TLDR this: ${fullDesc}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        },
        {
          headers: {
            "api-key": openaiApiKey,
            "Content-Type": "application/json",
          },
        }
      );
      const cleanSummary = aiResponse.data.choices[0].message.content.replace(
        /\*/g,
        ""
      );
      setTldrSummary(cleanSummary);
      setShowTLDRModal(true);
    } catch (err) {
      console.error("TLDR Error:", err);
      setError(
        err.response?.data?.error?.message || err.message || "TLDR failed"
      );
      setShowTLDRModal(true);
    } finally {
      setTldrLoading(false);
    }
  };

  const handleShare = (article) => {
    const shareData = {
      title: article.title,
      text: article.extract,
      url: `https://en.wikipedia.org/wiki/${article.title}`,
    };
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Article shared successfully"))
        .catch((error) => console.error("Error sharing article:", error));
    } else {
      console.error("Web Share API is not supported in this browser.");
    }
  };

  return (
    <div
      className="article-container"
      ref={containerRef}
      onWheel={wheelHandler}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isFetchingMore && articles.length === 0 ? (
        <div className="splash-screen bg-dark d-flex justify-content-center align-items-center">
          <img src={brainrotlogo} width="200" height="200" alt="Loading" />
        </div>
      ) : (
        <MemoizedArticle
          article={currentArticle}
          handleTLDR={handleTLDR}
          tldrLoading={tldrLoading}
          openArticleModal={openArticleModal}
          handleVoice={handleVoice}
          handleShare={handleShare}
          category={category}
          voiceLoading={voiceLoading}
        />
      )}
      <MemoizedTLDRModal
        showTLDRModal={showTLDRModal}
        setShowTLDRModal={setShowTLDRModal}
        tldrArticle={tldrArticle}
        error={error}
        tldrLoading={tldrLoading}
        tldrSummary={tldrSummary}
        handleVoiceText={handleVoiceText}
        fullDescription={fullDescription}
        voiceLoading={voiceLoading}
      />
      <MemoizedArticleModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedArticle={selectedArticle}
        loadingDescription={loadingDescription}
        fullDescription={fullDescription}
        handleVoiceText={handleVoiceText}
        voiceLoading={voiceLoading}
      />
    </div>
  );
};

export default ArticleView;
