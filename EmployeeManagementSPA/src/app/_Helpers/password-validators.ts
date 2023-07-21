import {AbstractControl} from "@angular/forms";

export class PasswordValidators {
    constructor(){}

    static MatchValidator(control:AbstractControl)
    {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;

        if (!confirmPassword?.length) {
            return null as any;
        }
        
        if(confirmPassword.length < 8 )
        {
            control.get('confirmPassword')?.setErrors({minLength : true})
        }
        else if(confirmPassword.length > 20)
        {
            control.get('confirmPassword')?.setErrors({maxLength : true})
        }
        else{
            if(password !== confirmPassword){
                control.get('confirmPassword')?.setErrors({mismatch:true})
            }
            else {
                return null;
            }
        }
       
    }
}
