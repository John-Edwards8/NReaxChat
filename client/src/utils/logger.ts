const getTimestamp = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export const logger = {
    debug: (...args: Parameters<typeof console.debug>) =>
        console.debug(`%c[DEBUG ${getTimestamp()}]`, 'color: gray', ...args),

    info: (...args: Parameters<typeof console.info>) =>
        console.info(`%c[INFO ${getTimestamp()}]`, 'color: blue', ...args),

    warn: (...args: Parameters<typeof console.warn>) =>
        console.warn(`%c[WARN ${getTimestamp()}]`, 'color: orange', ...args),

    error: (...args: Parameters<typeof console.error>) =>
        console.error(`%c[ERROR ${getTimestamp()}]`, 'color: red', ...args),
};