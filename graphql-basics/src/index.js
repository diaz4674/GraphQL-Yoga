import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";
import db from "./db";

// Resolvers
const resolvers = {
	Query: {
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
	},
	Mutation: {
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
	},
	Post: {
		author(parent, args, { db }, info) {
			return db.users.find((user) => {
				return user.id === parent.author;
			});
		},
		comments(parent, args, { db }, info) {
			return db.comments.filter((comment) => {
				return comment.post === parent.id;
			});
		},
	},
	User: {
		posts(parent, args, { db }, info) {
			return db.posts.filter((post) => {
				return post.author === parent.id;
			});
		},
		comments(parent, args, { Db }, info) {
			return db.comments.filter((comment) => {
				return comment.author === parent.id;
			});
		},
	},
	Comment: {
		author(parent, args, { db }, info) {
			return db.users.find((user) => {
				return user.id === parent.author;
			});
		},
		post(parent, args, { db }, info) {
			return db.posts.find((post) => {
				return post.id === parent.post;
			});
		},
	},
};

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers,
	context: {
		db,
	},
});

server.start(() => {
	console.log("The server is up!");
});
