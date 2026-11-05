export const ERROR_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  EMAIL_INVALID: 'Please enter a valid email',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  CONFIRM_PASSWORD_NOT_MATCH: 'Passwords do not match',

  SIGN_UP_FAILED: 'Sign up failed. Please try again.',
  EMAIL_PASSWORD_INVALID: 'Email or password is invalid',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again later',
};

export const SUCCESS_MESSAGES = {
  WALLET_CREATED: 'Wallet created successfully!',
  WALLET_UPDATED: 'Wallet updated successfully!',
  WALLET_DELETED: 'Wallet deleted successfully!',
  CATEGORY_CREATED: 'Category created successfully!',
  CATEGORY_UPDATED: 'Category updated successfully!',
  CATEGORY_DELETED: 'Category deleted successfully!',
  TRANSACTION_CREATED: 'Transaction created successfully!',
  TRANSACTION_UPDATED: 'Transaction updated successfully!',
  TRANSACTION_DELETED: 'Transaction deleted successfully!',
};


