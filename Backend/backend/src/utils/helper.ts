export function extractIframeSrc(iframeHtml: string): string | null {
  console.log("Extracting iframe src from HTML:", iframeHtml);
  const match = iframeHtml.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}
