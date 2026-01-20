import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';


const tripInfoContainer = document.querySelector('.trip-main');
const filtersContainer = tripInfoContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');


const pointsModel = new PointModel();
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel,
  pointsModel
});
const tripPresenter = new TripPresenter({tripEventsContainer, pointsModel, filterModel, tripInfoContainer});


filterPresenter.init();
tripPresenter.init();
