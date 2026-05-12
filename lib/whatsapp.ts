export function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  return digits;
}

export function createWhatsAppUrl(phoneNumber: string, message: string) {
  return `https://wa.me/${normalizeWhatsAppNumber(phoneNumber)}?text=${encodeURIComponent(message)}`;
}
