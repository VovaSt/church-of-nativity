import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarService } from 'src/app/core/services/calendar.service';


@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.component.html',
  styleUrls: ['./calendar-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarToolbarComponent implements OnInit {
    toolbarIsShown$: Observable<boolean>;

    constructor(
        private calendarService: CalendarService
    ) {
        this.toolbarIsShown$ = this.calendarService.toolbarIsShown$;
    }

    ngOnInit(): void {

    }
}
