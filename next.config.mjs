/** HehuLab website: built as plain files (static export) so it can live on S3 + CloudFront. */
const nextConfig = {
  output: "export",
  trailingSlash: true, // /pricing/ -> pricing/index.html, which S3 serves directly
  images: { unoptimized: true },
};
export default nextConfig;
