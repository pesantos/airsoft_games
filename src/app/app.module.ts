import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContadorComponent } from './contador/contador.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';
import {SliderModule} from 'primeng/slider';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {SidebarModule} from 'primeng/sidebar';
import {InputNumberModule} from 'primeng/inputnumber';
import { PrimeNGConfig } from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { TesteComponent } from './teste/teste.component';
import { ColinaComponent } from './colina/colina.component';
import { PontosComponent } from './pontos/pontos.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SeletorComponent } from './seletor/seletor.component';
import { PainelDeSenhaComponent } from './painel-de-senha/painel-de-senha.component';
import { MaletaComponent } from './maleta/maleta.component';
import { TimerComponent } from './timer/timer.component';
import { CaboComponent } from './cabo/cabo.component';
import { RegressivoComponent } from './regressivo/regressivo.component';
import { SixComponent } from './six/six.component';
import {TabViewModule} from 'primeng/tabview';
import {RadioButtonModule} from 'primeng/radiobutton';
import { PadraoComponent } from './padrao/padrao.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {CheckboxModule} from 'primeng/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    ContadorComponent,
    TesteComponent,
    ColinaComponent,
    PontosComponent,
    SeletorComponent,
    PainelDeSenhaComponent,
    MaletaComponent,
    TimerComponent,
    CaboComponent,
    RegressivoComponent,
    SixComponent,
    PadraoComponent
  ],
  imports: [
    BrowserModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    SidebarModule,
    RadioButtonModule,
    TabViewModule,
    CheckboxModule,
    InputNumberModule,
    ConfirmDialogModule,
    ButtonModule,
    ProgressBarModule,
    RippleModule,
    SliderModule,
    ReactiveFormsModule,
    AppRoutingModule,
    InputTextModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [PrimeNGConfig,ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
