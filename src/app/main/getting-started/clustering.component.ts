import { Component,EventEmitter,Input,Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
        selector:'gsclustering-app',
        templateUrl:'./clustering.component.html',
        animations: [appModuleAnimation()]
})
export class GSClusteringComponent{
@Output() onClick=new EventEmitter();
change(i:number){
        this.onClick.emit(i);
}
}