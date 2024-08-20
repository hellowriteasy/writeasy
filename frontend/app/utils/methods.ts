export function divideNewlinesByTwo(text: string): string {
  return text.replace(/(\n+)/g, (match) => {
    const newlineCount = match.length;
    const newNewlineCount = Math.floor(newlineCount / 2); // Divide by 2
    return "\n".repeat(newNewlineCount); // Repeat \n newNewlineCount times
  });
}


export function convertToHtml(text:string) {
  // Split the text by newline characters (\n)
  const lines = text.split("\n");

  // Initialize an empty array to store the HTML paragraphs
  const paragraphs:string[] = [];

  // Iterate through each line
  lines.forEach((line) => {
    // Add a <p> tag for each line
    paragraphs.push(`<p>${line.trim()}</p>`);
  });

  // Join the paragraphs into a single string and return
  return paragraphs.join("");
}
