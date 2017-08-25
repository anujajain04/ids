import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({

    templateUrl: './analysis-history.component.html',
    animations: [appModuleAnimation()]
})

export class AnalysisHistoryComponent{

    constructor() {
    }

}
