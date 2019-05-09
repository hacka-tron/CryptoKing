const Currencies = require("./helpers/currencies");

//Gets a list of all coins in a specified wallet
exports.getCurrencyList = (req, res, next) => {
    Currencies.getCurrencies(function (currencies) {
        res.status(201).json({
            message: "Currencies Fetched Successfully",
            currencies: currencies
        });
    })
};
