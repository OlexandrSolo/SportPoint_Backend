export const ErrorsApp = {
  EXIST_USER: 'Email вже використовується іншим користувачем',
  DELETE_ACCOUNT: 'Ваш акаунт було успішно видалено з сервісу SportPoint!',
  NOT_CORRECT_PASSWORD: 'Невірний пароль! Спробуйте ще!',
  NOT_AUTHORIZED: 'Ви не авторизовані. Будь ласка авторизуйтеся!',
  NOT_VALID_PASSWORD:
    'Пароль має містити принаймні 6 символів!',
  NOT_VALID_EMAIL:
    'Ви ввели не валідний формат email адреси. Ввведіть email адресу в форматі user@example.com!',
  BAD_CODE: 'Ви ввели невірни код підтвердження!',

  NOT_USER(email) {
    return `Юзера з email ${email} не існує!`;
  },
  EMPTY_USER: 'Код веріфікації не вірний!',
  NOT_VERIFICATION(emailVer) {
    return `Користувач з email ${emailVer} не підтвердив своєї електроннної скриньки! Перейдіть будь ласка на свою електронну скриньку для підтвердження!`;
  },
};