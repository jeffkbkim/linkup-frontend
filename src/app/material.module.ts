import {MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule, MatToolbarModule} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule, MatToolbarModule],
  exports: [MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule, MatToolbarModule],
})
export class MaterialModule { }