import{Component,Injector} from '@angular/core';
import{AppComponentBase}from'@shared/common/app-component-base';
import{appModuleAnimation} from '@shared/animations/routerTransition';

@Component({
    templateUrl:'./dashboard-schedule.component.html',
    animations:[appModuleAnimation()]
})

export class dashboardscheduleComponent extends AppComponentBase{
    constructor(
        injector:Injector
    ){
        super(injector)
    }
}