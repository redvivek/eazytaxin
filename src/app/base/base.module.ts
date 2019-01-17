import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header';
import { SidemenusComponent } from './sidemenus';

@NgModule({
  declarations: [HeaderComponent, SidemenusComponent],
  imports: [
    CommonModule
  ],
  exports: [HeaderComponent,SidemenusComponent],
})
export class BaseModule { }
