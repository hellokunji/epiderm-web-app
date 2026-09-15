import { proxyUserUpload } from "@/lib/consult/upload-proxy";

export async function POST(request: Request) {
  return proxyUserUpload(
    request,
    "/api/v1/uploads/images",
    "Missing image file",
  );
}
