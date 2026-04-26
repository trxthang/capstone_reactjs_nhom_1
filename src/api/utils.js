/**
 * Cybersoft API trả về { statusCode, message, content }
 * content có thể là array, object, hoặc null tuỳ endpoint.
 * toArray đảm bảo luôn trả về array dù content ở dạng nào.
 */
export function toArray(res) {
  const data = res?.content ?? res;
  return Array.isArray(data) ? data : [];
}
