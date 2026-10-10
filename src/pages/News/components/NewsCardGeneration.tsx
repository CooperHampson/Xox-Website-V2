
import { useEffect, useState } from 'react';
import {
  getNews,
  type NewsArticle,
} from '../../../api/newsApi';

export function NewsCardGeneration() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedNews, setSelectedNews] =
    useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const articles = await getNews();

        if (!cancelled) {
          setNews(articles);
        }
      } catch (error) {
        console.error('Failed to load news:', error);

        if (!cancelled) {
          setErrorMessage(
            'Unable to load news right now. Please try again later.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadNews();

    return () => {
      cancelled = true;
    };
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <>
      <div className="News-Card-System">
        {isLoading && (
          <p className="News-Status">
            Loading news...
          </p>
        )}

        {!isLoading && errorMessage && (
          <p className="News-Status">
            {errorMessage}
          </p>
        )}

        {!isLoading && !errorMessage && news.length === 0 && (
          <p className="News-Status">
            No news articles have been published yet.
          </p>
        )}

        {!isLoading &&
          !errorMessage &&
          [...news]
            .sort(
              (a, b) =>
                new Date(b.publishDate).getTime() -
                new Date(a.publishDate).getTime(),
            )
            .map((article) => (
              <button
                type="button"
                key={article.id}
                className="News-Card"
                onClick={() => setSelectedNews(article)}
              >
                <img
                  className="News-Card-Thumbnail"
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                />

                <p className="News-Card-Title">
                  {article.title}
                </p>

                <p className="News-Card-Date">
                  {formatDate(article.publishDate)}
                </p>

                <p className="News-Card-Description">
                  {article.shortDescription}
                </p>
              </button>
            ))}
      </div>

      {selectedNews && (
        <div
          className="News-Modal"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedNews(null);
            }
          }}
        >
          <div
            className="News-Modal-Content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="News-Modal-Title"
          >
            <button
              type="button"
              className="News-Modal-Close"
              aria-label="Close article"
              onClick={() => setSelectedNews(null)}
            >
              ×
            </button>

            <img
              className="News-Modal-Image"
              src={selectedNews.image}
              alt={selectedNews.title}
            />

            <h2
              id="News-Modal-Title"
              className="News-Modal-Title"
            >
              {selectedNews.title}
            </h2>

            <p className="News-Modal-Date">
              {formatDate(selectedNews.publishDate)}
            </p>

            <p className="News-Modal-Description">
              {selectedNews.longDescription}
            </p>
          </div>
        </div>
      )}
    </>
  );
}