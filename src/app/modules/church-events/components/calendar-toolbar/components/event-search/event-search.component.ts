import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/core/services/calendar.service';


@Component({
  selector: 'app-event-search',
  templateUrl: './event-search.component.html',
  styleUrls: ['./event-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventSearchComponent implements OnInit {
    constructor(
        private calendarService: CalendarService
    ) {

    }

    ngOnInit(): void {

    }

    search(event) {
        this.calendarService.setSearchValue(event.target.value);
    }
}
