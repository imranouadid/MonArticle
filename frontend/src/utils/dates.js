export function formatDate(dateStr) {
    if (!dateStr) return 'Date unavailable';
    return new Date(dateStr.replace('+00:00', 'Z')).toLocaleDateString();
}
