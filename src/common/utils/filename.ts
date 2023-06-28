export function separateFilenameAndExtension(filename: string) : {
  fileName: string;
  fileExt: string;
} {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return {
      fileName: filename,
      fileExt: ''
    };
  }
  return {
    fileName: filename.slice(0, lastDotIndex),
    fileExt: filename.slice(lastDotIndex + 1)
  };
}
