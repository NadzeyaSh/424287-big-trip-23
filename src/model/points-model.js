import Observable from '../framework/observable.js';

import { UpdateType } from '../const.js';


export default class PointsModel extends Observable {
  #eventsApiService = null;
  #events = [];
  #destinations = [];
  #offers = [];
  // #offers = new Map();


  constructor({eventsApiService}) {
    super();
    this.#eventsApiService = eventsApiService;

    // this.#eventsApiService.events.then((events) => {
    //   console.log(events.map(this.#adaptToClient));

    // });
  }


  get events() {
    return this.#events;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }


  async init() {
    try {
      this.#destinations = await this.#eventsApiService.destinations;

      const offers = await this.#eventsApiService.offers;
      offers.forEach(({ type, offers: typeOffers }) => {
        this.#offers.set(type, typeOffers);
      });
      const events = await this.#eventsApiService.events;
      this.#events = events.map(this.#adaptToClient);

    } catch(err) {
      this.#events = [];
    }
    this._notify(UpdateType.INIT);
  }

  async updateEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    try {
      const response = await this.#eventsApiService.updateEvent(update);
      const updatedEvent = this.#adaptToClient(response);
      this.#events = [...this.#events.slice(0, index), updatedEvent, ...this.#events.slice(index + 1)];
      this._notify(updateType, updatedEvent);
    } catch(err) {
      throw new Error('Can\'t update event');
    }
  }

  async addEvent(updateType, update) {
    try {
      const response = await this.#eventsApiService.addEvent(update);
      const newEvent = this.#adaptToClient(response);
      this.#events = [newEvent, ...this.#events];
      this._notify(updateType, newEvent);
    } catch(err) {
      throw new Error('Can\'t add event');
    }

  }

  async deleteEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }
    try {
      await this.#eventsApiService.deleteEvent(update);
      this.#events = [...this.#events.slice(0, index), ...this.#events.slice(index + 1)];

      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete event');
    }

  }

  #adaptToClient(event) {
    const adaptedEvent = {...event,
      basePrice: event['base_price'],
      dateFrom: event['date_from'] !== null ? new Date(event['date_from']) : event['date_from'],
      dateTo: event['date_to'] !== null ? new Date(event['date_to']) : event['date_to'],
      isFavorite: event['is_favorite'],
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }
}
