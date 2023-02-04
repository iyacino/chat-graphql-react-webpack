const { GraphQLServer, PubSub } = require('graphql-yoga');

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
 type Subscription  {
    messages: [Message!]
 }
`;

const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);
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
            subscribers.forEach((fn) => fn());
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
    Subscription: {
        messages: {
            subscribe: (parent, args, { pubsub }) =>{
                const channel = Math.random().toString(36).slice(2,15);
                onMessagesUpdates( () => pubsub.publish(channel, { messages }));
                setTimeout(() => pubsub.publish(channel, { messages }), 0);
                return pubsub.asyncIterator(channel);
            }
        }
    }
}

const pubsub = new PubSub();
const server = new GraphQLServer( {typeDefs, resolvers, context: {pubsub}} )
server.start(({ port }) =>{
    console.log(`Server start on http://localhost:${port}`)
})