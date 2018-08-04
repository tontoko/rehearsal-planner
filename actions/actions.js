export const SAVE_PASSWORD = "SAVE_PASSWORD";
export const TEST_TEST = "TEST_TEST";

export const savePassword = (bool) => {
    return {
        type: 'SAVE_PASSWORD',
        bool
    }
}