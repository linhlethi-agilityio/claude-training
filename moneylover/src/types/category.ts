import { FinanceType } from './transaction';

export interface Category {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  image_url: string;
  type: FinanceType;
  is_default?: boolean;
}

export interface CategoryFormData {
  name: string;
  type: string;
  parentId?: string;
}
