import LinkComponent from '@ember/routing/link-component';
import { HAS_BLOCK } from '@ember/component';
import { get } from '@ember/object';
import { computed }from '@ember/object';

export default LinkComponent.extend({
  qualifiedRouteName: computed(
    'targetRouteName',
    '_routing.currentState',
    function computeLinkToComponentQualifiedRouteName() {
      let params = get(this, 'params');
      let paramsLength = params.length;
      let lastParam = params[paramsLength - 1];
      if (lastParam && lastParam.isQueryParams) {
        paramsLength--;
      }
      let onlyQueryParamsSupplied = this[HAS_BLOCK] ? paramsLength === 0 : paramsLength === 1;
      if (onlyQueryParamsSupplied) {
        return get(this, '_routing.currentRouteName');
      }
      return get(this, 'targetRouteName');
    }
  ),

  didReceiveAttrs() {
    let queryParams;

    let params = get(this, 'params');

    if (params) {
      // Do not mutate params in place
      params = params.slice();
    }

    assert(
      'You must provide one or more parameters to the link-to component.',
      params && params.length
    );

    let disabledWhen = get(this, 'disabledWhen');
    if (disabledWhen !== undefined) {
      this.set('disabled', disabledWhen);
    }

    // Process the positional arguments, in order.
    // 1. Inline link title comes first, if present.
    if (!this[HAS_BLOCK]) {
      this.set('linkTitle', params.shift());
    }

    // 2. `targetRouteName` is now always at index 0.
    this.set('targetRouteName', params[0]);

    // 3. The last argument (if still remaining) is the `queryParams` object.
    let lastParam = params[params.length - 1];

    if (lastParam && lastParam.isQueryParams) {
      queryParams = params.pop();
    } else {
      queryParams = { values: {} };
    }
    this.set('queryParams', queryParams);

    // 4. Any remaining indices (excepting `targetRouteName` at 0) are `models`.
    if (params.length > 1) {
      this.set('models', this._getModels(params));
    } else {
      this.set('models', []);
    }
  },
});
