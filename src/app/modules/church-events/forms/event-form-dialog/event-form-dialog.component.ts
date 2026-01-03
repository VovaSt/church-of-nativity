import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEventData } from 'src/app/core/types/calendar.type';
import { EventFormComponent } from '../event-form/event-form.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CalendarApiService } from 'src/app/core/services/calendar-api.service';
import { CalendarService } from 'src/app/core/services/calendar.service';

@Component({
  selector: 'app-event-form-dialog',
  templateUrl: './event-form-dialog.component.html',
  styleUrls: ['./event-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventFormDialogComponent implements OnInit, AfterViewInit {
    title: string;
    isDisabled$: Observable<boolean>;

    @ViewChild("form") formComponent: EventFormComponent;

    constructor(
        public dialogRef: MatDialogRef<EventFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CalendarEventData | null,
        private calendarApiService: CalendarApiService,
        private calendarService: CalendarService
    ) {}

    ngOnInit(): void {
        this.title = `${this.data ? "Редагування" : "Створення"} події`;
    }

    ngAfterViewInit(): void {
        this.isDisabled$ = this.formComponent.eventForm.statusChanges.pipe(
            startWith("INVALID"),
            map(status => status === "INVALID")
        );
    }

    save() {
        const request = { ...this.formComponent.eventForm.value };
        if (request.date.toDate) request.date = request.date.toDate();
        request.id = new Date(request.date).getTime();
        request.date = this.calendarService.formatDate(request.date);
        this.calendarApiService.addNewEvent(request)
            .subscribe(response => response && this.dialogRef.close());
    }
}
