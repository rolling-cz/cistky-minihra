import dict from "./en.json";
import { useEffect, useState, useMemo } from "react";

const STORAGE_KEY = "useEnglish";

let useEnglish =
    (typeof window !== "undefined" &&
        JSON.parse(localStorage.getItem(STORAGE_KEY) || "false")) || false;

const listeners = new Set();
function notify() { listeners.forEach((fn) => fn(useEnglish)); }

export function setUseEnglish(value) {
    useEnglish = Boolean(value);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(useEnglish)); } catch {}
    notify();
}

export function getUseEnglish() { return useEnglish; }

export function t(czechKey, vars) {
    const source = String(czechKey);
    if (!useEnglish) return interpolate(source, vars);
    const translated = dict[source];
    if (!translated) {
        console.warn(`"${source}": "EN${source}",`);
        return interpolate(source, vars);
    }
    return interpolate(translated, vars);
}

export function useLocalization() {
    const [flag, setFlag] = useState(useEnglish);
    useEffect(() => {
        const fn = (v) => setFlag(v);
        listeners.add(fn);
        return () => listeners.delete(fn);
    }, []);
    const tFn = useMemo(() => (txt, vars) => t(txt, vars), [flag]);
    return { useEnglish: flag, setUseEnglish, t: tFn };
}

function interpolate(text, vars) {
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, (_, key) =>
        Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : `{${key}}`
    );
}
