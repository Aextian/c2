export const formatDateTime = (dateString?: string | null): string => {
    if (!dateString) return 'No deadline';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).format(date);
};
