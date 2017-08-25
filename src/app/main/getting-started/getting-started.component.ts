import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './getting-started.component.html',
    animations: [appModuleAnimation()]
})
export class GettingStartedComponent extends AppComponentBase {

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

}