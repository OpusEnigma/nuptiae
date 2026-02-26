/* URL path construction utility */

const basePath = import.meta.env.BASE_URL;

export function getBasePath(): string {
  return basePath;
}

export function getPath(path: string): string {
  /* Ensure path starts with / */
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  /* Remove trailing slash from basePath for joining */
  const base = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  
  return base === "" ? cleanPath : `${base}${cleanPath}`;
}

export function getRitualPath(): string {
  return getPath("/rituals");
}

export function getLocationPath(): string {
  return getPath("/location");
}

export function getRegionPath(): string {
  return getPath("/region");
}

export function getSeasonPath(): string {
  return getPath("/season");
}

export function getHomePath(): string {
  return getPath("/");
}
