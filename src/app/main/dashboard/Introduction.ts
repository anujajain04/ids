import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AnalysisService } from '@shared/service-proxies/ids-analysis-service-proxies';
@Component({
    selector: 'intro',
    templateUrl: './Introduction.html',
    animations: [appModuleAnimation()]
})
    
export class InroductionComponent {

    constructor() {
        AnalysisService.isAnalysisPage = true;
    }




}
