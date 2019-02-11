import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './_components';

@NgModule({
imports: [
    CommonModule
],
declarations: [
    AlertComponent
],
exports: [
    AlertComponent
]
})
export class SharedModule {}