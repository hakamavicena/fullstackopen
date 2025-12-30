function Header(props) {
  return <h2>{props.course.name}</h2>;
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
      <strong>total of {total} exercises</strong>
    </div>
  );
}

function Main(props) {
  return (
    <div>
      <Header course={props.course} />
      <Content parts={props.course} />
      <Total parts={props.course} />
    </div>
  );
}
const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
      parts: [
        {
          name: "Fundamentals of React",
          exercises: 10,
          id: 1,
        },
        {
          name: "Using props to pass data",
          exercises: 7,
          id: 2,
        },
        {
          name: "State of a component",
          exercises: 14,
          id: 3,
        },
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map((course, key) => (
        <Main course={course} key={key} />
      ))}
    </div>
  );
};

export default App;
