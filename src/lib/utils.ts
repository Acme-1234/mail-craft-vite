import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function replacePlaceholders(
  content: string,
  placeholders: Record<string, string>
): string {
  let processedContent = content;

  Object.entries(placeholders).forEach(([field, value]) => {
    const regex = new RegExp(`\\{\\{\\s*${field.trim()}\\s*\\}\\}`, "g");
    processedContent = processedContent.replace(regex, value);
  });

  return processedContent;
}
