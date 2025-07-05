import { FirebaseError } from "firebase/app";
export function cleanAuthError(error: FirebaseError) {

    let code = error.code;
    code = code.replace('auth/', '');
    switch (code) {
        case 'invalid-email':
            return 'Please enter a valid email address';
        case 'user-disabled':
            return 'This account has been disabled';
        case 'user-not-found':
            return 'No account found with this email or phone number';
        case 'wrong-password':
            return 'Incorrect password';
        case 'email-already-in-use':
            return 'An account with this email already exists';
        case 'account-exists-with-different-credential':
            return 'An account already exists with a different sign-in method';
        case 'invalid-credential':
            return 'Invalid sign-in credentials';
        case 'network-request-failed':
            return 'Check your internet connection and try again';
        case 'too-many-requests':
            return 'Too many attempts. Please try again later';
        case 'invalid-verification-code':
            return 'The verification code is invalid or expired';
        case 'missing-verification-code':
            return 'Please enter the verification code';
        case 'invalid-verification-id':
            return 'The verification ID is invalid';
        case 'session-expired':
            return 'The session has expired';
        case 'popup-closed-by-user':
            return 'You closed the sign-in popup';
        case 'no-auth-event':
            return 'Sign-in failed to complete';
        default:
            return 'Authentication failed';
    }

    return 'Something went wrong. Please try again.';

}   