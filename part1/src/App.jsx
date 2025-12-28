function Header(props) {
  return <h1>{props.course.name}</h1>;
}

function Parts(params) {
  return (
    <p>
      {params.part.name} {params.part.exercises}
    </p>
  );
}
function Content(props) {
  return (
    <div>
      {props.parts.parts.map((part, key) => (
        <Parts key={key} part={part} />
      ))}
    </div>
  );
}
function Total(params) {
  const total = params.parts.parts.reduce((acc, cur) => acc + cur.exercises, 0);
  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  );
}

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course} />
      <Content parts={course} />
      <Total parts={course} />
    </div>
  );
};

export default App;
