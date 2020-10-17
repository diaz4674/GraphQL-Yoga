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

const db = {
	users,
	posts,
	comments,
};

export { db as default };
