(function(NodeBB) {
	module.exports = {
        Settings: NodeBB.require('./settings'),
        Meta: NodeBB.require('./meta'),
        User: NodeBB.require('./user'),
        Plugins: NodeBB.require('./plugins'),
        db: NodeBB.require('./database')
	}
})(module.parent.parent);