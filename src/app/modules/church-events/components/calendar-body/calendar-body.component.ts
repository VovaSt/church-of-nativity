import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CalendarEventColor, CalendarEventType } from 'src/app/core/enums/calendar.enum';
import { CalendarApiService } from 'src/app/core/services/calendar-api.service';
import { CalendarService, calendarData } from 'src/app/core/services/calendar.service';
import { CalendarCell, CalendarEvents, CalendarEventTypeCheckbox } from 'src/app/core/types/calendar.type';

@Component({
  selector: 'app-calendar-body',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarBodyComponent implements OnInit {
    today: string = "";
    weekCounter: number = 0;
    calendarCells$: Observable<CalendarCell[]>;
    data$: BehaviorSubject<CalendarEvents> = new BehaviorSubject<CalendarEvents>({});
    typeFilter$: Observable<CalendarEventTypeCheckbox[]>;

    notifier = new Subject();

    constructor(
        private calendarService: CalendarService,
        private calendarApiService: CalendarApiService,
    ) {
    }

    ngOnInit(): void {
        this.today = this.calendarService.formatDate(new Date());
        this.calendarCells$ = this.calendarService.calendarCells$;

        combineLatest([
            this.calendarApiService.events$,
            this.calendarService.typeFilter$,
            this.calendarService.searchValue$
        ]).pipe(
            map(([eventsData, types, search]) => {
                const data = JSON.parse(JSON.stringify(eventsData));

                for (let day in data) {
                    data[day].forEach((event, index) => {
                        const typeItem = types.find((item) => item.type === event.type);
                        const typeCondition = typeItem?.show || false;

                        const searchValue = search.toLowerCase();
                        const searchCondition = !search ||
                            (event.name || "").toLowerCase().includes(searchValue) ||
                            (event.place || "").toLowerCase().includes(searchValue) ||
                            (event.person || "").toLowerCase().includes(searchValue) ||
                            (event.preachers || []).some(p => p.toLowerCase().includes(searchValue)) ||
                            (event.singers || []).some(s => s.toLowerCase().includes(searchValue)) ||
                            (event.cars || []).some(c => c.toLowerCase().includes(searchValue));

                        data[day][index].show = typeCondition && searchCondition;
                    });
                }
                return data;
            }),
            takeUntil(this.notifier)
        )
        .subscribe(data => this.data$.next(data));
    }

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
    }
}
