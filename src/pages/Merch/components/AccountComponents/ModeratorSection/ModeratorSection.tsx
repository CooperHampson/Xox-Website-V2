
import { useEffect, useState } from 'react';
import {
  getNewsForModerator,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  type NewsArticle,
} from '../../../../../api/newsApi';

import './ModeratorSection.css';

type NewsForm = {
  title: string;
  shortDescription: string;
  longDescription: string;
  publishDate: string;
  isPublished: boolean;
  image: File | null;
};

const emptyForm: NewsForm = {
  title: '',
  shortDescription: '',
  longDescription: '',
  publishDate: '',
  isPublished: false,
  image: null,
};

export function ModeratorSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function loadArticles() {
    try {
      setErrorMessage('');
      const result = await getNewsForModerator();
      setArticles(result);
    } catch (error) {
      console.error('Failed to load moderator news:', error);
      setErrorMessage('Unable to load articles.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadArticles();
  }, []);

  function handleOpenDesignStudio() {
    window.open(
      '/design-studio',
      '_blank',
      'noopener,noreferrer',
    );
  }

  function updateField<K extends keyof NewsForm>(
    field: K,
    value: NewsForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEditing(article: NewsArticle) {
    setEditingId(article.id);

    setForm({
      title: article.title,
      shortDescription: article.shortDescription,
      longDescription: article.longDescription,
      publishDate: new Date(article.publishDate)
        .toISOString()
        .slice(0, 16),
      isPublished: article.isPublished,
      image: null,
    });

    setErrorMessage('');
    setSuccessMessage('');
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setErrorMessage('');
    setSuccessMessage('');
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!editingId && !form.image) {
        setErrorMessage(
          'Please select an image for the new article.',
        );
        return;
      }

      const commonData = {
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        longDescription: form.longDescription.trim(),
        ...(form.publishDate
          ? { publishDate: new Date(form.publishDate).toISOString() }
          : {}),
        isPublished: form.isPublished,
      };

      if (editingId) {
        await updateNewsArticle(editingId, {
          ...commonData,
          ...(form.image ? { image: form.image } : {}),
        });

        setSuccessMessage('Article updated successfully.');
      } else {
        await createNewsArticle({
          ...commonData,
          image: form.image!,
        });

        setSuccessMessage('Article created successfully.');
      }

      setEditingId(null);
      setForm(emptyForm);
      await loadArticles();
    } catch (error) {
      console.error('Failed to save article:', error);
      setErrorMessage(
        'Unable to save the article. Please check the fields and try again.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(article: NewsArticle) {
    const confirmed = window.confirm(
      `Delete "${article.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setErrorMessage('');
    setSuccessMessage('');

    try {
      await deleteNewsArticle(article.id);

      if (editingId === article.id) {
        resetForm();
      }

      setSuccessMessage('Article deleted successfully.');
      await loadArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
      setErrorMessage('Unable to delete the article.');
    }
  }

  return (
    <section>
      <div className="moderator-section-container">
        <p className="moderator-info-title">Moderator</p>

        <div className="moderator-section-inner-cont">
          <button
            type="button"
            onClick={handleOpenDesignStudio}
            className="open-design-studio-button"
          >
            Design Studio
          </button>
        </div>

        <div className="news-management">
          <h2>News Management</h2>

          <p>
            Create articles, save drafts, publish news, and
            update existing articles.
          </p>

          {errorMessage && (
            <p className="news-management-error" role="alert">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="news-management-success" role="status">
              {successMessage}
            </p>
          )}

          <form
            className="news-management-form"
            onSubmit={handleSubmit}
          >
            <h3>
              {editingId ? 'Edit Article' : 'Create Article'}
            </h3>

            <label>
              Title
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  updateField('title', event.target.value)
                }
                maxLength={200}
                required
              />
            </label>

            <label>
              Short Description
              <textarea
                value={form.shortDescription}
                onChange={(event) =>
                  updateField(
                    'shortDescription',
                    event.target.value,
                  )
                }
                maxLength={1000}
                rows={3}
                required
              />
            </label>

            <label>
              Full Article
              <textarea
                value={form.longDescription}
                onChange={(event) =>
                  updateField(
                    'longDescription',
                    event.target.value,
                  )
                }
                rows={8}
                required
              />
            </label>

            <label>
              Publication Date
              <input
                type="datetime-local"
                value={form.publishDate}
                onChange={(event) =>
                  updateField('publishDate', event.target.value)
                }
              />
            </label>

            <label className="image-input-lab">
              Article Image {editingId && '(optional replacement)'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required={!editingId}
                onChange={(event) =>
                  updateField(
                    'image',
                    event.target.files?.[0] ?? null,
                  )
                }
                className="image-input-button"
              />
            </label>

            {editingId && (
              <p>
                Leave the image field empty to keep the current image.
              </p>
            )}

            <label className="news-publish-toggle">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) =>
                  updateField('isPublished', event.target.checked)
                }
              />
              Publish article
            </label>

            <div className="news-management-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving
                  ? 'Saving...'
                  : editingId
                    ? 'Save Changes'
                    : 'Create Article'}
              </button>

              {editingId && (
                <button type="button" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="news-management-list">
            <h3>Existing Articles</h3>

            {isLoading ? (
              <p>Loading articles...</p>
            ) : articles.length === 0 ? (
              <p>No articles have been created yet.</p>
            ) : (
              articles.map((article) => (
                <div
                  className="news-management-item"
                  key={article.id}
                >
                  <div>
                    <strong>{article.title}</strong>
                    <p>
                      {article.isPublished ? 'Published' : 'Draft'}
                      {' · '}
                      {new Date(
                        article.publishDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="news-management-actions">
                    <button
                      type="button"
                      onClick={() => startEditing(article)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(article)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}