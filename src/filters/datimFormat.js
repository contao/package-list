
export default (value) => {
    if (!value) {
        return '';
    }

    return new Date(value).toLocaleString();
};
