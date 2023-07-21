import { catchError, of } from "rxjs";
import { AccountService } from "../_Services/account.service";


export function appInitializer(accountService: AccountService) {
    return () => {
        // const account = accountService.Value;
        //     if (account && account.token) {
        //         console.log(account?.token)
        //         return of(account.token);
        //     } else {
        //         return of();
        //     }
    };
    // return () => {
    //     const account = accountService.Value;
    //     if (account && account.token) {
    //         console.log(account?.token)
    //         return of(account.token);
    //     } else {
    //         return of();
    //     }
    // };
}