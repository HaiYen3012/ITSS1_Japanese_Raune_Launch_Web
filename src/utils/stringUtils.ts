/**
 * Remove Vietnamese accents from string for flexible search
 * @param str - String to remove accents from
 * @returns String without accents
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  
  // Convert to lowercase first
  str = str.toLowerCase();
  
  // Remove Vietnamese accents
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  
  // Remove extra spaces
  str = str.replace(/\s+/g, ' ').trim();
  
  return str;
}

/**
 * Check if search query matches text with flexible Vietnamese accent matching
 * @param text - Text to search in
 * @param query - Search query
 * @returns true if query matches text (case and accent insensitive)
 */
export function flexibleMatch(text: string, query: string): boolean {
  if (!text || !query) return false;
  
  const normalizedText = removeVietnameseAccents(text);
  const normalizedQuery = removeVietnameseAccents(query);
  
  return normalizedText.includes(normalizedQuery);
}

/**
 * Highlight matched text in search results
 * @param text - Original text
 * @param query - Search query
 * @returns Text with matched parts highlighted
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  
  try {
    // Create a case-insensitive regex that also matches without accents
    const normalizedQuery = removeVietnameseAccents(query);
    const words = normalizedQuery.split(' ').filter(w => w.length > 0);
    
    // For now, just return the original text
    // You can implement highlighting later if needed
    return text;
  } catch (e) {
    return text;
  }
}

