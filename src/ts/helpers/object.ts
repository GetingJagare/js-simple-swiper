export function cloneObject(sourceObj: object = {}): object {
    return JSON.parse(JSON.stringify(sourceObj));
}

export function mergeObjects(
    sourceObj: object = {},
    targetObj: object = {}): void {
        const keys = Object.keys(sourceObj);
        if (!keys.length) {
            return;
        }

        keys.forEach((k) => {
            const currentKey = k as keyof object;
            if (typeof sourceObj[currentKey] === 'object') {
                if (targetObj[currentKey] === undefined) {
                    (targetObj[currentKey] as object) = {};
                }
                mergeObjects(sourceObj[currentKey], targetObj[currentKey]);
            } else {
                targetObj[currentKey] = sourceObj[currentKey];
            }
        });
}