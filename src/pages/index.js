import React, { useState, useRef, useEffect } from "react";
import "../style/global.css";
import EditQuiz from "../component/EditQuiz";
import { gsap } from "gsap";

export default function Home() {
  const isBrowser = typeof window !== "undefined";

  const { innerWidth: width } = isBrowser && window;

  const initialQuiz = [
    {
      question: "What's the most popular programing language",
      answers: [
        { answerText: "Java", id: "a" },
        { answerText: "C", id: "b" },
        { answerText: "JavaScript", id: "c" },
        { answerText: "python", id: "d" },
      ],
      correct: "c",
    },
    {
      question: "React js is a __ ",
      answers: [
        { answerText: "library", id: "a" },
        { answerText: "framework", id: "b" },
        { answerText: "programing language", id: "c" },
        { answerText: "all above", id: "d" },
      ],
      correct: "b",
    },
    {
      question: "css is a __ ",
      answers: [
        { answerText: "style sheet language", id: "a" },
        { answerText: "programing language", id: "b" },
        { answerText: "server side language", id: "c" },
        { answerText: "none of the above", id: "d" },
      ],
      correct: "a",
    },
    {
      question: "HTML is used for _",
      answers: [
        { answerText: "styling components", id: "a" },
        { answerText: "structure components", id: "b" },
        { answerText: "making web pages interactive", id: "c" },
        { answerText: "none of the above", id: "d" },
      ],
      correct: "b",
    },
  ];
  const [promises, setPromises] = useState([]);
  const [currnetEdit, setCurrnetEdit] = useState(0);
  const [quizData, setQuizData] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [score, setScore] = useState(0);
  const [alert, setAlert] = useState(null);
  const [edit, setEdit] = useState(false);

  const refMain = useRef();
  const ref = useRef();

  const inputRefs = [];
  const currentQuizData = quizData[currentQuiz];
  const setRef = (ref) => {
    inputRefs.push(ref);
  };

  const getSelected = () => {
    let answer = undefined;
    inputRefs.forEach((answerEl) => {
      if (answerEl.checked) {
        answer = answerEl.id;
      }
    });
    return answer;
  };

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("questions"));

    if (local) {
      setQuizData(local);
    } else {
      setQuizData(initialQuiz);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    deSelectAnswer();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuiz, quizData]);

  const handleEdit = () => {
    if (!edit) {
      if (width < 950) {
        gsap.to(refMain.current, {
          duration: 0.5,
          opacity: 0,
        });
        setEdit(true);
        gsap.to(ref.current, {
          duration: 0.5,
          scale: 1,
          opacity: 1,
        });
      } else {
        setEdit(true);
        gsap
          .to(ref.current, {
            duration: 0.3,
            width: 440,
          })
          .then(() => {
            gsap.to(ref.current, {
              duration: 0.5,
              opacity: 1,
              x: 0,
            });
          });
      }
    } else {
      if (width < 950) {
        gsap.to(ref.current, {
          duration: 0.5,
          opacity: 0,
        });
        gsap
          .to(refMain.current, {
            duration: 0.5,
            opacity: 1,
          })
          .then(() => {
            setEdit(false);
            setPromises([]);
            setCurrnetEdit(0);
          });
      } else {
        gsap
          .to(ref.current, {
            duration: 0.5,
            x: 50,
            opacity: 0,
          })
          .then(() => {
            gsap
              .to(ref.current, {
                duration: 0.3,
                width: 0,
              })
              .then(() => {
                setEdit(false);
                setPromises([]);
                setCurrnetEdit(0);
              });
          });
      }
    }
  };

  const deSelectAnswer = () => {
    inputRefs[7] !== null &&
      inputRefs.forEach((inputRef) => {
        inputRef.checked = false;
      });
  };

  const loadQuiz = async () => {
    const answer = getSelected();

    if (answer) {
      setAlert("");

      if (answer === currentQuizData.correct) {
        setScore((prevScore) => prevScore + 1);
      }

      await setCurrentQuiz((prevCurrentQuiz) => prevCurrentQuiz + 1);

      if (currentQuiz < quizData.length) {
        deSelectAnswer();
      } else {
        setQuizData();
      }
    } else if (!answer) {
      setAlert("please choose an answer");
      setTimeout(() => {
        setAlert("");
      }, 3000);
    }
  };

  return (
    <>
      <div
        ref={ref}
        style={{ display: edit ? "block" : "none" }}
        className="edit-container"
      >
        {quizData.length > 0 && (
          <EditQuiz
            currnetEdit={currnetEdit}
            setCurrnetEdit={setCurrnetEdit}
            setPromises={setPromises}
            promises={promises}
            handleEdit={handleEdit}
            edit={edit}
            quizData={quizData}
            setQuizData={setQuizData}
          />
        )}
      </div>
      <div
        ref={refMain}
        style={{
          zIndex: 2,
          display: width < 950 ? (edit ? "none" : "block") : "block",
        }}
        className="quiz-transform"
      >
        <div className="quiz-containor" id="quiz">
          {currentQuizData ? (
            <>
              <div className="quiz-header">
                <h2 className="question-text"> {currentQuizData.question} </h2>
                <div className="alert">{alert && <h4>{alert}</h4>}</div>
                <ul>
                  {currentQuizData.answers.map((answer) => (
                    <li key={answer.id}>
                      <input
                        id={answer.id}
                        type="radio"
                        name="answer"
                        ref={setRef}
                        className="answer"
                      />
                      <label iscorrect={answer.isCorrect} htmlFor={answer.id}>
                        {answer.answerText}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={loadQuiz} className="submit">
                submit
              </button>
            </>
          ) : quizData.length < 1 ? (
            <></>
          ) : (
            <>
              <div className="quiz-header">
                <h2>
                  you have answered currectly {score}/{quizData.length} of
                  questions.
                </h2>
              </div>
              <button onClick={() => window.location.reload()}>reload</button>{" "}
            </>
          )}
        </div>
        <>
          <div
            style={{ justifyContent: "center", display: "flex", width: "100%" }}
          >
            <p
              className="edit-text"
              style={{
                color: "rgb(121, 121, 121)",
              }}
            >
              write yuor own questions ?
            </p>
            <button className="edit-button" onClick={handleEdit}>
              Edit Questions
            </button>
          </div>
          <div
            style={{ justifyContent: "center", display: "flex", width: "100%" }}
          >
            <p
              className="edit-text"
              style={{
                color: "rgb(121, 121, 121)",
                margin: 0,
              }}
            >
              Reset questions ?
            </p>
            <button
              className="edit-button"
              onClick={() => {
                setQuizData(initialQuiz);
                localStorage.removeItem("questions");
              }}
            >
              Reset
            </button>
          </div>
        </>
      </div>
    </>
  );
}
