import React, { useState } from 'react';

function TestArea({ onMessage }) {
  const [state, setState] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    onMessage(state);
    setState('');
  }

  function onChange(event) {
    const value = event.target.value;

    setState(value);
  }

  return (
    <div className="demo-test-area--wrapper">
      <div className="demo-test-area--title">
        <div className="demo-test-area--title-main">popup-chat-react demo</div>
      </div>
      <form className="demo-test-area" onSubmit={handleSubmit}>
        <div className="demo-test-area--preamble">Test the chat window by sending a message:</div>
        <textarea
          className="demo-test-area--text"
          placeholder="Write a test message...."
          value={state}
          onChange={onChange}
        />
        <button className="demo-test-area--button"> Send Message! </button>
      </form>
      <p className="demo-test-area--info">
	      popup-chat-react is a chat window that allows you to build and add custom live chat to your sites. It includes only the react chat widget. There is no backend, and no communication system baked in.
        <br />
        <br/>
        Usage instructions for popup-chat-react are <a href="https://github.com/asliddinusmonov/popup-chat-react">on Github</a>.
      </p>
    </div>
  );
}

export default TestArea;
