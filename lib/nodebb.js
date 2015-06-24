(function(NodeBB) {
	module.exports = {
        Settings: NodeBB.require('./settings'),
        Meta: NodeBB.require('./meta'),
        User: NodeBB.require('./user'),
        Plugins: NodeBB.require('./plugins'),
        db: NodeBB.require('./database'),
        file: NodeBB.require('./file'),
        plugins: NodeBB.require('./plugins'),
        categories : NodeBB.require('./categories'),
        SocketPlugins: NodeBB.require('./socket.io/plugins'),
        PostTools : NodeBB.require('./postTools'),
        Topics: NodeBB.require('./topics')
	}
})(module.parent.parent);