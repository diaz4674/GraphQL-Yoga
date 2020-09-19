import { GraphQLServer } from "graphql-yoga";

// Type definitions
const typeDefs = `
    type Query {
		greeting(name: String, position: String): String!
		me: User!
		add(num1: Float, num2: Float): Float!
		post: Post!
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
	}
`;

// Resolvers
const resolvers = {
	Query: {
		greeting(parent, args, ctx, info) {
			if (args.name && args.position) {
				return `Hello ${args.name}! You are my favorite ${args.position}`;
			} else {
				return "Hello user!";
			}
		},
		me() {
			return {
				id: "123456",
				name: "Mike",
				email: "mike@example.com",
				age: 28,
			};
		},
		add(parent, args, ctx, info) {
			return args.num1 + args.num2;
		},
		post() {
			return {
				id: "092",
				title: "GraphQL",
				body: "",
				published: false,
			};
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
