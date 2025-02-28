export const ErrorsApp = {
  EXIST_USER: 'Email вже використовується іншим користувачем',
  NOT_CORRECT_PASSWORD: 'Невірний пароль! Спробуйте ще!',
  NOT_AUTHORIZED: 'Ви не авторизовані. Будь ласка авторизуйтеся!',

  NOT_USER(email) {
    return `Юзера з email ${email} не існує!`;
  },
  EMPTY_USER: 'Код веріфікації не вірний!',
  NOT_VERIFICATION(emailVer) {
    return `Користувач з email ${emailVer} не підтвердив своєї електроннної скриньки! Перейдіть будь ласка на свою електронну скриньку для підтвердження!`;
  },
};