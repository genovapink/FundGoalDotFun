export function extractIframeSrc(iframeHtml: string): string | null {
  const match = iframeHtml.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}
