import GeneralPresenter from './presenter/general-presenter';
import PointsModel from './model/points-model';

import EventsApiService from './events-api-service.js';
import {render} from './framework/render.js';

const AUTHORIZATION = 'Basic hS6sfS57zcl7sa8j';
const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const newEventBtn = document.querySelector('.trip-main');
const pointModel = new PointsModel({eventsApiService: new EventsApiService(END_POINT, AUTHORIZATION)});
pointModel.init();
const generalPresenter = new GeneralPresenter({tripControlsFilters:tripControlsFilters,tripEvents:tripEvents,pointModel,newEventBtn:newEventBtn});
generalPresenter.init();
// pointModel.init().catch((error) => {
//   generalPresenter.renderFailedMessage(error);
// });
