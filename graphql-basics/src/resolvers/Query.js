const Query = {
	users(parent, args, { db }, info) {
		if (!args.query) {
			return db.users;
		}

		return db.users.filter((user) => {
			return db.user.name.toLowerCase().includes(args.query.toLowerCase());
		});
	},
	me() {
		return {
			id: "123456",
			name: "Mike",
			email: "mike@example.com",
			age: 28,
		};
	},
	posts(parent, args, { db }, info) {
		if (!args.query) {
			return db.posts;
		}

		return db.posts.filter((post) => {
			if (
				post.title.toLowerCase().includes(args.query.toLowerCase()) ||
				post.body.toLowerCase().includes(args.query.toLowerCase())
			) {
				return post;
			}
		});
	},
	comment(parent, args, { db }, info) {
		return db.comments;
	},
};

export { Query as default };
