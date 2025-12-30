const Note = ({ note, toggleImportanceOf }) => {
    toggleImportanceOf
  return <li>{note.content}</li>;
};
    
export default Note;
