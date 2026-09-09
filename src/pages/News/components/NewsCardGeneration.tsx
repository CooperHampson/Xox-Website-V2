import { useState } from "react";
import { newsData, type NewsArticle } from "./NewsData";


export function NewsCardGeneration() {
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  return (
    <>
      <div className="News-Card-System">
        {[...newsData].reverse().map((news) => (
          <div key={news.id} className="News-Card" onClick={() => setSelectedNews(news)}>
            <img className="News-Card-Thumbnail" src={news.image} alt={news.title} />

            <p className="News-Card-Title">{news.title}</p>

            <p className="News-Card-Date">{news.date}</p>

            <p className="News-Card-Description">{news.shortDescription}</p>
          </div>
        ))}
      </div>

      {selectedNews && (
        <div className="News-Modal" onClick={(event) => {
          if (event.target === event.currentTarget) {
            setSelectedNews(null);
          }
        }}>
          <div className="News-Modal-Content">
            <button className="News-Modal-Close" onClick={() => setSelectedNews(null)}>x</button>

            <img
              className="News-Modal-Image"
              src={selectedNews.image}
              alt={selectedNews.title}
            />

            <h2 className="News-Modal-Title">
              {selectedNews.title}
            </h2>

            <p className="News-Modal-Date">
              {selectedNews.date}
            </p>

            <p className="News-Modal-Description">
              {selectedNews.fullDescription}
            </p>
          </div>
        </div>
      )}
    </>
  );
}