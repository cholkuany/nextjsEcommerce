import { v2 as cloudinary } from "cloudinary";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    paramsToSign: Record<string, string>;
  };

  const { paramsToSign } = body;

  // Initialize Cloudinary
  // cloudinary.config({
  //   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  //   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  //   api_secret: process.env.CLOUDINARY_API_SECRET,
  // });

  const apiSsecret = process.env.CLOUDINARY_API_SECRET as string;

  // Generate the signature
  const generatedSignature = cloudinary.utils.api_sign_request(
    paramsToSign,
    apiSsecret
  );

  // Return the signature and timestamp
  return Response.json({ generatedSignature });
  // return new Response(JSON.stringify({ generatedSignature })
  // , {
  //   headers: { "Content-Type": "application/json" },
  // });
}
