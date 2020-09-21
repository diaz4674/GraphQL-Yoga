import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";

// Demo user data
const users = [
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

const posts = [
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

const comments = [
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
		createUser(name: String!, email: String!, age: Int): User!
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
			const emailTaken = users.some((user) => {
				return user.email === args.email;
			});

			if (emailTaken) {
				throw new Error("Email already taken");
			}

			const user = {
				id: uuidv4(),
				name: args.name,
				email: args.email,
				age: args.age,
			};

			users.push(user);

			return user;
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
				console.log(post.id, parent.post);
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
