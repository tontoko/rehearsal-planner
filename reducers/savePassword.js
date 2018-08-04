const initialState = {
    saved: true,
}

export const savePassword = (state = initialState, action) => {
    switch(action.type) {
        case 'SAVE_PASSWORD':
            return Object.assign({}, state, {
                saved: !state.saved,
            })
        default:
            return state;
    }
}
