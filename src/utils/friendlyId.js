/**
 * Generates a friendly, stable short ID from a UUID.
 * The same UUID will always produce the same friendly ID.
 *
 * @param {string} id - The raw UUID string
 * @param {'CLT'|'ORD'} prefix - The prefix to use
 * @returns {string} e.g. "ORD-03241" or "CLT-98765"
 */
export const toFriendlyOrderId = (id) => {
    if (!id) return 'ORD-?????';
    const num = parseInt(id.replace(/-/g, '').substring(0, 8), 16);
    return `ORD-${(num % 100000).toString().padStart(5, '0')}`;
};

export const toFriendlyCustomerId = (id) => {
    if (!id) return 'CLT-?????';
    const num = parseInt(id.replace(/-/g, '').substring(0, 8), 16);
    return `CLT-${(num % 100000).toString().padStart(5, '0')}`;
};
