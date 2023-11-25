import { SixComponent } from './six/six.component';
import { RegressivoComponent } from './regressivo/regressivo.component';
import { CaboComponent } from './cabo/cabo.component';
import { MaletaComponent } from './maleta/maleta.component';
import { SeletorComponent } from './seletor/seletor.component';
import { PontosComponent } from './pontos/pontos.component';
import { ColinaComponent } from './colina/colina.component';
import { TesteComponent } from './teste/teste.component';
import { ContadorComponent } from './contador/contador.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  { path: 'contador', component: ContadorComponent },
  { path: 'rei-da-colina', component: ColinaComponent },
  { path: 'regressivo', component: RegressivoComponent },
  { path: 'pontos', component: PontosComponent },
  { path: 'teste', component: TesteComponent },
  { path: 'six', component: SixComponent },
  { path: 'maleta', component: MaletaComponent },
  { path: 'cabo', component: CaboComponent },
  { path: 'seletor', component: SeletorComponent },
  {path: '', pathMatch: 'full', redirectTo: 'maleta' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
