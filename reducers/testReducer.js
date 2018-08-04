const initialState = {
    text: 'test',
    test2: 'test2',
}

const savePassword = (state = initialState, action) => {
    switch(action.type) {
        case 'TEST_TEST':
            return Object.assign({}, state, {
                test: 'new',
            })
        default:
            return state;
    }
}

export default savePassword;