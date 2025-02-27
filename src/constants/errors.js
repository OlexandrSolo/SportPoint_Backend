export const ErrorsApp = {
  EXIST_USER: 'Email вже використовується іншим користувачем',

  NOT_CORRECT_PASSWORD: 'Невірний пароль! Спробуйте ще!',

  NOT_USER(email) {
    return `Юзера з email ${email} не існує!`;
  },
};