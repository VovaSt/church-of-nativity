import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarEventType } from 'src/app/core/enums/calendar.enum';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { CalendarEventTypeCheckbox } from 'src/app/core/types/calendar.type';


@Component({
  selector: 'app-event-type-filter',
  templateUrl: './event-type-filter.component.html',
  styleUrls: ['./event-type-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventTypeFilterComponent implements OnInit {
    typeFilter$: Observable<CalendarEventTypeCheckbox[]>;
    allTypesAreShown$: Observable<boolean>;
    areTypesShownPartly$: Observable<boolean>;

    constructor(
        private calendarService: CalendarService
    ) {
        this.typeFilter$ = this.calendarService.typeFilter$;
        this.allTypesAreShown$ = this.calendarService.allTypesAreShown$;
        this.areTypesShownPartly$ = this.calendarService.areTypesShownPartly$;
    }

    ngOnInit(): void {

    }

    checkTypes(type: CalendarEventType) {
        this.calendarService.changeTypeFilter(type);
    }

    checkAllTypes() {
        this.calendarService.changeAllTypeFilters();
    }
}
