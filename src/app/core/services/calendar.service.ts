import { Injectable } from '@angular/core';
import addMonths from 'date-fns/addMonths';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import startOfMonth from 'date-fns/startOfMonth';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import format from 'date-fns/format';
import { CalendarEventColor, CalendarEventType } from '../enums/calendar.enum';
import addWeeks from 'date-fns/addWeeks';
import startOfWeek from 'date-fns/startOfWeek';
import lastDayOfWeek from 'date-fns/lastDayOfWeek';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarCell, CalendarEvents, CalendarEventTypeCheckbox } from '../types/calendar.type';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

    private _toolbarIsShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public toolbarIsShown$: Observable<boolean> = this._toolbarIsShown$.asObservable();

    private _typeFilter$: BehaviorSubject<CalendarEventTypeCheckbox[]> =
        new BehaviorSubject<CalendarEventTypeCheckbox[]>(typeFilters);
    public typeFilter$: Observable<CalendarEventTypeCheckbox[]> =
        this._typeFilter$.asObservable();
    public allTypesAreShown$: Observable<boolean> = this._typeFilter$
        .asObservable()
        .pipe(map(value => value.every(item => item.show)));
    public areTypesShownPartly$: Observable<boolean> = this._typeFilter$
        .asObservable()
        .pipe(map(value => !value.every(item => item.show) && !value.every(item => !item.show)));

    private _searchValue$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    public searchValue$: Observable<string> = this._searchValue$.asObservable();

    private _eventsData$: BehaviorSubject<CalendarEvents> =
        new BehaviorSubject<CalendarEvents>(calendarData);
    public eventsData$: Observable<CalendarEvents> =
        this._eventsData$.asObservable();

    private _calendarCells$: BehaviorSubject<CalendarCell[]> =
        new BehaviorSubject<CalendarCell[]>(this.getEachDayOfWeek())
    public calendarCells$: Observable<CalendarCell[]> =
        this._calendarCells$.asObservable();

    constructor() { }

    public getMonthLabel(monthCount: number = 0): string {
        const date: Date = addMonths(new Date(), monthCount);
        const formatter = new Intl.DateTimeFormat(
            "ua",
            { month: "long", year: "numeric" }
        );
        const label = formatter.format(date);
        return label.charAt(0).toUpperCase() + label.slice(1);
    }

    public getWeekLabel(weekCount: number = 0): string[] {
        const date: Date = addWeeks(new Date(), weekCount);
        const formatter = new Intl.DateTimeFormat(
            "ua",
            { day: "numeric", month: "short", year: "numeric" }
        );
        const firstDay = startOfWeek(date, { weekStartsOn: 1 });
        const lastDay = lastDayOfWeek(date, { weekStartsOn: 1 });
        return [
            formatter.format(firstDay),
            formatter.format(lastDay)
        ];
    }

    public getWeekStartAndFinishTimes(weekCount: number = 0): any {
        const date: Date = addWeeks(new Date(), weekCount);
        const date2: Date = addWeeks(new Date(), weekCount + 1);
        const firstDay = startOfWeek(date, { weekStartsOn: 1 });
        const lastDay = startOfWeek(date2, { weekStartsOn: 1 });
        return {
            startDate: firstDay.getTime(),
            endDate: lastDay.getTime() - 1
        };
    }

    private getEachDayOfMonth(monthCount: number = 0): CalendarCell[] {
        const date: Date = addMonths(new Date(), monthCount);
        const formatter = new Intl.DateTimeFormat("ua", { weekday: "short" });
        const firstDay = startOfMonth(date);
        const lastDay = lastDayOfMonth(date);

        return eachDayOfInterval({ start: firstDay, end: lastDay })
            .map((date) => ({
                id: this.formatDate(date),
                date,
                nameOfDay: formatter.format(date),
            }));
    }

    private getEachDayOfWeek(weekCount: number = 0): CalendarCell[] {
        const date: Date = addWeeks(new Date(), weekCount);
        const formatter = new Intl.DateTimeFormat("ua", { weekday: "short" });
        const firstDay = startOfWeek(date, { weekStartsOn: 1 });
        const lastDay = lastDayOfWeek(date, { weekStartsOn: 1 });

        return eachDayOfInterval({ start: firstDay, end: lastDay })
            .map((date) => ({
                id: this.formatDate(date),
                date,
                nameOfDay: formatter.format(date),
            }));
    }

    public formatDate(date): string {
        date = date || new Date();
        return format(date, 'dd-MM-yyyy');
    }

    public toogleToolbar(): void {
        this._toolbarIsShown$.next(!this._toolbarIsShown$.value);
    }

    public changeTypeFilter(type: CalendarEventType): void {
        const oldValue = [...this._typeFilter$.value];
        const index = oldValue.findIndex(item => item.type === type);
        if (index >= 0) {
            oldValue[index].show = !oldValue[index].show;
            this._typeFilter$.next(oldValue);
        }
    }

    public changeAllTypeFilters(): void {
        const oldValue = [...this._typeFilter$.value];
        const isEveryTypeShown = oldValue.every(item => item.show);
        oldValue.map(item => {
            item.show = !isEveryTypeShown;
            return item;
        });
        this._typeFilter$.next(oldValue);
    }

    public changeWeek(weekCount: number = 0): void {
        const data = this.getEachDayOfWeek(weekCount);
        this._calendarCells$.next(data);
    }

    public setSearchValue(value: string): void {
        this._searchValue$.next(value);
    }

    public getPlaces(): string[] {
        return JSON.parse(localStorage.getItem("places")) || [];
    }

    public getPreachers(): string[] {
        return JSON.parse(localStorage.getItem("preachers")) || [];
    }

    public getSingers(): string[] {
        return JSON.parse(localStorage.getItem("singers")) || [];
    }

    public getCars(): string[] {
        return JSON.parse(localStorage.getItem("cars")) || [];
    }
}

