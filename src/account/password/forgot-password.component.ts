import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, SendPasswordResetCodeInput } from '@shared/service-proxies/service-proxies';
import { AppUrlService } from '@app/shared/common/nav/app-url.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './forgot-password.component.html',
    animations: [accountModuleAnimation()]
})
export class ForgotPasswordComponent extends AppComponentBase {

    model: SendPasswordResetCodeInput = new SendPasswordResetCodeInput();

    saving: boolean = false;

    constructor (
        injector: Injector, 
        private _accountService: AccountServiceProxy,
        private _appUrlService: AppUrlService,
        private _router: Router
        ) {
        super(injector);
    }

    save(): void {
        this.saving = true;
        this._accountService.sendPasswordResetCode(this.model)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.message.success("Contact your Network Administrator","Done").done(() => {
                    this._router.navigate(['/login']);
                });
                 // this._router.navigate(['/reset-password']);
            });
    }
}