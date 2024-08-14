import {
    AbstractControl,
    AsyncValidatorFn,
    FormGroup,
    ValidationErrors
} from '@angular/forms';
import { Observable, map } from 'rxjs';
import { UserService } from '../services/user.service';

const ERROR_MESSAGE = "Username/email is already taken.";

export const availableUsernameAndEmailValidator = (userService: UserService): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const formGroup = control as FormGroup;
        const username = formGroup.get("username")!!.value;
        const email = formGroup.get("email")!!.value;
        return userService
            .isUsernameAndEmailAvailable(username, email)
            .pipe(
                map((isUsernameOrEmailAvailable: boolean) => {
                    if (isUsernameOrEmailAvailable) {
                        userService.removeError(ERROR_MESSAGE);
                    } else {
                        userService.addError(ERROR_MESSAGE);
                    }
                    return isUsernameOrEmailAvailable ? null
                        : { usernameAndEmailAlreadyTaken: true };
                })
            );
    };
};