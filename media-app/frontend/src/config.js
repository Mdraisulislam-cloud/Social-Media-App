// Base URL for static assets (images, uploads)
export const STATIC_BASE_URL = '';

// Helper function to get full image URL
export const getImageUrl = (path) => {
    if (!path) return '';
    // If path already starts with http, return as is
    if (path.startsWith('http')) return path;
    // Otherwise prepend the static base URL
    return `${STATIC_BASE_URL}${path}`;
};
