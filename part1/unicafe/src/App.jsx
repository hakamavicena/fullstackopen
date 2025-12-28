import { useState } from "react";

function Header() {
  return <h1>give feedback</h1>;
}

function Button(params) {
  return <button onClick={params.handle}>{params.name}</button>;
}

function StatisticLine(params) {
  return (
    <>
      <tr>
        <td>
          <p>{params.feed.text}</p>
        </td>{" "}
        <td>
          <p>{params.feed.value}</p>
        </td>
      </tr>
    </>
  );
}
function Stats(props) {
  return (
    <div>
      <h1>statistics</h1>
      {props.contain ? (
        <p>No feedback given</p>
      ) : (
        <table>
          {props.feedbacks.map((feedback, index) => (
            <StatisticLine key={index} feed={feedback} />
          ))}
        </table>
      )}
    </div>
  );
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGood = () => setGood(good + 1);
  const handleNeutral = () => setNeutral(neutral + 1);
  const handleBad = () => setBad(bad + 1);

  const total = good + neutral + bad;
  const feedback = [
    { text: "good", value: good },
    { text: "neutral", value: neutral },
    { text: "bad", value: bad },
    { text: "all", value: total },
    { text: "average", value: (good * 1 + -1 * bad) / total },
    { text: "positive", value: `${(good / total) * 100} %` },
  ];

  const isContained = good == 0 && neutral == 0 && bad == 0;

  return (
    <div>
      <Header />
      <Button handle={handleGood} name="good" />
      <Button handle={handleNeutral} name="neutral" />
      <Button handle={handleBad} name="bad" />
      <Stats feedbacks={feedback} contain={isContained} />
    </div>
  );
};

export default App;
