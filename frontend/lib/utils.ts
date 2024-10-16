import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToMiddle(e: HTMLElement) {
  e.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });
}

export function limitValue(v: number, min: number, max: number) {
  if (v < min) {
    return min;
  }

  if (v > max) {
    return max;
  }

  return v;
}

export function onNextResize(element: HTMLElement, callback: () => void) {
  const observer = new ResizeObserver(() => {
    callback()
    observer.disconnect();
  });
  observer.observe(element);
}