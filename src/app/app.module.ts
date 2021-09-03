import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { LoggingInterceptor } from './logging.interceptor';

import { environment } from './../environments/environment';
import { AppComponent } from './app.component';
import { CalculatorComponent } from './calculator/calculator.component';

var logLevel = environment.production
  ? NgxLoggerLevel.INFO
  : NgxLoggerLevel.DEBUG;

@NgModule({
  declarations: [AppComponent, CalculatorComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxSliderModule,
    LoggerModule.forRoot({
      // serverLoggingUrl: '/api/logs',
      // serverLogLevel: NgxLoggerLevel.DEBUG,
      level: logLevel,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
