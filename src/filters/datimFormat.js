
export default (value, timeStyle = 'short', dateStyle = 'medium') => {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return value;
    }

    if (!timeStyle) {
        return date.toLocaleDateString(undefined, { dateStyle });
    }

    if (!dateStyle) {
        return date.toLocaleTimeString(undefined, { timeStyle });
    }

    return date.toLocaleString(undefined, { dateStyle, timeStyle });
};
