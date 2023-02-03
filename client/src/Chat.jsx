import React, { useState } from "react"
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';

 const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache(),
  });

const GET_MESSAGES = gql`
  query {
    messages {
        id
        user
        content
    }
  }
`;

const POST_MESSAGE = gql`
  mutation ($user: String!, $content: String!){
    postMessage(user: $user, content: $content)
  }
`;

const Messages = ({ user }) =>{
    const { data } = useQuery(GET_MESSAGES, { pollInterval: 500});
    if(!data){
        return null;
    }
    return(
        <>
        {
        data.messages.map( ({ id, user: messageUser, content }) => 
             <div 
                style={{
                    display: "flex", 
                    justifyContent: user === messageUser ? "flex-end" : "flex-start",
                    alignItems: "center",
                    paddingBottom: "1em",
                }}
             >
                {
                    user !== messageUser && 
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 50,
                        width:50,
                        marginRight: "0.5em",
                        border: "2px solid #e5e6ea",
                        borderRadius: 25,
                        textAlign: "center",
                        fontSize: "18pt",
                    }}>
                        {messageUser.slice(0,2).toUpperCase()}
                    </div>
                }
                <div
                    style={{
                        background: user === messageUser ? "#58bf56" : "#e5e6ea",
                        color: user === messageUser ? "white" : "black",
                        padding: "1em",
                        borderRadius: "1em",
                        maxWidth: "60%",
                    }}
                >
                    {content}
                </div>
             </div>
        )}
        </>
    )
}


const Chat = () => {

    const [message, setMessage] = useState({
        user: 'yacine',
        content: '',
    })
    const [postMessage] = useMutation(POST_MESSAGE);

    const onSend = () =>{
        if(message.content.length > 0){
            postMessage({variables: message})
        }
        setMessage({...message, content: ''});
    }

    return (
        <div style={{
            marginLeft: "400px",
            marginRight: "400px"
        }}>
            <Messages user={message.user}/>
            <div style={{
                display: 'flex',
                justifyContent: "center",
                alignItems: "center",
            }}>
                <input style={{
                    textAlign: "center",
                    fontSize: 18,
                    flex: 1,
                    border: "1pt solid black",
                    borderRadius: "8px",
                    padding: 5,
                    margin: 5,
                    height: 30
                }} 
                label="user" 
                value={message.user} 
                onChange={(e) => setMessage({ ...message, user: e.target.value })}/>
                <input style={{
                    flex: 4,
                    fontSize: "13px",
                    border: "1pt solid black",
                    borderRadius: "8px",
                    padding: 5,
                    margin: 5,
                    height: 30
                }}
                label="content" 
                value={message.content} 
                onChange={(e)=> setMessage({ ...message, content: e.target.value })}
                onKeyUp={(e) => {
                    if(e.keyCode === 13){
                        onSend();
                    }
                }}
                />
                <button style={{
                    flex: 1,
                    fontSize: "18px",
                    border: "2pt solid black",
                    borderRadius: "8px",
                    padding: 5,
                    background: "#242556",
                    color: "white",
                    width: "100px",
                    height: "42px"
                }} 
                onClick={() => onSend()}>
                    Send
                </button>
            </div>
            
        </div>
    )
  }

export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
)