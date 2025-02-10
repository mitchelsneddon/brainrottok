import React, { useState } from "react";
import NavbarTop from "./NavbarTop";
import NavbarBottom from "./NavbarBottom";
import ArticleView from "./ArticleView";
import "./App.css";

function App() {
  const [category, setCategory] = useState("Explore");
  const [loading, setLoading] = useState(true);

  return (
    <div className="App">
      {!loading && <NavbarTop />}
      <ArticleView category={category} setLoading={setLoading} />
      {!loading && <NavbarBottom setCategory={setCategory} />}
    </div>
  );
}

export default App;
