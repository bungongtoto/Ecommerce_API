module.exports = class ConversionUtils {
    static convertCurrencyString(str){
        const cleaned = str.replace(/[^0-9.-]+/g, '');
        return parseFloat(cleaned);
    }
}