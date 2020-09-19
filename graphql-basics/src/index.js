import { GraphQLServer } from "graphql-yoga";

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
		title: "The Notebooke",
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

// Type definitions
const typeDefs = `
    type Query {
		users(query: String): [User!]!
		me: User!
		post: Post!
		posts(query: String): [Post!]
	}

	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
	}
	
	type Post {
		id: ID!,
		title: String!
		body: String!
		published: Boolean!
		author: User!
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
		post() {
			return {
				id: "092",
				title: "GraphQL",
				body: "",
				published: false,
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
	},
	Post: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author;
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
