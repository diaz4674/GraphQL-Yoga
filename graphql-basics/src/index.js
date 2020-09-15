import { GraphQLServer } from "graphql-yoga";

// Type definitions
const typeDefs = `
    type Query {
        hello: String!
        name: String
    }
`;

// Resolvers
const resolvers = {
	Query: {
		hello() {
			return "This is my first query!";
		},
		name() {
			return "Migz";
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
