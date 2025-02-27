export const ErrorsApp = {
  EXIST_USER: 'Email вже використовується іншим користувачем',
  NOT_CORRECT_PASSWORD: 'Невірний пароль! Спробуйте ще!',
  NOT_AUTHORIZED: 'Ви не авторизовані. Будь ласка авторизуйтеся!',

  NOT_USER(email) {
    return `Юзера з email ${email} не існує!`;
  },
};