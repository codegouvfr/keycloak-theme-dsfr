export function removeUndefinedProperties<T extends Record<string, unknown>>(obj: T): T {
    const newObj = { ...obj };

    for (const key in newObj) {
        if (newObj[key] === undefined) {
            delete newObj[key];
        }
    }
    return newObj;
}
