import React, { useState, useRef } from "react";
import "./NotesInTask.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NotesInTask = () => {
  const [value, setValue] = useState("");
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font",
  ];

  const handleChange = (content) => {
    setValue(content);
  };

  const handleWrapperClick = () => {
    if (quillRef.current) {
      quillRef.current.focus();
    }
  };

  return (
    <section className="NotesInTask">
      <div className="editor-section flex flex-col">
        <span className="text-[#212121] ml-4 mt-3 font-bold text-xl">14.05.2003</span>
        <h2 className="text-xl font-bold ml-4 my-4 ">Проект для ФИНТЕХ</h2>
        <h3 className="text-[#212121] ml-4 mb-4 font-normal">Автор заметок: Илисхан </h3>
        <div className="custom-editor-wrapper" onClick={handleWrapperClick}>
          <ReactQuill
            ref={quillRef}
            value={value}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            theme="snow"
            className="cursor-pointer ml-4"
          />
        </div>
      </div>
    </section>
  );
};

export default NotesInTask;
