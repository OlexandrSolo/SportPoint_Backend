// перевіряє чи type входить у допустимий список значень
const parseType = (type) => {
    if (typeof type !== "string") return;

    const isType = (type) => ["costumer", "coach", "adminClub"].includes(type);

    return isType ? type : undefined;
};

//ф-ія парсингу чисел (rating, reviewCount, minPrice, maxPrice)
const parseNumber = (number) => {
    if (typeof number !== "string") return;

    const parsedNumber = parseFloat(number);

    return !Number.isNaN(parsedNumber) ? parsedNumber : undefined;
};

// розбиття рядка в масив
const parseServices = (abilities) => {
    if (typeof abilities !== "string") return;

    return abilities.split(",").map(ability => ability.trim()).filter(Boolean);
};

//перевірка текстові поля address
const parseString = value => typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;

//головна ф-ія обробки всіх інших
export const parseFilterParams = query => {
    const { role, rating, countReview, minPrice, maxPrice, address, sort, abilities } = query;

    return {
        role: parseType(role),
        countReview: parseNumber(countReview),
        rating: parseNumber(rating),
        minPrice: parseNumber(minPrice),
        maxPrice: parseNumber(maxPrice),
        address: parseString(address),
        abilities: parseServices(abilities),
        sort: sort
    };
};