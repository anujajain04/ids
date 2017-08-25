import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataSetComponent } from '../app/main/getting-started/dataset.component';
const routes: Routes = [
    { path: 'getting-started', component: DataSetComponent, data: { breadcrumb: "Getting Started" } },
    { path: '', redirectTo: 'getting-started', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }