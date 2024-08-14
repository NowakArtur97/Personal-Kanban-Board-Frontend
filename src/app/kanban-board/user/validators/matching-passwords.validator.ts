import {
    AbstractControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn
} from '@angular/forms';
import { UserService } from '../services/user.service';

const ERROR_MESSAGE = "Passwords do not match.";

export const matchingPasswordsValidator = (userService: UserService): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const formGroup = control as FormGroup;
        const password = formGroup.get("password")!!;
        const matchingPassword = formGroup.get("matchingPassword")!!;
        const arePasswordsMatching = (password.value === '' && matchingPassword.value === '')
            || password.value === matchingPassword.value;
        if (arePasswordsMatching) {
            userService.removeError(ERROR_MESSAGE);
        } else {
            userService.addError(ERROR_MESSAGE);
        }
        return arePasswordsMatching ? null : { passwordsDoNotMatch: true };
    };
};