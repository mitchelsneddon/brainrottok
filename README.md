# BrainRotTok

This personal project was an attempt to spend less time mindlessly scrolling my phone and atleast be learning a few things. Wanted to experiement with React, Apis & ChatGPT. Brainrot is a React-based application that curates and displays Wikipedia articles dynamically based on selected categories. It allows users to scroll through articles, read summaries, generate TL;DR versions using AI, listen to articles via text-to-speech, and share them.

![image](https://github.com/user-attachments/assets/dda703a8-027e-4978-adce-8cf96bd233f5)
![image](https://github.com/user-attachments/assets/f07e8575-1b8d-4d0c-a24f-93a84a2aa2ff)
![image](https://github.com/user-attachments/assets/fa60acd5-b1c8-4c3d-8d04-196262ae784b)

## Features
- **Dynamic Article Fetching:** Articles are pulled from Wikipedia using the MediaWiki API.
- **Article Summaries:** A brief extract is shown for each article.
- **Full Descriptions:** Users can open articles to see the full content.
- **TL;DR Mode:** Uses OpenAI to generate a concise summary of articles.
- **Text-to-Speech (TTS):** Converts text into speech using Azure Speech Services.
- **Swipe and Scroll Navigation:** Users can navigate articles through mouse scrolling or touch gestures.
- **Article Sharing:** Articles can be shared using the Web Share API.
- **Cached Articles:** Articles are cached per category to improve performance.

## Technologies Used
- **React.js** for the frontend
- **Axios** for API calls
- **MediaWiki API** for fetching Wikipedia articles
- **OpenAI API** for AI-generated TL;DR summaries
- **Azure Speech Services** for text-to-speech functionality
- **Web Share API** for sharing articles

## How It Works
1. Users select a category (Music, History, Science, Sport, etc.).
2. The app fetches random articles from Wikipedia related to the category.
3. Articles are displayed one at a time, with navigation via scrolling or swiping.
4. Users can:
   - Open an article for a full description.
   - Generate a TL;DR summary.
   - Listen to the article via text-to-speech.
   - Share the article with others.

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/mitchelsneddon/brainrottok.git
   cd brainrot
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with the following environment variables:
   ```sh
   REACT_APP_AZURE_SPEECH_KEY=your_azure_speech_key
   REACT_APP_AZURE_SPEECH_REGION=your_azure_speech_region
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   REACT_APP_OPENAI_ENDPOINT=your_openai_endpoint
   REACT_APP_OPENAI_DEPLOYMENT_NAME=your_openai_deployment
   ```
4. Start the development server:
   ```sh
   npm start
   ```
5. Open the app in the browser at `http://localhost:3000/`.

## Usage
- Select a category to start browsing articles.
- Use the mouse scroll or touch gestures to navigate.
- Click an article for a full description.
- Click **TL;DR** to get an AI-generated summary.
- Click **Listen** to hear the article read aloud.
- Click **Share** to share the article.

## Contributing
Contributions are welcome! Feel free to submit pull requests with improvements or bug fixes.

## License
This project is licensed under the MIT License.

---
**Enjoy brainrot and keep exploring knowledge!**



