type CounterMap = {
    [key: string]: number;
};

const counters: CounterMap = {};

export function initCounter(entity: string, initialValue: number) {
    counters[entity] = initialValue;
}

export function getNextId(entity: string) {
    if (counters[entity] === undefined) {
        counters[entity] = 0;
    }
    counters[entity] += 1;
    return counters[entity];
}