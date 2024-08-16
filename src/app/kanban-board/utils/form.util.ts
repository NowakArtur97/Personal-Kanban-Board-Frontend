import { FormControl } from "@angular/forms";

export default class FormUtil {
    static formErrors(formControl: FormControl, controlName: string, minLength = 0, maxLength = 0): string[] {
        const errors: string[] = [];
        if (formControl.hasError('required')) {
            errors.push(`${controlName} cannot be empty.`);
        }
        if (formControl.hasError('minlength') || formControl.hasError('maxlength')) {
            errors.push(`${controlName} must be between ${minLength} and ${maxLength} characters.`);
        }
        if (formControl.hasError('email')) {
            errors.push("Email must be a valid email address.");
        }
        return errors;
    }
}