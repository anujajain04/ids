import {Component,Injector} from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
   selector:'configure-analysis-app',
    templateUrl:'./configure-analysis.component.html',
    animations:[appModuleAnimation()]
})

export class ConfigureAnalysisComponent extends AppComponentBase{

constructor(
    injector:Injector
    )
    {
         super(injector);
        }
    
        
    

}
