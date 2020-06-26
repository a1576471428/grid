import {NgModule} from "@angular/core";
import {GridComponent} from "./grid.component";
import {
  NzButtonModule, NzCheckboxModule, NzDividerModule,
  NzFormModule,
  NzIconModule,
  NzInputModule,
  NzInputNumberModule, NzSpinModule,
  NzTableModule,
  NzToolTipModule
} from "ng-zorro-antd";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {GridService} from "./grid.service";

const COMPONENTS = [GridComponent]

@NgModule({
  imports: [
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzToolTipModule,
    NzIconModule,
    FormsModule,
    NzButtonModule,
    NzSpinModule,
    CommonModule,
    NzCheckboxModule,
    NzDividerModule,
  ],
  declarations: [...COMPONENTS]
})
export class GridModule {

}
