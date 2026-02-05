
import { render, replace, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;

  #tripInfoComponent = null;
  #isModelReady = false;

  constructor({ tripInfoContainer, pointsModel }) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }


  init() {

    this.#tripInfoComponent = new TripInfoView({
      points: [],
      destinations: [],
      getSelectedOffers: () => []
    });

    render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);

    if (this.#pointsModel.points.length > 0 || this.#pointsModel.destinations.length > 0) {
      this.#isModelReady = true;
      this.#updateInfo();
    }
  }

  #handleModelEvent = (updateType) => {
    if (updateType === 'INIT') {
      this.#isModelReady = true;
    }

    if (this.#isModelReady) {
      this.#updateInfo();
    }
  };

  #updateInfo() {
    const points = this.#pointsModel.points || [];
    const destinations = this.#pointsModel.destinations || [];

    const newComponent = new TripInfoView({
      points,
      destinations,
      getSelectedOffers: this.#pointsModel.getSelectedOffers.bind(this.#pointsModel)
    });

    if (this.#tripInfoComponent?.element?.parentElement) {
      replace(newComponent, this.#tripInfoComponent);
    } else {
      render(newComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    }

    this.#tripInfoComponent = newComponent;
  }


  update() {
    this.#updateInfo();
  }
}
