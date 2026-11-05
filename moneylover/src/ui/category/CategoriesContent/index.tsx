// Services
import { getCategoriesInfo } from '@/services';

// Configs
import { auth } from '@/configs/auth';

// Components
import { CategoryList } from '@/components';

interface CategoriesContentProps {
  query?: string;
}

export const CategoriesContent = async ({ query = '' }: CategoriesContentProps) => {
  const session = await auth();
  const userId = session?.user?.id ?? '';

  const { expenseCategories, incomeCategories, subCategories } = await getCategoriesInfo(
    userId,
    query,
  );

  return (
    <CategoryList
      userId={userId}
      expenseCategories={expenseCategories}
      incomeCategories={incomeCategories}
      subCategories={subCategories}
    />
  );
};
