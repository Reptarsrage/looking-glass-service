// filter(Boolean) typescript friendly replacement #1
export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// filter(Boolean) typescript friendly replacement #2
type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T;
export function truthy<T>(value: T): value is Truthy<T> {
  return Boolean(value);
}

// Takes an image and sizes it down (preserving aspect ratio).
// Returns the new width and height.
export function clampImageDimensions(originalWidth: number, originalHeight: number, clampTo: number): number[] {
  let clamp_width = Math.min(originalWidth, clampTo);
  let clamp_height = Math.min(originalHeight, clampTo);

  if (originalWidth > originalHeight) {
    clamp_height = (originalHeight / originalWidth) * clamp_width;
  } else {
    clamp_width = (originalWidth / originalHeight) * clamp_height;
  }

  return [clamp_width, clamp_height];
}
