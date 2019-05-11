import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FileSelectDirective, FileDropDirective, FileUploadModule } from 'ng2-file-upload';
import { AlertComponent } from './_components';

@NgModule({
imports: [
    CommonModule
],
declarations: [
    //FileUploadModule,
    //FileSelectDirective,
    AlertComponent
],
exports: [
    //FileUploadModule,
    //FileSelectDirective,
    AlertComponent
]
})
export class SharedModule {}