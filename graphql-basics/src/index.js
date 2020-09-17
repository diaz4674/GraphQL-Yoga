import { GraphQLServer } from "graphql-yoga";

// Type definitions
const typeDefs = `
    type Query {
		me: User!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
	}
	
`;

// Resolvers
const resolvers = {
	Query: {
		me() {
			return {
				id: "123456",
				name: "Mike",
				email: "mike@example.com",
				age: 28,
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
