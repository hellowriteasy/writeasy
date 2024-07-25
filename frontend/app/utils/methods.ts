export function divideNewlinesByTwo(text: string): string {
  return text.replace(/(\n+)/g, (match) => {
    const newlineCount = match.length;
    const newNewlineCount = Math.floor(newlineCount / 2); // Divide by 2
    return "\n".repeat(newNewlineCount); // Repeat \n newNewlineCount times
  });
}
