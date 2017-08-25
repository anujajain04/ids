import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './workspaces-chart.component.html',
    animations: [appModuleAnimation()]
})
export class workspacechartComponent extends AppComponentBase {

    constructor(injector: Injector) {
        super(injector);
    }

}