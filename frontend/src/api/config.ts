const DEFAULT_API_BASE_URL = "https://shortlink-c8sm.onrender.com";
const LOCAL_API_PORT = "8000";

declare global {
  interface Window {
    __SHORTLINK_CONFIG__?: {
      API_BASE_URL?: string;
    };
  }
}

function normalizeBaseUrl(value: string | undefined) {
  return value?.trim().replace(/\/$/, "");
}

function isPrivateIpv4Host(hostname: string) {
  if (/^10(?:\.\d{1,3}){3}$/.test(hostname)) {
    return true;
  }

  if (/^192\.168(?:\.\d{1,3}){2}$/.test(hostname)) {
    return true;
  }

  const match = hostname.match(/^172\.(\d{1,3})(?:\.\d{1,3}){2}$/);
  if (!match) {
    return false;
  }

  const secondOctet = Number(match[1]);
  return secondOctet >= 16 && secondOctet <= 31;
}

function isLocalHost(hostname: string) {
  const normalizedHost = hostname.toLowerCase();

  return (
    normalizedHost === "localhost" ||
    normalizedHost === "127.0.0.1" ||
    normalizedHost === "0.0.0.0" ||
    normalizedHost === "::1" ||
    normalizedHost === "[::1]" ||
    normalizedHost === "host.docker.internal" ||
    normalizedHost.endsWith(".local") ||
    isPrivateIpv4Host(normalizedHost)
  );
}

function getLocalApiBaseUrl(hostname: string) {
  const normalizedHost = hostname.toLowerCase();

  if (normalizedHost === "localhost" || normalizedHost === "0.0.0.0") {
    return `http://127.0.0.1:${LOCAL_API_PORT}`;
  }

  if (normalizedHost === "::1" || normalizedHost === "[::1]") {
    return `http://[::1]:${LOCAL_API_PORT}`;
  }

  return `http://${hostname}:${LOCAL_API_PORT}`;
}

const runtimeConfigUrl = normalizeBaseUrl(window.__SHORTLINK_CONFIG__?.API_BASE_URL);
const viteConfigUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
const localHost = window.location.hostname;
const localApiBaseUrl = getLocalApiBaseUrl(localHost);

export const API_BASE_URL =
  (isLocalHost(localHost)
    ? viteConfigUrl || localApiBaseUrl || runtimeConfigUrl
    : runtimeConfigUrl) ||
  viteConfigUrl ||
  DEFAULT_API_BASE_URL;
