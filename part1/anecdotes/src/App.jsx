import { useState } from "react";

function Button(params) {
  return <button onClick={params.handle}>{params.name}</button>;
}

function Anecdote({ anecdote, vote }) {
  return (
    <div>
      <p>{anecdote}</p>
      <p>
        has {vote} {vote > 1 ? `votes` : `vote`}{" "}
      </p>
    </div>
  );
}

function TopAnecdote({ votes, anecdotes }) {
  let maxVote = Math.max(...votes);
  let maxIndex = votes.indexOf(maxVote);
  let maxAnecdote = anecdotes[maxIndex];
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <Anecdote anecdote={maxAnecdote} vote={maxVote} />
    </div>
  );
}

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const handleVote = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  };
  const handleSelected = () => setSelected((selected + 1) % anecdotes.length);

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={anecdotes[selected]} vote={votes[selected]} />
      <Button handle={handleVote} name="vote" />
      <Button handle={handleSelected} name="next anecdote" />
      <TopAnecdote votes={votes} anecdotes={anecdotes} />
    </div>
  );
};

export default App;
