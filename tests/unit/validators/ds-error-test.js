import Store from '@ember-data/store';
import Model, { attr } from '@ember-data/model';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let model, validator, message, store;

module('Unit | Validator | ds-error', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'model:user',
      class extends Model {
        @attr('string') username;
      }
    );

    this.owner.register('service:store', Store);
    store = this.owner.lookup('service:store');
    validator = this.owner.lookup('validator:ds-error');
  });

  test('works with empty object', function (assert) {
    assert.expect(1);

    model = store.createRecord('user');

    message = validator.validate(undefined, undefined, model, 'username');
    assert.equal(message, true);
  });

  test('it works', function (assert) {
    assert.expect(2);

    model = store.createRecord('user');

    message = validator.validate(undefined, undefined, model, 'username');
    assert.equal(message, true);

    model.get('errors').add('username', 'Username is not unique');

    message = validator.validate(undefined, undefined, model, 'username');
    assert.equal(message, 'Username is not unique');
  });

  test('gets last message', function (assert) {
    assert.expect(2);

    model = store.createRecord('user');

    message = validator.validate(undefined, undefined, model, 'username');
    assert.equal(message, true);

    model.get('errors').add('username', 'Username is not unique');
    model.get('errors').add('username', 'Username is too long');

    message = validator.validate(undefined, undefined, model, 'username');
    assert.equal(message, 'Username is too long');
  });
});
