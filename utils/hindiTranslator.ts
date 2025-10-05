
const ones = ['', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ'];
const teens = ['दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'];
const tens = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];

function convertLessThanHundred(n: number): string {
    if (n < 10) {
        return ones[n];
    }
    if (n < 20) {
        return teens[n - 10];
    }
    const ten = Math.floor(n / 10);
    const one = n % 10;
    return (tens[ten] + (one > 0 ? ' ' + ones[one] : '')).trim();
}

function convertLessThanThousand(n: number): string {
    if (n >= 100) {
        const hundred = Math.floor(n / 100);
        const rest = n % 100;
        return (ones[hundred] + ' सौ' + (rest > 0 ? ' ' + convertLessThanHundred(rest) : '')).trim();
    }
    return convertLessThanHundred(n);
}

export function numberToHindiWords(num: number): string {
    if (typeof num !== 'number' || !isFinite(num)) {
        return '';
    }
    
    const n = Math.floor(num);
    if (n === 0) return 'शून्य';

    if (n >= 10000000) {
        const crore = Math.floor(n / 10000000);
        const rest = n % 10000000;
        return (numberToHindiWords(crore) + ' करोड़' + (rest > 0 ? ' ' + numberToHindiWords(rest) : '')).trim();
    }
    if (n >= 100000) {
        const lakh = Math.floor(n / 100000);
        const rest = n % 100000;
        return (numberToHindiWords(lakh) + ' लाख' + (rest > 0 ? ' ' + numberToHindiWords(rest) : '')).trim();
    }
    if (n >= 1000) {
        const thousand = Math.floor(n / 1000);
        const rest = n % 1000;
        return (convertLessThanThousand(thousand) + ' हज़ार' + (rest > 0 ? ' ' + convertLessThanThousand(rest) : '')).trim();
    }
    return convertLessThanThousand(n);
}
