var relativeDate = require('relative-date');
var client = require('../');
var ui = require('../lib/ui');

module.exports = function(id, opts) {
	var c = client(opts.remote);

	var filter = function(proc) {
		return !id || proc.id === id;
	};

	c.ps(function(err, docks) {
		if (err) return ui.error(err);

		docks.forEach(function(dock) {
			var leafs = dock.list.filter(filter).map(function(proc) {
				var leaf = {};

				leaf.id = proc.id;
				leaf.status = proc.status;
				leaf.cwd = proc.cwd;

				if (proc.revision) leaf.revision = proc.revision;
				if (proc.pid)      leaf.pid = proc.pid;
				if (proc.started)  leaf.started = relativeDate(proc.started);
				if (proc.deployed) leaf.deployed = relativeDate(proc.deployed);

				if (opts.verbose) {
					if (proc.command) leaf.command = proc.command;
					if (proc.env)     leaf.env = proc.env;
				}

				return leaf;
			});

			ui.tree({
				label: dock.id,
				leaf: leafs
			});
		});
	});
};