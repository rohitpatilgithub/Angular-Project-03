import { Routes } from '@angular/router';
import { ExamComponent } from '../components/exam/exam.component';
import { FormComponent } from '../components/form/form.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'app-form',
        pathMatch:'full'
    },
    {
        path:'app-form',
        component:FormComponent
    }
];
