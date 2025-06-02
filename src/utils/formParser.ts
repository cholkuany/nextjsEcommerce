type ParsedFormData = {
  fields: Record<string, string>;
  files: Record<string, File[]>;
};

export function parseFormData(
  formData: FormData,
  fileKeys: string[] = []
): ParsedFormData {
  const fields: Record<string, string> = {};
  const files: Record<string, File[]> = {};

  for (const [key, value] of formData.entries()) {
    if (fileKeys.includes(key)) {
      const file = value as File;
      if (!files[key]) files[key] = [];
      files[key].push(file);
    } else {
      fields[key] = value.toString();
    }
  }

  return { fields, files };
}
