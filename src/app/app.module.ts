import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContadorComponent } from './contador/contador.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import {InputSwitchModule} from 'primeng/inputswitch';
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
import {ConfirmationService,MessageService} from 'primeng/api';
import {CheckboxModule} from 'primeng/checkbox';
import { BombComponent } from './bomb/bomb.component';
import { ChaveadoComponent } from './chaveado/chaveado.component';
import { SebastiaoComponent } from './sebastiao/sebastiao.component';
import { GridComponent } from './grid/grid.component';
import { DataMomentoPipe } from './data-momento.pipe';
import { TimestampPipe } from './timestamp.pipe';
import { DinheiroPipe } from './dinheiro.pipe';
import { BotaoComponent } from './botao/botao.component';
import { UtilService } from './util.service';
import { ToastModule } from 'primeng/toast';

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
    PadraoComponent,
    BombComponent,
    ChaveadoComponent,
    SebastiaoComponent,
    GridComponent,
    DataMomentoPipe,
    TimestampPipe,
    DinheiroPipe,
    BotaoComponent
  ],
  imports: [
    BrowserModule,
    ToastModule,
    DialogModule,
    TableModule,
    DropdownModule,
    InputSwitchModule,
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
  providers: [PrimeNGConfig,ConfirmationService,MessageService,UtilService],
  bootstrap: [AppComponent]
})
export class AppModule { }
