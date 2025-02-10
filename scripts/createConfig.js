const fs = require("fs");

const config = {
  REACT_APP_OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || "",
  REACT_APP_OPENAI_ENDPOINT: process.env.REACT_APP_OPENAI_ENDPOINT || "",
  REACT_APP_OPENAI_DEPLOYMENT_NAME:
    process.env.REACT_APP_OPENAI_DEPLOYMENT_NAME || "",
  REACT_APP_AZURE_SPEECH_KEY: process.env.REACT_APP_AZURE_SPEECH_KEY || "",
  REACT_APP_AZURE_SPEECH_REGION: process.env.REACT_APP_OPENAI_ENDPOINT || "",
};

// Write to the public folder so it is available at runtime
fs.writeFileSync("./public/config.json", JSON.stringify(config, null, 2));

console.log("Config file created:", config);
