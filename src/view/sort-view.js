import AbstractView from '../framework/view/abstract-view.js';
import {SORT_ITEMS} from '../const.js';

function createSortTemplate() {

  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${SORT_ITEMS.map(({ type, checked = false, disabled = false }) => `
          <div class="trip-sort__item  trip-sort__item--${type}">
            <input
              id="sort-${type}"
              class="trip-sort__input  visually-hidden"
              type="radio"
              name="trip-sort"
              value="sort-${type}"
              data-sort-type="${type}"
              ${checked ? 'checked' : ''}
              ${disabled ? 'disabled' : ''}>
            <label class="trip-sort__btn" for="sort-${type}">${type[0].toUpperCase() + type.slice(1)}</label>
          </div>
        `)
    .join('')}
    </form>
  `;
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;

  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }


  get template() {
    return createSortTemplate();
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };

}
