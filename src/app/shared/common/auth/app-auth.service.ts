import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';

@Injectable()
export class AppAuthService {

    logout(reload?: boolean): void {
        localStorage.removeItem('userId');
        localStorage.removeItem('session');
        localStorage.clear();
        abp.auth.clearToken();
        location.href = AppConsts.appBaseUrl;
        if (reload !== false) {
            location.href = AppConsts.appBaseUrl;
        }
    }
    reset(reload?: boolean): void {
        var userId = JSON.parse(localStorage.getItem('userId'));
        localStorage.setItem('tempUserID', JSON.stringify(userId));
        localStorage.removeItem('userId');

        abp.auth.clearToken();
        if (reload !== false) {
            location.href = AppConsts.appBaseUrl + "/reset-password";
        }
    }
}