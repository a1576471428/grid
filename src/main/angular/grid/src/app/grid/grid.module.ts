import {NgModule} from "@angular/core";
import {GridComponent} from "./grid.component";
import {
  NzButtonModule, NzCheckboxModule, NzDividerModule,
  NzFormModule,
  NzIconModule,
  NzInputModule,
  NzInputNumberModule, NzSpinModule,
  NzTableModule, NzTabsModule,
  NzToolTipModule
} from 'ng-zorro-antd';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {GridService} from "./grid.service";
import {NzSpaceModule} from 'ng-zorro-antd/space';

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
    NzTabsModule,
    NzSpaceModule,
  ],
  declarations: [...COMPONENTS]
})
export class GridModule {

}
