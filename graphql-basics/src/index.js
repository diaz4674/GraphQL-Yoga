import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";

// Demo user data
let users = [
	{
		id: "1",
		name: "Miguel",
		email: "miguel@example.com",
		age: 27,
	},
	{
		id: "2",
		name: "Mike",
		email: "mil@example.com",
		age: 27,
	},
	{
		id: "3",
		name: "Sarah",
		email: "sara@example.com",
		age: 27,
	},
];

let posts = [
	{
		id: "1",
		title: "Turtle Ninja",
		body: "There were turtles",
		published: true,
		author: "1",
	},
	{
		id: "2",
		title: "The Notebook",
		body: "A guy and a girl. he built her a home",
		published: true,
		author: "2",
	},
	{
		id: "3",
		title: "Texas Chainsaw Massacre",
		body: "Some dude had a weird fetish",
		published: true,
		author: "3",
	},
];

let comments = [
	{
		id: "10",
		comment: "This book is lit!",
		author: "1",
		post: "1",
	},
	{
		id: "11",
		comment: "This book made me cry!",
		author: "2",
		post: "2",
	},
	{
		id: "12",
		comment: "I love this story!",
		author: "3",
		post: "3",
	},
	{
		id: "13",
		comment: "Turtle power!",
		author: "1",
		post: "1",
	},
];

// Type definitions
const typeDefs = `
    type Query {
		users(query: String): [User!]!
		me: User!
		post: Post!
		posts(query: String): [Post!]
		comment: [Comment!]!
	}

	type Mutation {
		createUser(data: CreateUserInput!): User!
		deleteUser(id: ID!): User!
		createPost(data: createPostInput!): Post!
		deletePost(id: ID!): Post!
		createComment(data: createCommentInput!): Comment!
	}

	input CreateUserInput {
		name: String!, email: String!, age: Int
	}

	input createPostInput {
		title: String!, body: String!, published: Boolean!, author: ID!
	}

	input createCommentInput {
		comment: String!, author: ID!, post: ID!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
		posts: [Post!]!
		comments: [Comment!]!
	}
	
	type Post {
		id: ID!,
		title: String!
		body: String!
		published: Boolean!
		author: User!
		comments: [Comment!]!
	}

	type Comment {
		id: ID!,
		comment: String!
		author: User!
		post: Post!
	}
`;

// Resolvers
const resolvers = {
	Query: {
		users(parent, args, ctx, info) {
			if (!args.query) {
				return users;
			}

			return users.filter((user) => {
				return user.name.toLowerCase().includes(args.query.toLowerCase());
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
		posts(parent, args, ctx, info) {
			if (!args.query) {
				return posts;
			}

			return posts.filter((post) => {
				if (
					post.title.toLowerCase().includes(args.query.toLowerCase()) ||
					post.body.toLowerCase().includes(args.query.toLowerCase())
				) {
					return post;
				}
			});
		},
		comment(parent, args, ctx, info) {
			return comments;
		},
	},
	Mutation: {
		createUser(parent, args, ctx, info) {
			console.log(args);
			const emailTaken = users.some((user) => {
				return user.email === args.data.email;
			});

			if (emailTaken) {
				throw new Error("Email already taken");
			}

			const user = {
				id: uuidv4(),
				...args.data,
			};

			users.push(user);

			return user;
		},
		deleteUser(parent, args, ctx, info) {
			const userIndex = users.findIndex((user) => {
				console.log(user.id, args.id);
				if (user.id === args.id) {
					return true;
				}
			});

			if (userIndex === -1) {
				throw new Error("User not found");
			}

			const deletedUsers = users.splice(userIndex, 1);
			posts = posts.filter((post) => {
				const match = post.author === args.id;

				if (match) {
					comments = comments.filter((comment) => {
						return comment.post !== post.id;
					});
				}
				return !match;
			});

			comments = comments.filter((comment) => comment.author !== args.id);

			return deletedUsers[0];
		},
		createPost(parent, args, ctx, info) {
			const userExists = users.some((user) => user.id === args.data.author);

			if (!userExists) {
				throw new Error("User not found");
			}

			const post = {
				id: uuidv4(),
				...args.data,
			};

			posts.push(post);

			return post;
		},
		deletePost(parent, args, ctx, info) {
			const postIndex = posts.findIndex((post) => {
				if (post.id === args.id) {
					return true;
				}
			});

			if (postIndex === -1) {
				throw new Error("Post not found");
			}

			const deletedPost = posts.splice(postIndex, 1);

			posts = posts.filter((post) => {
				const match = post.id === args.id;

				if (match) {
					comments = comments.filter((comment) => {
						return comment.post !== post.id;
					});
				}
				return !match;
			});

			comments = comments.filter((comment) => comment.post !== args.id);

			return deletedPost[0];
		},
		createComment(parent, args, ctx, info) {
			const userExists = users.some((user) => user.id === args.data.author);
			const postExists = posts.some(
				(post) => post.id === args.post && post.published
			);

			if (!userExists || !postExists) {
				throw new Error("Unable to find user and post");
			}

			const comment = {
				id: uuidv4(),
				...args.data,
			};

			comments.push(comment);

			return comment;
		},
	},
	Post: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author;
			});
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.post === parent.id;
			});
		},
	},
	User: {
		posts(parent, args, ctx, info) {
			return posts.filter((post) => {
				return post.author === parent.id;
			});
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.author === parent.id;
			});
		},
	},
	Comment: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author;
			});
		},
		post(parent, args, ctx, info) {
			return posts.find((post) => {
				return post.id === parent.post;
			});
		},
	},
};

const server = new GraphQLServer({
	typeDefs,
	resolvers,
});

server.start(() => {
	console.log("The server is up!");
});
