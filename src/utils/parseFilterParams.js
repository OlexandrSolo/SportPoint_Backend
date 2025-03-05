// перевіряє чи type входить у допустимий список значень
const parseType = (type) => {
    if (typeof type !== "string") return;

    const isType = (type) => ["user", "trainer", "club"].includes(type);

    return isType ? type : undefined;
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
    const { type, rating, reviewCount, minPrice, maxPrice, address, services } = query;

    return {
        type: parseType(type),
        reviewCount: parseNumber(reviewCount),
        rating: parseNumber(rating),
        minPrice: parseNumber(minPrice),
        maxPrice: parseNumber(maxPrice),
        address: parseString(address),
        services: parseServices(services)
    };
};