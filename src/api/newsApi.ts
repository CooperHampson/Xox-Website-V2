
import api from './axios';

export type NewsArticle = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  publishDate: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateNewsArticle = {
  title: string;
  shortDescription: string;
  longDescription: string;
  publishDate?: string;
  isPublished?: boolean;
  image: File;
};

export type UpdateNewsArticle = {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  publishDate?: string;
  isPublished?: boolean;
  image?: File;
};

export async function getNews(): Promise<NewsArticle[]> {
  const response = await api.get<NewsArticle[]>('/news');
  return response.data;
}

export async function getNewsForModerator(): Promise<NewsArticle[]> {
  const response = await api.get<NewsArticle[]>('/news/admin');
  return response.data;
}

export async function createNewsArticle(
  article: CreateNewsArticle,
): Promise<NewsArticle> {
  const formData = new FormData();

  formData.append('title', article.title);
  formData.append('shortDescription', article.shortDescription);
  formData.append('longDescription', article.longDescription);

  if (article.publishDate) {
    formData.append('publishDate', article.publishDate);
  }

  formData.append(
    'isPublished',
    String(article.isPublished ?? false),
  );

  formData.append('image', article.image);

  const response = await api.post<NewsArticle>(
    '/news',
    formData,
  );

  return response.data;
}

export async function updateNewsArticle(
  id: string,
  article: UpdateNewsArticle,
): Promise<NewsArticle> {
  const formData = new FormData();

  if (article.title !== undefined) {
    formData.append('title', article.title);
  }

  if (article.shortDescription !== undefined) {
    formData.append('shortDescription', article.shortDescription);
  }

  if (article.longDescription !== undefined) {
    formData.append('longDescription', article.longDescription);
  }

  if (article.publishDate !== undefined) {
    formData.append('publishDate', article.publishDate);
  }

  if (article.isPublished !== undefined) {
    formData.append('isPublished', String(article.isPublished));
  }

  if (article.image) {
    formData.append('image', article.image);
  }

  const response = await api.patch<NewsArticle>(
    `/news/${id}`,
    formData,
  );

  return response.data;
}

export async function deleteNewsArticle(
  id: string,
): Promise<void> {
  await api.delete(`/news/${id}`);
}