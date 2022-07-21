
let locale = undefined;

export function setLocale(value) {
    locale = value;
}

export default (value, timeStyle = 'short', dateStyle = 'medium') => {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return value;
    }

    if (!timeStyle) {
        return date.toLocaleDateString(locale, { dateStyle });
    }

    if (!dateStyle) {
        return date.toLocaleTimeString(locale, { timeStyle });
    }

    return date.toLocaleString(locale, { dateStyle, timeStyle });
};
