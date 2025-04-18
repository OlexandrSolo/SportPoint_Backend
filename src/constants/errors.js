export const ErrorsApp = {
  EXIST_USER: 'The email is already in use by another user.',
  DELETE_ACCOUNT: 'Your account has been successfully deleted from SportPoint!',
  NOT_CORRECT_PASSWORD: 'Incorrect password. Please try again.',
  NOT_AUTHORIZED: 'You are not authorized. Please log in first.',
  NOT_VALID_PASSWORD: 'The password must be at least 6 characters long.',
  NOT_VALID_PHONE: 'The phone number must be in the format +380XXXXXXXXX.',
  NOT_VALID_EMAIL: 'Invalid email format. Please enter an email like user@example.com.',
  BAD_CODE: 'Invalid verification code.',
  FORBIDDEN: 'You do not have permission to perform this action.',

  NOT_USER(email) {
    return `No user found with the email: ${email}.`;
  },

  EMPTY_USER: 'Код веріфікації не вірний!',
  NOT_VERIFICATION(emailVer) {
    return `The user with email ${emailVer} has not verified their account. Please check your inbox to complete the verification.`;
  },
};

// export const AuthErrors = {
//   USER_EXISTS: 'The email is already in use by another user.',
//   USER_NOT_FOUND: (email) => `No user found with the email: ${email}.`,
//   EMAIL_NOT_VERIFIED: (email) => `The user with email ${email} has not verified their account. Please check your inbox.`,
//   INVALID_VERIFICATION_CODE: 'Invalid verification code.',
//   INCORRECT_PASSWORD: 'Incorrect password. Please try again.',
//   NOT_AUTHORIZED: 'You are not authorized. Please log in first.',
//   FORBIDDEN_ACTION: 'You do not have permission to perform this action.',
// };

// export const ValidationErrors = {
//   INVALID_PASSWORD: 'The password must be at least 6 characters long.',
//   INVALID_PHONE: 'The phone number must be in the format +380XXXXXXXXX.',
//   INVALID_EMAIL: 'Invalid email format. Please enter a valid email address.',
// };

// export const AccountErrors = {
//   ACCOUNT_DELETED: 'Your account has been successfully deleted from SportPoint!',
// };