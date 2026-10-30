/** HehuLab website: built as plain files (static export) so it can live on S3 + CloudFront. */
const nextConfig = {
  output: "export",
  trailingSlash: true, // /pricing/ -> pricing/index.html, which S3 serves directly
  images: { unoptimized: true },
  // Only for Claude's live preview panel (its host reserves "_next"): load the site files from /n/_next/.
  assetPrefix: process.env.PREVIEW ? "/n" : undefined,
};
export default nextConfig;
