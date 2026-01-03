import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { EventFormDialogComponent } from '../../forms/event-form-dialog/event-form-dialog.component';
import { CalendarApiService } from 'src/app/core/services/calendar-api.service';


@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarHeaderComponent implements OnInit {
    weekCounter: number = 0;
    title: string[] = [];
    toolbarIsShown$: Observable<boolean>;

    constructor(
        private calendarService: CalendarService,
        private calendarApiService: CalendarApiService,
        private dialog: MatDialog
    ) {
        this.title = this.calendarService.getWeekLabel();
        this.toolbarIsShown$ = this.calendarService.toolbarIsShown$;
    }

    ngOnInit(): void {
        this.fetchData();
    }

    getPreviosWeek() {
        this.weekCounter--;
        this.updateData();
    }

    getNextWeek() {
        this.weekCounter++;
        this.updateData();
    }

    updateData() {
        this.title = this.calendarService.getWeekLabel(this.weekCounter);
        this.calendarService.changeWeek(this.weekCounter);
    }

    toggleToolbar() {
        this.calendarService.toogleToolbar();
    }

    addEvent() {
        this.dialog.open(EventFormDialogComponent, {
            data: null,
            maxWidth: '94vw',
            width: '600px',
            autoFocus: false
        });
    }

    fetchData() {
        const { startDate, endDate } =
            this.calendarService.getWeekStartAndFinishTimes(this.weekCounter);
        this.calendarApiService.fetchEvents(startDate, endDate);
    }
}
