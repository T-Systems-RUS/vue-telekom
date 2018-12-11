import {IDateRange} from './IDateRangePicker';

export class DateRangePickerService {
  static datepickerDateFormatter(value: IDateRange | Date): string {
    let dateString = '';
    if (value instanceof Date) {
      dateString = DateRangePickerService.convertDateToString(value);
    } else if (value && value.start && value.end) {
      dateString = `${this.convertDateToString(value.start)} - ${this.convertDateToString(value.end)}`;
    }
    return dateString;
  }

  static convertDateToString(date: Date): string {
    const dd = `0${date.getDate()}`.slice(-2);
    const mm = `0${date.getMonth() + 1}`.slice(-2);
    const yyyy = date.getFullYear();

    return `${dd}.${mm}.${yyyy}`;
  }
}
