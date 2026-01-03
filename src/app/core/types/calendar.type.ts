import { CalendarEventType } from "../enums/calendar.enum";

export class CalendarEventTypeCheckbox {
    label: string;
    type: CalendarEventType;
    show: boolean;
    color: string;
}

export class CalendarEventData {
    name: string;
    start: string;
    finish?: string;
    type: CalendarEventType;
    place?: string;
    person?: string;
    preachers?: string[];
    singers?: string[];
    cars?: string[];
    date?: string;
    frequency?: "once" | "regular";
    days?: string[];
}

export class CalendarEvents {
    [key: string]: CalendarEventData[]
}

export class CalendarCell {
    id: string;
    date: Date;
    nameOfDay: string;
}
