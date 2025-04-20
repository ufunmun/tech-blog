export interface Post {
  id: string;
  title: string;
  content: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  posts_categories?: {
    // posts_categoriesプロパティを追加
    category_id: string;
    categories: {
      id: string;
      name: string;
    };
  }[];
}
