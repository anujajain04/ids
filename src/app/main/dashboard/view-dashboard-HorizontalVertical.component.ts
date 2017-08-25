import {Component,Injector} from'@angular/core';
import{AppComponentBase} from '@shared/common/app-component-base';
import{appModuleAnimation} from '@shared/animations/routerTransition';

@Component({
    templateUrl:'./view-dashboard-HorizontalVertical.component.html',
    animations:[appModuleAnimation()]
})

export class viewdashboardHorizontalVerticalComponent extends AppComponentBase{
    constructor(
        injector:Injector
    ){
        super(injector)
    }
}


