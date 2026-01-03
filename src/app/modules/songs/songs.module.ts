import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongsPageComponent } from './songs-page/songs-page.component';
import { SongsRoutingModule } from './songs-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SongsPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SongsRoutingModule,
    ReactiveFormsModule
  ]
})
export class SongsModule { }
