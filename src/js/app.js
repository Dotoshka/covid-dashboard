import getTemplate from './app-template';
import TabButton from './tab-button';
import TabsGroup from './tabs-group';
import SearchForm from './search-form';
import CountriesList from './countries-list';
import CountrySection from './country-section';
import DataService from './data-service';
import EVENTS from './events';

class App {
  constructor() {
    this.dataService = new DataService();
  }

  getData() {
    return new Promise((resolve, reject) => {
      this.dataService.getSummary().then((summary) => {
        // load summary data for all countries and worldwide (countries-list component)
        window.dispatchEvent(new CustomEvent(EVENTS.DATA.showSummaryAll,
          { ...EVENTS.defaultSettings, detail: summary }));
        // show summary for worldwide (rigth table)
        window.dispatchEvent(new CustomEvent(EVENTS.DATA.showSummarySelected,
          { ...EVENTS.defaultSettings, detail: this.dataService.getSummaryFor('Worldwide') }));
        // load worldwide detail data (chart component)
        this.dataService.getDetail('Worldwide').then((detailData) => {
          window.dispatchEvent(new CustomEvent(EVENTS.DATA.showDetail,
            { ...EVENTS.defaultSettings, detail: detailData }));
          resolve();
        }).catch(reject);
      }).catch(reject);
    });
  }

  mount(element) {
    this.element = element;
    this.render();
    // show loader screen
    this.getData().then(() => {
      // hide loader
    }).catch(() => console.log('Show error screen'));
  }

  render() {
    this.element.innerHTML = getTemplate();
  }
}

window.customElements.define('search-form', SearchForm);
customElements.define('test-element', CountrySection, { extends: 'li' });
window.customElements.define('countries-list', CountriesList, { extends: 'ul' });
window.customElements.define('tab-button', TabButton, { extends: 'label' });
window.customElements.define('tabs-group', TabsGroup);

export default App;
