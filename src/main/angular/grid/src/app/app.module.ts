import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {zh_CN} from 'ng-zorro-antd/i18n';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {GridModule} from './grid/grid.module';
import {NzLayoutModule, NzPageHeaderModule} from 'ng-zorro-antd';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    GridModule,
    NzLayoutModule,
    NzPageHeaderModule,
  ],
  providers: [{provide: NZ_I18N, useValue: zh_CN}, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
