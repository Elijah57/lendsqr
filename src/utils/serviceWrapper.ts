

type ServiceFn<T> = (...args: any[]) => Promise<T>;

export const serviceWrapper = <T>(fn: ServiceFn<T>): ServiceFn<T> => {
    return (...args: any[]) =>
        Promise.resolve(fn(...args)).catch((error) => {
            console.error("Service error:", error);
            throw error;
        });
};

