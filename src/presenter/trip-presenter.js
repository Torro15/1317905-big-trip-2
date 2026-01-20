import { render, RenderPosition, remove, replace } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import TripInfoView from '../view/trip-info-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { sortByPrice, sortByTime } from '../utils/sort.js';
import { SortType, UserAction, UpdateType} from '../const.js';
import { filter } from '../utils/filter.js';

export default class TripPresenter {
  #pointsModel = null;
  #filterModel = null;
  #mainContainer = null;
  #tripMainElement = null;

  #tripPoints = [];
  #allDestinations = [];

  #pointPresenters = new Map();

  #currentSortType = SortType.DEFAULT;

  #pointsListView = new PointsListView();
  #sortView = null;
  #tripInfoView = new TripInfoView();
  #noPointsView = null;

  constructor({ tripEventsContainer, pointsModel, filterModel, tripInfoContainer }) {
    this.#mainContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#tripMainElement = tripInfoContainer;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const allPoints = this.#pointsModel.points;
    const filteredPoints = filter[filterType](allPoints);

    const sortedPoints = [...filteredPoints];

    switch (this.#currentSortType) {
      case SortType.TIME:
        sortedPoints.sort(sortByTime);
        break;
      case SortType.PRICE:
        sortedPoints.sort(sortByPrice);
        break;
      default:
        sortedPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    }

    return sortedPoints;
  }

  init() {
    this.#allDestinations = [...this.#pointsModel.destinations];
    this.#handleModelEvent();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }

    this.#tripPoints = this.points;
    this.#clearPointsList();
    this.#renderPointsList();
    this.#renderPoints();
  };

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.MAJOR) {
      this.#currentSortType = SortType.DEFAULT;
    }

    this.#tripPoints = this.points;
    this.#clearPointsList();
    this.#renderApp();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#tripPoints = this.points;
    this.#clearPointsList();
    this.#renderPointsList();
    this.#renderPoints();
  };

  #renderApp() {
    this.#tripPoints = this.points;

    if (this.#tripPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderInfo();
    this.#renderSort();
    this.#renderPointsList();
    this.#renderPoints();
  }

  #renderInfo() {
    render(this.#tripInfoView, this.#tripMainElement, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    const newSortView = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    if (this.#sortView === null) {
      render(newSortView, this.#mainContainer);
    } else {
      replace(newSortView, this.#sortView);
    }

    this.#sortView = newSortView;
  }

  #renderPointsList() {
    render(this.#pointsListView, this.#mainContainer);
  }

  #renderPoints() {
    this.#tripPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListView.element,
      pointsModel: this.#pointsModel,
      allDestinations: this.#allDestinations,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNoPoints() {
    remove(this.#noPointsView);
    this.#noPointsView = new NoPointView({ filterType: this.#filterModel.filter });
    render(this.#noPointsView, this.#mainContainer);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#noPointsView) {
      remove(this.#noPointsView);
      this.#noPointsView = null;
    }
  }

  #clearBoard() {
    this.#clearPointsList();
  }
}
