export interface Resource {
  id: number;
  title: string;
  url: string;
  content: string;
  image: string;
  categoryId: number | null;
  category: string;
  tags: string[];
  isFeatured?: boolean;
  createdAt?: string;
}
