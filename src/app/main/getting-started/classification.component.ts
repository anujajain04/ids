import { Component,EventEmitter,Input,Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
        selector:'gsclassification-app',
        templateUrl:'./classification.component.html',
        animations: [appModuleAnimation()]
})
export class GSClassificationComponent{
@Output() onClick=new EventEmitter();
change(i:number){
        this.onClick.emit(i);
}
}