var _ = require('underscore'),
    colors = require('colors');

// remove terminal escape characters before returning length
function len(string) {
    return string.replace(/\033\[[0-9;]*m/g, '').length;
}

// pad
function pad(string, target) {
    return string + (new Array(target - len(string)).join(' '));
}

var Columnizer = function Columnizer(table) {
    var keys,
        self = this;
    if (table && table[0] instanceof Array) {
        this.table = table;
    } else if (table && typeof table[0] === 'object') {
        keys = _.keys(table[0]);
        this.table = [keys];
        _.each(table, function (object) {
            var row = [],
                i = 0,
                l = keys.length;
            for (; i < l ; i++) {
                row.push(object[keys[i]]);
            }
            self.table.push(row);
        });
    } else {
        this.table = [];
    }
};

Columnizer.prototype.row = function (args) {
    this.table.push(Array.prototype.slice.call(arguments, 0));
};

Columnizer.prototype.print = function (columnPadding, headers) {
    console.log(this._toString(columnPadding, headers));
};

Columnizer.prototype.length = function () {
    return this.table.length;
};

Columnizer.prototype._toString = function (columnPadding, headers) {
    var padding = columnPadding || 5,
        totalColumns = _.max(this.table, function (item) { return item.length; }).length,
        colWidths = [],
        result = [];

    // first we figure out what the max length is for each column
    _.each(this.table, function (row, index) {
        _.each(row, function (item, i) {
            var str = item.toString();
            colWidths[i] = ((colWidths[i] || 0) < len(str)) ? len(str) : colWidths[i];
        });
    });

    // now we can build our table
    _.each(this.table, function (row, index) {
        _.each(row, function (item, i) {
            row[i] = pad(item.toString(), colWidths[i] + padding);
            if (index === 0 && headers) row[i] = row[i].bold;
        });
        result.push(row.join(''));
    });

    return result.join('\n');
};

// our export
module.exports = Columnizer;
