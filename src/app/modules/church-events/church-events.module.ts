import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';

import { SharedModule } from './../../shared/shared.module';
import { CalendarBodyComponent } from './components/calendar-body/calendar-body.component';
import { ChurchEventsComponent } from './containers/church-events/church-events.component';
import { ChurchEventsRoutingModule } from './church-event-routing.module';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { CalendarToolbarComponent } from './components/calendar-toolbar/calendar-toolbar.component';
import { EventTypeFilterComponent } from './components/calendar-toolbar/components/event-type-filter/event-type-filter.component';
import { CalendarEventComponent } from './components/calendar-event/calendar-event.component';
import { EventSearchComponent } from './components/calendar-toolbar/components/event-search/event-search.component';
import { EventFormDialogComponent } from './forms/event-form-dialog/event-form-dialog.component';
import { EventFormComponent } from './forms/event-form/event-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CalendarBodyComponent,
    ChurchEventsComponent,
    CalendarHeaderComponent,
    CalendarToolbarComponent,
    EventTypeFilterComponent,
    CalendarEventComponent,
    EventSearchComponent,
    EventFormDialogComponent,
    EventFormComponent
  ],
  imports: [
    CommonModule,
    ChurchEventsRoutingModule,
    SharedModule,
    MatStepperModule,
    CdkStepperModule,
    ReactiveFormsModule
  ]
})
export class ChurchEventsModule { }
