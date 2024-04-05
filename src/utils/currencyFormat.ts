
export const currencyFormat = (value: number)=> {
    return new Intl.NumberFormat("es-BO", {
        style: "currency",
        currency: "BOB",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}