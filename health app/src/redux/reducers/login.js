import { FAILED_LOGIN, RESET_INVALID_MSG, SUCCESSFUL_LOGIN } from '../actions/loginActionConstants'

const initialState = {
    successfulLogin: false,
    failedLogin: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SUCCESSFUL_LOGIN:
            return {
                ...state, 
                successfulLogin: true
            }
        case FAILED_LOGIN:
            return {
                ...state,
                failedLogin: true
            }
        case RESET_INVALID_MSG:
            return {
                ...state,
                failedLogin: false
            }
        default:
            return state;
    }
}