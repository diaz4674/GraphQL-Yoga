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
