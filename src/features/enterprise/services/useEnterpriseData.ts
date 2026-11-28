import { useEffect, useMemo, useState, type DependencyList } from "react";

interface Settled<T> {
    token: object;
    data: T | null;
    error: string | null;
}

export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
    const [tick, setTick] = useState(0);
    const [settled, setSettled] = useState<Settled<T> | null>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
    const token = useMemo(() => ({}), [...deps, tick]);

    useEffect(() => {
        let alive = true;
        fn()
            .then((data) => alive && setSettled({ token, data, error: null }))
            .catch((error: unknown) =>
                alive &&
                setSettled({
                    token,
                    data: null,
                    error: error instanceof Error ? error.message : "Something went wrong",
                }),
            );
        return () => {
            alive = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const current = settled?.token === token ? settled : null;
    return {
        data: settled?.data ?? null,
        error: current?.error ?? null,
        loading: current === null,
        reload: () => setTick((value) => value + 1),
    };
}

export function useDebounce<T>(value: T, delay = 400): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}
