import { AddressObject } from "mailparser";

export function formatAddresses(input?: AddressObject | AddressObject[]): string {
  if (!input) return "";

  const arr = Array.isArray(input) ? input : [input];

  const emails = arr.flatMap(obj => obj.value.map(v => v.address));

  return emails.join(", ");
}
