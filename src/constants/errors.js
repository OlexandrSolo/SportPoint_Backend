export const ErrorsApp = {
  EXIST_USER: 'Email вже використовується іншим користувачем',
  NOT_CORRECT_PASSWORD: 'Невірний пароль! Спробуйте ще!',
  NOT_AUTHORIZED: 'Ви не авторизовані. Будь ласка авторизуйтеся!',
  NOT_VALID_PASSWORD:
    'Пароль має містити принаймні 6 символів та в його складі має бути принаймні одна літера та один спеціальний символ (*, #, & тощо)!',
  NOT_VALID_EMAIL:
    'Ви ввели не валідний формат email адреси. Ввведіть email адресу в форматі user@example.com!',

  NOT_USER(email) {
    return `Юзера з email ${email} не існує!`;
  },
  EMPTY_USER: 'Код веріфікації не вірний!',
  NOT_VERIFICATION(emailVer) {
    return `Користувач з email ${emailVer} не підтвердив своєї електроннної скриньки! Перейдіть будь ласка на свою електронну скриньку для підтвердження!`;
  },
};