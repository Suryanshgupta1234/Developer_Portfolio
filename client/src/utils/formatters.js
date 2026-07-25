/**
 * Format a date to a readable string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a date to short form
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

/**
 * Truncate text to a given length
 */
export const truncate = (text, length = 120) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Format number with K/M suffix
 */
export const formatNumber = (num) => {
  if (!num) return 0;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Get relative time string (e.g. "2 days ago")
 */
export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

/**
 * Get language color for GitHub charts
 */
export const getLangColor = (language) => {
  const colors = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    CSS: '#563d7c',
    HTML: '#e34c26',
    'C++': '#f34b7d',
    C: '#555555',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Shell: '#89e051',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    default: '#6b7280',
  };
  return colors[language] || colors.default;
};
