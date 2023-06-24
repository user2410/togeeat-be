export function separateFilenameAndExtension(filename: string) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return {
      filename: filename,
      extension: ''
    };
  }
  const filenamePart = filename.slice(0, lastDotIndex);
  const extensionPart = filename.slice(lastDotIndex + 1);
  return {
    fileName: filenamePart,
    fileExt: extensionPart
  };
}
