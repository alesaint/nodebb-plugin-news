(function(NodeBB) {
	module.exports = {
        Settings: NodeBB.require('./settings'),
        Meta: NodeBB.require('./meta'),
        User: NodeBB.require('./user'),
        Plugins: NodeBB.require('./plugins'),
        db: NodeBB.require('./database'),
        file: NodeBB.require('./file'),
        categories : NodeBB.require('./categories'),
        settings: NodeBB.require('./settings'),
	}
})(module.parent.parent);