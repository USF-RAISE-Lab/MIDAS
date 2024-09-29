export function Capitalize({
  input
}: {
  input: string;
}): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
