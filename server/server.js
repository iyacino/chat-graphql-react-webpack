const { GraphQLServer } = require('graphql-yoga');

const messages = [];

const typeDefs = `
 type Message {
    id: ID!
    user: String
    content: String
 }
 type Query {
    messages: [Message!]
 }
 type Mutation {
    postMessage(user: String!, content: String!): ID!
    updateUser(id: ID!, user: String!): Message!
 }
`;
const resolvers = {
    Query: {
        messages: () => messages,
    },
    Mutation: {
        postMessage: (parent, { user, content }) => {
            const id = messages.length;
            messages.push(
                {
                    id,
                    user,
                    content
                }
            );
            return id;
        },
        // updateUser: (parent, { id, user } ) => {
        //     const messageIndex = messages.findIndex(message => message.id.toString() === id);
        //     let updatedMessage = {};
        //     if(messageIndex === -1) {
        //         throw new Error(`invalid mutation`)
        //     }
        //     else {
        //         updatedMessage.id = messages[messageIndex].id;
        //         updatedMessage.content = messages[messageIndex].content;
        //         updatedMessage.user = user;
        //      }
        //     messages.splice(messageIndex, 1, updatedMessage);
        //     return updatedMessage;
        // },
    },
}


const server = new GraphQLServer( {typeDefs, resolvers} )
server.start(({ port }) =>{
    console.log(`Server start on http://localhost:${port}`)
})