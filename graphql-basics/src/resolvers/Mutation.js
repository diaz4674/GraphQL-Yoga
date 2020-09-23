import { v4 as uuidv4 } from "uuid";

const Mutation = {
	createUser(parent, args, { db }, info) {
		const emailTaken = db.users.some((user) => {
			return user.email === args.data.email;
		});

		if (emailTaken) {
			throw new Error("Email already taken");
		}

		const user = {
			id: uuidv4(),
			...args.data,
		};

		db.users.push(user);

		return user;
	},
	deleteUser(parent, args, { db }, info) {
		const userIndex = db.users.findIndex((user) => {
			if (user.id === args.id) {
				return true;
			}
		});

		if (userIndex === -1) {
			throw new Error("User not found");
		}

		const deletedUsers = db.users.splice(userIndex, 1);

		db.posts = db.posts.filter((post) => {
			const match = post.author === args.id;

			if (match) {
				db.comments = db.comments.filter((comment) => {
					return comment.post !== post.id;
				});
			}
			return !match;
		});

		db.comments = db.comments.filter((comment) => comment.author !== args.id);

		return deletedUsers[0];
	},
	updateUser(parent, args, { db }, info) {
		const { id, data } = args;
		const user = db.users.find((user) => {
			return user.id === id;
		});

		if (!user) {
			throw new Error("user not found");
		}

		if (typeof data.email === "string") {
			const emailTaken = db.users.some((user) => user.email === data.email);

			if (emailTaken) {
				throw new Error("email already taken");
			}

			user.email = data.email;
		}

		if (typeof data.name === "string") {
			user.name = data.name;
		}

		if (typeof data.age !== "undefined") {
			user.age = data.age;
		}

		return user;
	},
	createPost(parent, args, { db }, info) {
		const userExists = db.users.some((user) => user.id === args.data.author);

		if (!userExists) {
			throw new Error("User not found");
		}

		const post = {
			id: uuidv4(),
			...args.data,
		};

		db.posts.push(post);

		return post;
	},
	updatePost(parent, args, { db }, info) {
		const { id, data } = args;

		const post = db.posts.find((post) => {
			return post.id === id;
		});

		if (!post) {
			throw new Error("post not found");
		}

		if (typeof data.title === "string") {
			post.title = data.title;
		}

		if (typeof data.body === "string") {
			post.body = data.body;
		}

		if (typeof data.published === "boolean") {
			post.published = data.published;
		}

		return post;
	},
	deletePost(parent, args, { db }, info) {
		const postIndex = db.posts.findIndex((post) => {
			if (post.id === args.id) {
				return true;
			}
		});

		if (postIndex === -1) {
			throw new Error("Post not found");
		}

		const deletedPost = db.posts.splice(postIndex, 1);

		db.posts = db.posts.filter((post) => {
			const match = post.id === args.id;

			if (match) {
				db.comments = db.comments.filter((comment) => {
					return comment.post !== post.id;
				});
			}
			return !match;
		});

		db.comments = db.comments.filter((comment) => comment.post !== args.id);

		return deletedPost[0];
	},
	createComment(parent, args, { db }, info) {
		const userExists = db.users.some((user) => user.id === args.data.author);
		const postExists = db.posts.some(
			(post) => post.id === args.post && post.published
		);

		if (!userExists || !postExists) {
			throw new Error("Unable to find user and post");
		}

		const comment = {
			id: uuidv4(),
			...args.data,
		};

		db.comments.push(comment);

		return comment;
	},
	deleteComment(parents, args, { db }, info) {
		const commentIndex = db.comments.findIndex((comment) => {
			if (comment.id === args.id) {
				return true;
			}
		});

		if (commentIndex === -1) {
			throw new Error("Unable to find comment");
		}

		let deleteComment = db.comments.splice(commentIndex, 1);

		return deleteComment[0];
	},
};

export { Mutation as default };
