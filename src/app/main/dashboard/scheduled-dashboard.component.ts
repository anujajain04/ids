import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './scheduled-dashboard.component.html',
    animations: [appModuleAnimation()]
})
export class scheduledDashboardcomponent extends AppComponentBase {

    constructor(
        injector: Injector
    ) {
        super(injector)
    }
}