export const typeFilters = [
    {
        label: "загальне служіння",
        type: CalendarEventType.загальне_служіння,
        color: CalendarEventColor[CalendarEventType.загальне_служіння],
        show: true
    },
    {
        label: "молитва",
        type: CalendarEventType.молитва,
        color: CalendarEventColor[CalendarEventType.молитва],
        show: true
    },
    {
        label: "домашня група",
        type: CalendarEventType.домашня_група,
        color: CalendarEventColor[CalendarEventType.домашня_група],
        show: true
    },
    {
        label: "недільна школа",
        type: CalendarEventType.недільна_школа,
        color: CalendarEventColor[CalendarEventType.недільна_школа],
        show: true
    },
    {
        label: "молодіжне",
        type: CalendarEventType.молодіжне,
        color: CalendarEventColor[CalendarEventType.молодіжне],
        show: true
    },
    {
        label: "євангелізація",
        type: CalendarEventType.євангелізація,
        color: CalendarEventColor[CalendarEventType.євангелізація],
        show: true
    },
    {
        label: "табір",
        type: CalendarEventType.табір,
        color: CalendarEventColor[CalendarEventType.табір],
        show: true
    },
    {
        label: "музичне служіння",
        type: CalendarEventType.музичне_служіння,
        color: CalendarEventColor[CalendarEventType.музичне_служіння],
        show: true
    },
    {
        label: "інше",
        type: CalendarEventType.інше,
        color: CalendarEventColor[CalendarEventType.інше],
        show: true
    },
]

