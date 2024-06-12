import dayjs from 'dayjs';
import { SortType, FilterType } from './const';

const DAY_FORMAT = 'MMM D';
export const TIME_FORMAT = 'HH:mm';
const MACHINE_FORMAT = 'YYYY-MM-DD';
const FORM_FORMAT = 'DD/MM/YY HH:mm';//enum
const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];
const humanizeDueDate = (dueDate) => dueDate ? dayjs(dueDate).format(DAY_FORMAT) : '';
const humanizeDueTime = (dueDate) => dueDate ? dayjs(dueDate).format(TIME_FORMAT) : '';
const machineDueFormat = (dueDate) => dueDate ? dayjs(dueDate).format(MACHINE_FORMAT) : '';
const humanizeDueTimeForForm = (dueDate) => dueDate ? dayjs(dueDate).format(FORM_FORMAT) : '';

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);
const getTimeDifference = ({dateFrom,dateTo}) => (new Date(dateTo)).getTime() - (new Date(dateFrom)).getTime();
// isAfter
const getTimeDuration = (dateFrom, dateTo) => {
  const minutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minutes') % 60;
  const hours = dayjs(dateTo).diff(dayjs(dateFrom), 'hours') % 24;
  const days = dayjs(dateTo).diff(dayjs(dateFrom), 'days');
  if (days === 0 && hours === 0){
    return `${minutes}M`;
  } else if (days === 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${days}D ${hours}H ${minutes}M`;
};

const sortEventsBy = {
  [SortType.DAY]: (events) => [...events],
  [SortType.TIME]: (events) => [...events].sort((nextEvent, currentEvent) => getTimeDifference(currentEvent) - getTimeDifference(nextEvent)),
  [SortType.PRICE]: (events) => [...events].sort((nextEvent, currentEvent) => currentEvent.basePrice - nextEvent.basePrice),

};
const sortEvents = (events, sortType) => sortEventsBy[sortType](events);

const isFutureEvent = (date) => dayjs().isBefore(dayjs(date));
const isPresentEvent = (dateFrom, dateTo) => dayjs().isAfter(dayjs(dateFrom)) && dayjs().isBefore(dayjs(dateTo));
const isPastEvent = (date) => dayjs().isAfter(dayjs(date));

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isFutureEvent(event.dateFrom)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isPresentEvent(event.dateFrom, event.dateTo)),
  [FilterType.PAST]: (events) => events.filter((event) => isPastEvent(event.dateTo)),
};

const filterEvents = (events, filterType) => filter[filterType](events);

const getPositiveNumber = (string) => {
  if (!string) {
    return null;
  }

  const valueInput = parseInt(string, 10);
  if (isNaN(valueInput) || (valueInput <= 0)) {
    return null;
  }

  return valueInput;
};

const addItem = (items,item) => Array.from(new Set([...items,item]));
const removeItem = (items,item) => items.filter((el) => el !== item);

export {getRandomArrayElement,humanizeDueDate,humanizeDueTime, machineDueFormat,humanizeDueTimeForForm,updateItem,sortEvents,getTimeDuration,filterEvents,getPositiveNumber, addItem,removeItem};
