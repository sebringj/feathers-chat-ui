import React, {FunctionComponent, useState, useEffect} from 'react';
import Login from './Login';
import Chat from './Chat';
import client, {socketio} from './feathers';
import {User, Message} from './global';

const Application:FunctionComponent = () => {

  const [login, setLogin] = useState<undefined | User>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const messageService = client.service('messages');
    const userService = client.service('users');

    client.authenticate().catch(() => setLogin(undefined));

    function getActiveUsers() {
      return userService.find({
        query: {
          $limit: 100,
          active: true
        }
      });
    }

    client.on('authenticated', async (userResp: User) => {
      setLoading(true);
      try {
        const [messagePage, userPage] = await Promise.all([
          messageService.find({
            query: {
              $sort: { createdAt: -1 },
              $limit: 25
            }
          }),
          getActiveUsers(),
        ]);
        const messageList = messagePage.data.reverse() as Message[];
        const userList = (userPage as {data: User[]}).data;
        setLogin(userResp);
        setMessages(messageList);
        setUsers(userList);
      } catch (err) {
        // log error?
      }
      setLoading(false);
    });

    // On logout reset all all local state (which will then show the login screen)
    client.on('logout', async () => {
      setLogin(undefined);
      setMessages([]);
      setUsers([]);
    });

    messageService.on('created', (message: Message) => {
      // useState callback needed to avoid closure state problem
      setMessages(currentMessages => [...currentMessages, message]);
    });

    socketio.on('activeUsers', ({activeUserCount}: {activeUserCount: number}) => {
      setActiveUsers(activeUserCount);
      // overcome closure issue in hooks
      setLogin(currentLogin => {
        if (currentLogin) {
          getActiveUsers().then((userPage: {data: User[]}) => {
            const userList = userPage.data;
            setUsers(userList);
          });
        }
        return currentLogin;
      });
    });
  }, []);

  if (loading) {
    return <main className="container text-center">
      <h1>Loading...</h1>
    </main>;
  } else if (login) {
    return <Chat messages={messages} users={users} activeUsers={activeUsers} />
  }

  return <Login activeUsers={activeUsers} />;
}

export default Application;
