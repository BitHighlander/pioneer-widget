import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Launcher } from '../../src';
import messageHistory from './messageHistory';
import TestArea from './TestArea';
import Header from './Header';
import Footer from './Footer';
import monsterImgUrl from './../assets/monster.png';
import './../assets/styles';
import io from "socket.io-client";

function Demo() {
  const [state, setState] = useState({
    messageList: messageHistory,
    newMessagesCount: 0,
    isOpen: false,
    fileUpload: false,
  });


  let onStart = async function () {
    try {
      console.log("ON START ************");

      const socket = io("ws://127.0.0.1:9001");

      socket.on("connect", () => {
        console.log("connected to server");
      });

      socket.on("message", msg => {
        console.log("received message:", msg);
      });

      socket.on("disconnect", () => {
        console.log("disconnected from server");
      });

      const sendMessage = msg => {
        socket.send(msg);
      };


    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    onStart();
  }, []);

  function onMessageWasSent(message) {
    setState(state => ({
      ...state,
      messageList: [...state.messageList, message]
    }));
  }

  function onFilesSelected(fileList) {
    const objectURL = window.URL.createObjectURL(fileList[0]);

    setState(state => ({
      ...state,
      messageList: [
        ...state.messageList,
        {
          type: 'file', author: 'me',
          data: {
            url: objectURL,
            fileName: fileList[0].name,
          }
        }
      ]
    }));
  }

  function sendMessage(text) {
    if (text.length > 0) {
      const newMessagesCount = state.isOpen ? state.newMessagesCount : state.newMessagesCount + 1;

      setState(state => ({
        ...state,
        newMessagesCount: newMessagesCount,
        messageList: [
          ...state.messageList,
          {
            author: 'them',
            type: 'text',
            data: { text }
          }
        ]
      }));
    }
  }

  function onClick() {
    setState(state => ({
      ...state,
      isOpen: !state.isOpen,
      newMessagesCount: 0
    }));
  }

  return (
    <div>
      {/*<Header />*/}

      {/*<TestArea*/}
      {/*  onMessage={sendMessage}*/}
      {/*/>*/}
      <Launcher
        agentProfile={{
          teamName: 'popup-chat-react',
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
        }}
        onMessageWasSent={onMessageWasSent}
        onFilesSelected={onFilesSelected}
        messageList={state.messageList}
        newMessagesCount={state.newMessagesCount}
        onClick={onClick}
        isOpen={state.isOpen}
        showEmoji
        fileUpload={state.fileUpload}
        pinMessage={{
        	id: 123,
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
          title: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
          text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
        }}
        onPinMessage={value => console.log(value)}
        placeholder='placeholder'
      />

      {/*<img className="demo-monster-img" src={monsterImgUrl} />*/}
      {/*<Footer />*/}
    </div>
  );
}

render(<Demo/>, document.querySelector('#demo'));
