// перевіряє чи type входить у допустимий список значень
const parseType = (role) => {
    if (typeof role !== "string") return;

    const isType = (role) => ["coach", "adminClub",].includes(role);

    return isType ? role : undefined;
};

//ф-ія парсингу чисел (rating, reviewCount, minPrice, maxPrice)
const parseNumber = (number) => {
    if (typeof number !== "string") return;

    const parsedNumber = parseFloat(number);

    return !Number.isNaN(parsedNumber) ? parsedNumber : undefined;
};

// розбиття рядка в масив
const parseServices = (services) => {
    if (typeof services !== "string") return;

    return services.split(",").map(service => service.trim()).filter(Boolean);
};

//перевірка текстові поля address
const parseString = value => typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;

//головна ф-ія обробки всіх інших
export const parseFilterParams = query => {
    const { role, rating, countReview, minPrice, maxPrice, address, abilities, sort } = query;

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