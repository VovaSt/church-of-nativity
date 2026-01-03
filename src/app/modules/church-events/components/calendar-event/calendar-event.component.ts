import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CalendarEventColor } from 'src/app/core/enums/calendar.enum';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { CalendarEventData } from 'src/app/core/types/calendar.type';


@Component({
  selector: 'app-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarEventComponent implements OnInit {
    @Input() event: CalendarEventData;
    color: string;
    expanded: boolean = false;

    constructor(
        private calendarService: CalendarService
    ) {

    }

    ngOnInit(): void {
        this.color = CalendarEventColor[this.event.type];
    }
}
