/**
 * 确保图片URL包含域名
 * @param url 图片URL
 * @param baseUrl 基础域名，默认为import.meta.env.VITE_API_BASE_URL
 * @returns 完整的图片URL
 */
export function ensureImageUrl(url: string, baseUrl = 'https://oss.chenggnet.com'): string {
  if (!url) return '';

  // 如果已经是完整URL(http/https开头)或者以base64开头，直接返回
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:image')) {
    return url;
  }

  // 移除url开头可能存在的斜杠
  const cleanUrl = url.replace(/^\//, '');

  // 处理baseUrl不存在的情况
  if (!baseUrl) {
    // return cleanUrl;
    baseUrl = 'https://oss.chenggnet.com';
  }

  // 移除baseUrl结尾可能存在的斜杠
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');

  return `${cleanBaseUrl}/${cleanUrl}`;
}

/**
 * 图片URL处理工具
 * 使用示例：
 * import { ensureImageUrl } from '@/utils/imageHelper';
 *
 * const fullUrl = ensureImageUrl(item.logo, 'https://example.com');
 */