export const calendarData: CalendarEvents = {
    "07-10-2024": [
        {
            name: "Загальноцерковна молитва",
            start: "9:00",
            finish: "10:00",
            type: CalendarEventType.молитва,
            place: "Головний зал"
        },
        {
            name: "Репетиція старшого хору",
            start: "17:30",
            finish: "19:00",
            type: CalendarEventType.музичне_служіння,
            place: "Хорова кімната",
            person: "Грабовський Юрій, Каленська Олена"
        },
        {
            name: "Молитва для молодих сімей",
            start: "20:00",
            finish: "21:00",
            type: CalendarEventType.молитва,
            place: "Балкон"
        }
    ],
    "08-10-2024": [
        {
            name: "Загальноцерковна молитва",
            start: "9:00",
            finish: "10:00",
            type: CalendarEventType.молитва,
            place: "Головний зал",
        },
        {
            name: "Домашня група",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.домашня_група,
            place: "Район Молокозаводу",
            person: "Редич Дмитро"
        },
        {
            name: "Молодіжна молитва",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.молодіжне,
            place: "Горниця",
            person: "Стахов Леонід"
        }
    ],
    "09-10-2024": [
        {
            name: "Загальноцерковна молитва",
            start: "9:00",
            finish: "10:00",
            type: CalendarEventType.молитва,
            place: "Головний зал"
        },
        {
            name: "Домашня група",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.домашня_група,
            place: "Район Центр",
            person: "Гусєв Олег"
        },
    ],
    "10-10-2024": [
        {
            name: "Загальноцерковна молитва",
            start: "9:00",
            finish: "10:00",
            type: CalendarEventType.молитва,
            place: "Головний зал"
        },
        {
            name: "Домашня група",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.домашня_група,
            place: "Район Загребелля",
            person: "Редич Дмитро"
        },
        {
            name: "Молодіжний розбір Писання",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.молодіжне,
            place: "Горниця",
            person: "Стахов Леонід"
        }
    ],
    "11-10-2024": [
        {
            name: "Загальноцерковна молитва",
            start: "9:00",
            finish: "10:00",
            type: CalendarEventType.молитва,
            place: "Головний зал"
        },
        {
            name: "Репетиція молодіжного хору",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.музичне_служіння,
            place: "Хорова кімната",
            person: "Редич Ніна"
        },
    ],
    "12-10-2024": [
        {
            name: "Недільна школа (3-4 роки)",
            start: "12:00",
            finish: "13:00",
            type: CalendarEventType.недільна_школа,
            place: "Клас № 1",
            person: "Хтось"
        },
        {
            name: "Недільна школа (5-6 років)",
            start: "12:00",
            finish: "13:00",
            type: CalendarEventType.недільна_школа,
            place: "Клас № 2",
            person: "Хтось"
        },
        {
            name: "Недільна школа (7-9 років)",
            start: "12:00",
            finish: "13:00",
            type: CalendarEventType.недільна_школа,
            place: "Клас № 3",
            person: "Хтось"
        },
        {
            name: 'Репетиція хору "Божі дзвіночки" (3-5 років)',
            start: "12:00",
            finish: "13:00",
            type: CalendarEventType.недільна_школа,
            place: "Хорова кімната",
            person: "Редич Ніна"
        },
        {
            name: 'Репетиція хору "Божі колосочки" (7-10 років)',
            start: "12:00",
            finish: "13:00",
            type: CalendarEventType.недільна_школа,
            place: "Хорова кімната",
            person: "Каленська Олена"
        },
        {
            name: "Репетиція підліткового хору (11-16 років)",
            start: "13:00",
            finish: "15:00",
            type: CalendarEventType.недільна_школа,
            place: "Хорова кімната",
            person: "Гусєва Ангеліна"
        },
        {
            name: "Молодше підліткове (10-12 років)",
            start: "13:00",
            finish: "14:30",
            type: CalendarEventType.недільна_школа,
            place: "Балкон",
            person: "Трачук Ольга"
        },
        {
            name: "Старше підліткове (13-16 років)",
            start: "15:00",
            finish: "17:00",
            type: CalendarEventType.недільна_школа,
            place: "Балкон",
            person: "Стахов Богдан"
        },
        {
            name: "Молодіжне служіння",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.молодіжне,
            place: "Балкон",
            person: "Стахов Леонід"
        }
    ],
    "13-10-2024": [
        {
            name: "Служіння",
            start: "10:00",
            finish: "12:30",
            type: CalendarEventType.загальне_служіння,
            preachers: ["Тимощук Іван", "Сокорчук Сергій", "Гніліцький Борис"],
            singers: ['"Дарунок з небес"']
        },
        {
            name: "Табір",
            start: "14:00",
            finish: "19:00",
            type: CalendarEventType.табір,
            place: "село Красівка",
            person: "Семерак Руслан",
            cars: ["VW Crafter", "Mercedes"]
        },
        {
            name: "Євангелізація",
            start: "15:00",
            finish: "16:30",
            type: CalendarEventType.євангелізація,
            place: "село Нізгурці",
            person: "Панасюк Володимир",
            cars: ["VW Caravella"]
        },
        {
            name: "Причастя",
            start: "17:00",
            finish: "19:00",
            type: CalendarEventType.загальне_служіння
        }
    ],
    "14-10-2024": [
        {
            name: "Загальноцерковна молитва",
            start: "9:00",
            finish: "10:00",
            type: CalendarEventType.молитва,
            place: "Головний зал"
        },
        {
            name: "Репетиція старшого хору",
            start: "17:30",
            finish: "19:00",
            type: CalendarEventType.музичне_служіння,
            place: "Хорова кімната",
            person: "Грабовський Юрій, Каленська Олена"
        },
        {
            name: "Молитва для молодих сімей",
            start: "20:00",
            finish: "21:00",
            type: CalendarEventType.молитва,
            place: "Балкон"
        }
    ],
    "15-10-2024": [
        {
            name: "Загальноцерковна молитва",
            start: "9:00",
            finish: "10:00",
            type: CalendarEventType.молитва,
            place: "Головний зал",
        },
        {
            name: "Домашня група",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.домашня_група,
            place: "Район Молокозаводу",
            person: "Редич Дмитро"
        },
        {
            name: "Молодіжна молитва",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.молодіжне,
            place: "Горниця",
            person: "Стахов Леонід"
        }
    ],
    "16-10-2024": [
        {
            name: "Загальноцерковна молитва",
            start: "9:00",
            finish: "10:00",
            type: CalendarEventType.молитва,
            place: "Головний зал"
        },
        {
            name: "Домашня група",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.домашня_група,
            place: "Район Центр",
            person: "Гусєв Олег"
        },
    ],
    "17-10-2024": [
        {
            name: "Загальноцерковна молитва",
            start: "9:00",
            finish: "10:00",
            type: CalendarEventType.молитва,
            place: "Головний зал"
        },
        {
            name: "Домашня група",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.домашня_група,
            place: "Район Загребелля",
            person: "Редич Дмитро"
        },
        {
            name: "Молодіжний розбір Писання",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.молодіжне,
            place: "Горниця",
            person: "Стахов Леонід"
        }
    ],
    "18-10-2024": [
        {
            name: "Загальноцерковна молитва",
            start: "9:00",
            finish: "10:00",
            type: CalendarEventType.молитва,
            place: "Головний зал"
        },
        {
            name: "Репетиція молодіжного хору",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.музичне_служіння,
            place: "Хорова кімната",
            person: "Редич Ніна"
        },
    ],
    "19-10-2024": [
        {
            name: "Недільна школа (3-4 роки)",
            start: "12:00",
            finish: "13:00",
            type: CalendarEventType.недільна_школа,
            place: "Клас № 1",
            person: "Хтось"
        },
        {
            name: "Недільна школа (5-6 років)",
            start: "12:00",
            finish: "13:00",
            type: CalendarEventType.недільна_школа,
            place: "Клас № 2",
            person: "Хтось"
        },
        {
            name: "Недільна школа (7-9 років)",
            start: "12:00",
            finish: "13:00",
            type: CalendarEventType.недільна_школа,
            place: "Клас № 3",
            person: "Хтось"
        },
        {
            name: 'Репетиція хору "Божі дзвіночки" (3-5 років)',
            start: "12:00",
            finish: "13:00",
            type: CalendarEventType.недільна_школа,
            place: "Хорова кімната",
            person: "Редич Ніна"
        },
        {
            name: 'Репетиція хору "Божі колосочки" (7-10 років)',
            start: "12:00",
            finish: "13:00",
            type: CalendarEventType.недільна_школа,
            place: "Хорова кімната",
            person: "Каленська Олена"
        },
        {
            name: "Репетиція підліткового хору (11-16 років)",
            start: "13:00",
            finish: "15:00",
            type: CalendarEventType.недільна_школа,
            place: "Хорова кімната",
            person: "Гусєва Ангеліна"
        },
        {
            name: "Молодше підліткове (10-12 років)",
            start: "13:00",
            finish: "14:30",
            type: CalendarEventType.недільна_школа,
            place: "Балкон",
            person: "Трачук Ольга"
        },
        {
            name: "Старше підліткове (13-16 років)",
            start: "15:00",
            finish: "17:00",
            type: CalendarEventType.недільна_школа,
            place: "Балкон",
            person: "Стахов Богдан"
        },
        {
            name: "Молодіжне служіння",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.молодіжне,
            place: "Балкон",
            person: "Стахов Леонід"
        }
    ],
    "20-10-2024": [
        {
            name: "Служіння",
            start: "10:00",
            finish: "12:30",
            type: CalendarEventType.загальне_служіння,
            preachers: ["Пудрівський Олександр", "Лукашук Яків", "Боцян Анатолій"],
            singers: ["Старший хор"]
        },
        {
            name: "Табір",
            start: "14:00",
            finish: "18:00",
            type: CalendarEventType.табір,
            place: "село Бистрик",
            person: "Семерак Руслан",
            cars: ["VW Crafter", "Mercedes"]
        },
        {
            name: "Євангелізація",
            start: "15:00",
            finish: "17:00",
            type: CalendarEventType.євангелізація,
            place: "село Никонівка",
            person: "Панасюк Володимир",
            cars: ["VW Caravella"]
        },
        {
            name: "Якась подія",
            start: "19:00",
            finish: "21:00",
            type: CalendarEventType.інше,
            place: "балкон",
            person: "Стахов Володимир",
        }
    ]
}
