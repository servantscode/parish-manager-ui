export function extractSurname(input: string): string {
  var bits = input.trim().split(" ");
  return bits.length > 1? bits.pop(): '';
}