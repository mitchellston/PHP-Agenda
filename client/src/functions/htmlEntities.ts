export function htmlEntities(str: string | null | undefined): string {
  if (str === null || str === undefined) {
    return "";
  }
  return String(str)
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}
