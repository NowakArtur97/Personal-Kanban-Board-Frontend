import {
    AbstractControl,
    AsyncValidatorFn,
    FormGroup,
    ValidationErrors
} from '@angular/forms';
import { EMPTY, Observable, map, of } from 'rxjs';
import { UserService } from '../services/user.service';

const ERROR_MESSAGE = "Username/email is already taken.";

export const availableUsernameAndEmailValidator = (userService: UserService): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<ValidationErrors> => {
        const formGroup = control as FormGroup;
        return userService
            .isUsernameAndEmailAvailable(formGroup.get("username")?.value,
                formGroup.get("email")?.value)
            .pipe(
                map((result: boolean) => {
                    return result ? EMPTY
                        : of({ usernameAndEmailAlreadyTaken: true });
                })
            );
    };
};