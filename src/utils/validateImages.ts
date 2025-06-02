// Allowed image MIME types (add/remove as needed)
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/heic",
  "image/webp",
];

// Max file size = 5 MB
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function validateImages(files: File[]) {
  // 3. Validate each file’s MIME type and size
  for (const file of files) {
    // a) Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        message: "Invalid file type detected.",
        errors: {
          images: [
            `“${file.name}” is not a supported image format. Allowed: jpeg, png, gif, webp.`,
          ],
        },
      };
    }

    // b) Check file size
    if (file.size > MAX_SIZE_BYTES) {
      return {
        message: "File too large.",
        errors: {
          images: [
            `“${file.name}” is ${(file.size / (1024 * 1024)).toFixed(
              1
            )} MB, which exceeds the 5 MB limit.`,
          ],
        },
      };
    }
  }
}
