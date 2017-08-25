import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AnalysisService } from '@shared/service-proxies/ids-analysis-service-proxies';
@Component({
    selector: 'layout',
    templateUrl: './Layout-selection.html',
    animations: [appModuleAnimation()]
})

export class LayoutComponent {

    constructor() {
        AnalysisService.isAnalysisPage = true;
    }




}
