const Subscription = {
	comment: {
		subscribe(parent, { postId }, { db, pubsub }, info) {
			console.log("postId");
			const post = db.posts.find((post) => post.id === postId);

			if (!post) {
				throw new Error("Post not found");
			}

			return pubsub.asyncIterator(`comment ${postId}`);
		},
	},
	post: {
		subscribe(parent, args, { pubsub }, info) {
			return pubsub.asyncIterator("post");
		},
	},
};

export { Subscription as default };
