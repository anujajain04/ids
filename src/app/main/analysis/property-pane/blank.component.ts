import { Component, Injector, OnDestroy } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
    selector: 'blank-pane',
    template:`<span></span>`
})

export class BlankComponent{
    constructor() {
    }
}
