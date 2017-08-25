import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
    selector: 'tokenfacebook',
    templateUrl: './facebook-token.component.html',
    animations: [appModuleAnimation()]
})

export class TokenFacebookDatasetComponent {

    constructor(private _location: Location, private _router: Router) {
    }
    back() {
        this._location.back();
    }
}