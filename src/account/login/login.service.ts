import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenAuthServiceProxy, AuthenticateModel, AuthenticateResultModel, ExternalLoginProviderInfoModel, ExternalAuthenticateModel, ExternalAuthenticateResultModel } from '@shared/service-proxies/service-proxies';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';
import { LogService } from '@abp/log/log.service';
import { TokenService } from '@abp/auth/token.service';
import { WorkspaceService } from '@shared/service-proxies/ids-workspace-service-proxies';
import { LoadingService } from '@shared/service-proxies/ids-service-proxies';
import * as _ from 'lodash';
@Injectable()
export class LoginService {

    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;

    //externalLoginProviders: ExternalLoginProvider[] = [];

    rememberMe: boolean;

    constructor(
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router,
        private load: LoadingService,
        private _tokenService: TokenService,
        private _logService: LogService, private wservice: WorkspaceService
    ) {
        this.clear();
    }

    authenticate(finallyCallback?: () => void): void {
        finallyCallback = finallyCallback || (() => { });

        //We may switch to localStorage instead of cookies

        this._tokenAuthService
            .authenticate(this.authenticateModel)
            .finally(finallyCallback)
            .subscribe((result: AuthenticateResultModel) => {
                this.processAuthenticateResult(result);
            });
    }



    init(): void {

    }

    private processAuthenticateResult(authenticateResult: AuthenticateResultModel) {
        this.authenticateResult = authenticateResult;
        if (authenticateResult.accessToken) {
            //Successfully logged in
            debugger;
          this.load.start()
            this.wservice.getWorkspacelist().subscribe(res => {
                this.load.stop()
                this.wservice.workspacelist = res;
            });
            localStorage.setItem('userId', JSON.stringify(authenticateResult.userId));
            localStorage.setItem('userName', this.authenticateModel.userNameOrEmailAddress);
            localStorage.setItem('session', authenticateResult.accessToken);
            this.login(authenticateResult.accessToken, 8600, this.rememberMe, null);

        } else {
            //Unexpected result!
            abp.notify.warn("Unauthorized user");
            //this._logService.warn('Unexpected authenticateResult!');
            this._router.navigate(['login']);

        }
    }

    private login(accessToken: string, expireInSeconds: number, rememberMe?: boolean, twoFactorRememberClientToken?: string): void {
        this._tokenService.setToken(
            accessToken,
            rememberMe ? (new Date(new Date().getTime() + 1000 * expireInSeconds)) : undefined
        );



        var initialUrl = UrlHelper.initialUrl;
        if (initialUrl.indexOf('/login') > 0) {
            initialUrl = AppConsts.appBaseUrl;
        }
        debugger;
        if (localStorage.getItem('session') !== undefined && localStorage.getItem('session') !== null)
            location.href = AppConsts.appBaseUrl + '/getting-started';
        else initialUrl = AppConsts.appBaseUrl+"login";
    }

    private clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }

}