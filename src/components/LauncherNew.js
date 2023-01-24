import { pipe, prop, length, last, equals } from "ramda";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ChatWindow from "./ChatWindow";
import launcherIcon from "../assets/logo-no-bg.svg";
import launcherIconActive from "../assets/close-icon.png";
import incomingMessageSound from "../assets/sounds/notification.mp3";
import { SDK } from '@pioneer-sdk/sdk'
import { Events } from '@pioneer-platform/pioneer-events'
import io from "socket.io-client";

// window.addEventListener("beforeunload", function (event) { primus.end(); });

function LauncherNew(props) {
  const {
    isOpen,
    mute,
    showEmoji,
    agentProfile,
    messageList,
    newMessagesCount,
    onMessageWasSent,
    onFilesSelected,
    fileUpload,
    pinMessage,
    onPinMessage,
    placeholder,
  } = props;

  const defaultState = {
    isOpen: false,
    messageList,
  };

  const [state, setState] = useState(defaultState);

  // let onStart = async function () {
  //   try {
  //     console.log("ON START ************", props);
  //     let blockchains = [
  //         'bitcoin', 'ethereum', 'thorchain', 'bitcoincash', 'litecoin', 'binance', 'cosmos', 'dogecoin', 'osmosis'
  //     ]
  //     const config = {
  //         blockchains,
  //         username:"test123",
  //         queryKey:"12324234324",
  //         service: 'pioneer-widget',
  //         wss: 'ws://127.0.0.1:9001',
  //         spec: 'http://127.0.0.1:9001/spec/swagger.json',
  //         paths: []
  //     }
  //     // console.log("config: ", config)
  //     // console.log("SDK: ", SDK)
  //     // //Pioneer SDK
  //     // let pioneer = new SDK(config.spec, config)
  //     // let user = await pioneer.init()
  //
  //     // let configEvents = {
  //     //   queryKey:config.queryKey,
  //     //   wss:config.wss
  //     // }
  //     // console.log("configEvents: ",configEvents)
  //     // let events = new Events(configEvents)
  //     // let result = await events.init()
  //     // console.log("result: ",result)
  //     //
  //     // console.log("events.events: ",events.events)
  //     // events.events.on('blocks', (event) => {
  //     //   console.log("block event!")
  //     // });
  //
  //     const socket = io("ws://127.0.0.1:9001");
  //
  //     socket.on("connect", () => {
  //       console.log("connected to server");
  //     });
  //
  //     socket.on("message", msg => {
  //       console.log("received message:", msg);
  //     });
  //
  //     socket.on("disconnect", () => {
  //       console.log("disconnected from server");
  //     });
  //
  //     const sendMessage = msg => {
  //       socket.send(msg);
  //     };
  //
  //     // console.log("user: ", user)
  //     // console.log("pioneer: ", pioneer)
  //     // console.log("pioneer.events: ", pioneer.events)
  //     // pioneer.events.events.on('blocks', (event) => {
  //     //   console.log("blocks event!", event)
  //     // });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  // useEffect(() => {
  //   onStart();
  // }, []);

  function onClick() {
    setState(state => ({
      ...state,
      isOpen: !state.isOpen,
      newMessagesCount: 0
    }));
  }

  useEffect(() => {
    console.log("isOpen");

    setState((state) => ({
      ...state,
      isOpen,
    }));
  }, [isOpen]);

  useEffect(() => {
    const prevMessageListLength = pipe(prop("messageList"), length)(state);

    const massageListLength = length(messageList);

    const isIncoming = pipe(last, prop("author"), equals("them"))(messageList);

    const isNew = massageListLength > prevMessageListLength;

    if (isIncoming && isNew) {
      if (!mute) {
        playIncomingMessageSound();
      }

      setState((state) => ({
        ...state,
        messageList,
      }));
    }
  }, [messageList]);

  function playIncomingMessageSound() {
    let audio = new Audio(incomingMessageSound);
    audio.play();
  }

  function handleClick() {
    if (onClick) {
      onClick();
    } else {
      setState((state) => ({
        ...state,
        isOpen: !state.isOpen,
      }));
    }
  }

  return (
    <div id="sc-launcher">
      <div
        className={classNames("sc-launcher", { opened: state.isOpen })}
        onClick={handleClick}
      >
        <MessageCount count={newMessagesCount} isOpen={state.isOpen} />
        <img className={"sc-open-icon"} src={launcherIconActive} />
        <img className={"sc-closed-icon"} src={launcherIcon} />
      </div>

      <ChatWindow
        messageList={messageList}
        onUserInputSubmit={onMessageWasSent}
        onFilesSelected={onFilesSelected}
        agentProfile={agentProfile}
        isOpen={state.isOpen}
        onClose={onClick}
        showEmoji={showEmoji}
        fileUpload={fileUpload}
        pinMessage={pinMessage}
        onPinMessage={onPinMessage}
        placeholder={placeholder}
      />
    </div>
  );
}

const MessageCount = ({ count, isOpen }) => {
  if (count === 0 || isOpen === true) return null;

  return <div className="sc-new-messages-count">{count}</div>;
};

LauncherNew.propTypes = {
  isOpen: PropTypes.bool,
  mute: PropTypes.bool,
  showEmoji: PropTypes.bool,
  messageList: PropTypes.arrayOf(PropTypes.object),
  newMessagesCount: PropTypes.number,
  onMessageWasSent: PropTypes.func,
  onMessageWasReceived: PropTypes.func,
  fileUpload: PropTypes.bool,
  pinMessage: PropTypes.object,
  onPinMessage: PropTypes.func,
  placeholder: PropTypes.string,
};

LauncherNew.defaultProps = {
  isOpen: false,
  mute: false,
  showEmoji: true,
  messageList: [],
  newMessagesCount: 0,
  fileUpload: true,
  placeholder: "Write a reply...",
};

export default LauncherNew;
