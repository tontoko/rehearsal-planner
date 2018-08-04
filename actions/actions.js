export const SAVE_PASSWORD = "SAVE_PASSWORD";
export const TEST_TEST = "TEST_TEST";

export const savePassword = (bool) => {
    return {
        type: 'SAVE_PASSWORD',
        bool
    }
}

export const test = (text) => {
    return {
        type: 'TEST_TEST',
        text
    }
}