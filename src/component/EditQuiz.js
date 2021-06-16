import React, { useState, useEffect } from "react";
import { FaSave, FaPlus, FaArrowLeft } from "react-icons/fa";

export default function EditQuiz({
  quizData,
  setQuizData,
  handleEdit,
  setPromises,
  promises,
  currnetEdit,
  setCurrnetEdit,
}) {
  const [saveToLocal, setSaveToLocal] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  const [question, setQuestion] = useState(quizData[0].Question);
  const [quizA, setQuizA] = useState(quizData[0].answers[0].answerText);
  const [quizB, setQuizB] = useState(quizData[0].answers[1].answerText);
  const [quizC, setQuizC] = useState(quizData[0].answers[2].answerText);
  const [quizD, setQuizD] = useState(quizData[0].answers[3].answerText);
  const [correct, setCorrect] = useState(quizData[0].correct);

  const handleOnSubmit = async () => {
    if (currnetEdit <= 3) {
      let newArr = [...quizData];

      newArr[currnetEdit].Question = question;
      newArr[currnetEdit].answers[0].answerText = quizA;
      newArr[currnetEdit].answers[1].answerText = quizB;
      newArr[currnetEdit].answers[2].answerText = quizC;
      newArr[currnetEdit].answers[3].answerText = quizD;
      newArr[currnetEdit].correct = correct;

      setPromises([...promises, newArr[currnetEdit]]);
    } else {
      const obj = {
        Question: question,
        answers: [
          { answerText: quizA, id: "a" },
          { answerText: quizB, id: "b" },
          { answerText: quizC, id: "c" },
          { answerText: quizD, id: "d" },
        ],
        correct: correct,
      };
      setPromises([...promises, obj]);
    }
  };

  const handleNext = async () => {
    if (currnetEdit < 3) {
      await handleOnSubmit();
      setCurrnetEdit((prevCurrnetEdit) => prevCurrnetEdit + 1);
    } else {
      setIsFinish(true);
      await handleOnSubmit();
      handleEdit();
      setPromises([]);
    }
  };

  const handlePlus = () => {
    setCurrnetEdit((prevCurrnetEdit) => prevCurrnetEdit + 1);
    handleOnSubmit();
  };

  const handlePrev = () => {
    setCurrnetEdit((prevCurrnetEdit) => prevCurrnetEdit - 1);
    delete promises.pop();
  };

  useEffect(() => {
    setQuestion(quizData[currnetEdit] ? quizData[currnetEdit].Question : "");

    setQuizA(
      quizData[currnetEdit] ? quizData[currnetEdit].answers[0].answerText : ""
    );
    setQuizB(
      quizData[currnetEdit] ? quizData[currnetEdit].answers[1].answerText : ""
    );
    setQuizC(
      quizData[currnetEdit] ? quizData[currnetEdit].answers[2].answerText : ""
    );
    setQuizD(
      quizData[currnetEdit] ? quizData[currnetEdit].answers[3].answerText : ""
    );

    setCorrect(quizData[currnetEdit] ? quizData[currnetEdit].correct : "a");
  }, [currnetEdit]);

  useEffect(() => {
    if (isFinish) {
      if (saveToLocal) {
        localStorage.setItem("questions", JSON.stringify(promises));
        setSaveToLocal(false);
        setIsFinish(false);
      }
      setQuizData(promises);
      setIsFinish(false);
    }
  }, [promises]);

  const handleLocal = async () => {
    setIsFinish(true);
    setSaveToLocal(true);
    await handleOnSubmit();
    handleEdit();
  };

  return (
    <div className="edit-containor">
      <div style={{ paddingLeft: 10, paddingRight: 10 }}>
        <h1 style={{ textAlign: "center" }}> Edit Questions </h1>
        {
          <div style={{ overflow: "hidden" }}>
            <form onSubmit={handleOnSubmit} action="submi">
              <div style={{ marginBottom: 10 }}>
                <label htmlFor="Question"> Question</label>
                <input
                  type="text"
                  className="edit-input"
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                  }}
                />
              </div>
              <div style={{ disply: "block" }}>
                <h3> Options</h3>
                <input
                  type="text"
                  className="edit-input options"
                  value={quizA}
                  onChange={(e) => {
                    setQuizA(e.target.value);
                  }}
                />
                <input
                  type="text"
                  className="edit-input options"
                  value={quizB}
                  onChange={(e) => {
                    setQuizB(e.target.value);
                  }}
                />
                <input
                  type="text"
                  className="edit-input options"
                  value={quizC}
                  onChange={(e) => {
                    setQuizC(e.target.value);
                  }}
                />
                <input
                  type="text"
                  className="edit-input options"
                  value={quizD}
                  onChange={(e) => {
                    setQuizD(e.target.value);
                  }}
                />
              </div>

              <div style={{ marginTop: 10 }}>
                <label>
                  Correct answer :
                  <select
                    style={{ marginLeft: 10 }}
                    value={correct}
                    onChange={(event) => setCorrect(event.target.value)}
                    type="correct"
                  >
                    <option value="a"> a </option>
                    <option value="b"> b </option>
                    <option value="c"> c </option>
                    <option value="d"> d </option>
                  </select>
                </label>
              </div>
            </form>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              {currnetEdit !== 0 ? (
                <FaArrowLeft
                  style={{
                    cursor: "pointer",
                    //  color: currnetEdit !== 0 ? "black" : "gray",
                  }}
                  onClick={handlePrev}
                />
              ) : (
                <div />
              )}

              {currnetEdit < 3 ? null : (
                <div className="opstion-container">
                  <abbr title="Save questions to local Storage">
                    <FaSave
                      onClick={handleLocal}
                      size={19}
                      style={{ cursor: "pointer" }}
                    />
                  </abbr>

                  <div>
                    <abbr title="Add more questions">
                      <FaPlus
                        onClick={handlePlus}
                        size={19}
                        style={{ cursor: "pointer" }}
                      />
                    </abbr>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
      </div>
      <button
        //  style={{ backgroundColor: currnetEdit < 3 && "gray" }}
        onClick={handleNext}
      >
        {" "}
        {currnetEdit < 3 ? "Next" : "Start"}
      </button>
    </div>
  );
}
