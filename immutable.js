const _ = require('lodash'),
    Immutable = require('immutable');

const { Record, Map, List } = Immutable;

const ImmutableModified = {

    init() {
        Record.prototype.updateState = function updateState(data) {
            let self = this;
            _.each(data, (_v, _k) => {
                const old_value = self.get(_k);
                if (!_.isUndefined(old_value)) {
                    let new_value;
                    if (old_value instanceof List) {
                        if (_v instanceof List) {
                            new_value = _v;
                        } else {
                            new_value = List(_v);
                        }
                    } else if (old_value instanceof Map) {
                        if (_v instanceof Map) {
                            new_value = _v;
                        } else {
                            new_value = Map(_v);
                        }
                    } else {
                        new_value = _v;
                    }
                    self = self.set(_k, new_value);
                }
            });
            return self;
        };

        Record.prototype.updateWithinMap = function updateWithinMap(prop_name, data) {
            let self = this;
            const tmp_map = self.get(prop_name);
            if (!(tmp_map instanceof Map)) {
                return self;
            }
            let tmp_obj = tmp_map.toJS();
            tmp_obj = _.assign(tmp_obj, data);
            self = self.set(prop_name, Map(tmp_obj));
            return self;
        };
    }

};


exports.Immutable = ImmutableModified.init();
