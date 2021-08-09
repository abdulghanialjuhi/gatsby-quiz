import React, { useState, useEffect } from "react";
import { FaSave, FaPlus, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useForm } from "react-hook-form";

export default function EditQuiz({
  quizData,
  setQuizData,
  handleEdit,
  setPromises,
  promises,
  currnetEdit,
  setCurrnetEdit,
}) {
  const options = ["a", "b", "c", "d"];
  const currentQuiz = quizData[currnetEdit];

  const [saveToLocal, setSaveToLocal] = useState(false);
  const { handleSubmit, register } = useForm();

  function isCharacterALetter(char) {
    return /[a-zA-Z0-9]/.test(char);
  }

  const handleOnSubmit = (data) => {
    const newOpj = [];
    data.quizData.forEach((data1) => {
      const obj = {
        question: data1.question,
        answers: [
          { answerText: data1.a, id: "a" },
          { answerText: data1.b, id: "b" },
          { answerText: data1.c, id: "c" },
          { answerText: data1.d, id: "d" },
        ],
        correct: data1.correct,
      };

      const ifChar = obj.answers.map((answer) =>
        isCharacterALetter(answer.answerText)
      );

      if (
        isCharacterALetter(obj.question) &&
        ifChar[0] &&
        ifChar[1] &&
        ifChar[2] &&
        ifChar[3]
      )
        newOpj.push(obj);
    });

    setPromises(...promises, newOpj);

    handleEdit();
  };

  const handleNext = async (data) => {
    console.log(data, "data");
    setCurrnetEdit((prevCurrnetEdit) => prevCurrnetEdit + 1);
  };

  const handlePrev = () => {
    setCurrnetEdit((prevCurrnetEdit) => prevCurrnetEdit - 1);
  };

  useEffect(() => {
    if (saveToLocal) {
      localStorage.setItem("questions", JSON.stringify(promises));
      setSaveToLocal(false);
    }
    promises.length > 0 && setQuizData(promises);

    console.log(promises);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promises]);

  const handleLocal = (data) => {
    setSaveToLocal(true);
    handleOnSubmit(data);
  };

  return (
    <div className="edit-containor">
      <div style={{ paddingLeft: 10, paddingRight: 10 }}>
        <h1 style={{ textAlign: "center" }}> Edit Questions </h1>
        <div style={{ overflow: "hidden" }}>
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <input
              key={currnetEdit}
              className="edit-input"
              defaultValue={currentQuiz && currentQuiz.question}
              {...register(`quizData.${currnetEdit}.question`, {
                required: true,
              })}
            />
            {currentQuiz
              ? currentQuiz.answers.map((answer) => (
                  <input
                    key={currnetEdit + answer.id}
                    className="edit-input options"
                    defaultValue={answer.answerText}
                    {...register(`quizData.${currnetEdit}.${answer.id}`, {
                      required: true,
                    })}
                  />
                ))
              : options.map((option) => (
                  <input
                    key={currnetEdit + option}
                    className="edit-input options"
                    {...register(`quizData.${currnetEdit}.${option}`, {
                      required: true,
                    })}
                  />
                ))}
            <div style={{ marginTop: 10 }}>
              <label>Correct answer :</label>
              <select
                key={currnetEdit}
                style={{ marginLeft: 10 }}
                {...register(`quizData.${currnetEdit}.correct`, {
                  required: true,
                })}
                defaultValue={currentQuiz ? currentQuiz.correct : ""}
              >
                <option value=""> select </option>
                {options.map((selectedOption) => (
                  <option key={selectedOption} value={selectedOption}>
                    {" "}
                    {selectedOption}{" "}
                  </option>
                ))}
              </select>
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
                }}
                onClick={handlePrev}
              />
            ) : (
              <div />
            )}

            <div className="opstion-container">
              <abbr title="Save questions to local Storage">
                <FaSave
                  onClick={handleSubmit(handleLocal)}
                  size={19}
                  style={{ cursor: "pointer" }}
                />
              </abbr>

              <div>
                {currnetEdit + 1 >= quizData.length ? (
                  <abbr title="Add more questions">
                    <FaPlus
                      onClick={handleSubmit(handleNext)}
                      size={19}
                      style={{ cursor: "pointer" }}
                    />
                  </abbr>
                ) : (
                  <abbr title="Next question">
                    <FaArrowRight
                      onClick={handleSubmit(handleNext)}
                      size={19}
                      style={{ cursor: "pointer" }}
                    />
                  </abbr>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={handleSubmit(handleOnSubmit)}>Submit</button>
    </div>
  );
}
