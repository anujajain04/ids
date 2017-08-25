import { Component, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, ResetPasswordInput, ResetPasswordOutput } from '@shared/service-proxies/service-proxies';
import { AuthenticateModel, AuthenticateResultModel, PasswordComplexitySetting, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { LoginService } from '../login/login.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppUrlService } from '@app/shared/common/nav/app-url.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { Location } from '@angular/common';

@Component({
    templateUrl: './reset-password.component.html',
    animations: [accountModuleAnimation()]
})
export class ResetPasswordComponent extends AppComponentBase implements OnInit {

    model: ResetPasswordInput = new ResetPasswordInput();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    saving: boolean = false;

    constructor(     
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private _location: Location,
        private _activatedRoute: ActivatedRoute,
        private _loginService: LoginService,
        private _appUrlService: AppUrlService,
        private _appSessionService: AppSessionService,
        private _profileService: ProfileServiceProxy
    ) {
        super(injector);
        debugger
    }

    ngOnInit(): void {
      debugger
        // this.model.username = this._activatedRoute.snapshot.queryParams["username"];
        // this.model.password = this._activatedRoute.snapshot.queryParams["password"];
        // this.model.new_password = this._activatedRoute.snapshot.queryParams["new_password"];

        // this._appSessionService.changeTenantIfNeeded(
        //     this.parseTenantId(
        //         this._activatedRoute.snapshot.queryParams["tenantId"]
        //     )
        // );

        // this._profileService.getPasswordComplexitySetting().subscribe(result => {
        //     this.passwordComplexitySetting = result.setting;
        // });
    }

    backClicked(val: any) {
        debugger
        var userId = JSON.parse(localStorage.getItem('tempUserID'));
        localStorage.setItem('userId', JSON.stringify(userId));
         localStorage.removeItem('tempUserID');
        this._location.back();
    }

    save(): void {
        debugger
        this.saving = true;
        this._accountService.resetPassword(this.model)
            .finally(() => { this.saving = false; })
            .subscribe((result: ResetPasswordOutput) => {
                if (!result.canLogin) {
                     this.message.success("Password changed succsessfully","Done").done(() => {
                      this._router.navigate(['/login']);
                     });                   
                    return;
                }

                //Autheticate
                this.saving = true;
                this._loginService.authenticateModel.userNameOrEmailAddress = result.userName;
                this._loginService.authenticateModel.password = this.model.password;
                this._loginService.authenticate(() => { this.saving = false; });
            });
    }

    parseTenantId(tenantIdAsStr?: string): number {
        debugger
        let tenantId = !tenantIdAsStr ? undefined : parseInt(tenantIdAsStr);
        if (tenantId === NaN) {
            tenantId = undefined;
        }

        return tenantId;
    }
}