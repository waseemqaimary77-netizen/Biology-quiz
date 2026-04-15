/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, CheckCircle2, XCircle, ChevronLeft, RotateCcw, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { biologyLessons, Lesson, Question } from "./data/biologyData";

type AppState = "home" | "quiz" | "result";

export default function App() {
  const [state, setState] = useState<AppState>("home");
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const startQuiz = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setState("quiz");
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const submitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    
    const currentQuestion = currentLesson?.questions[currentQuestionIndex];
    if (selectedOption === currentQuestion?.correctAnswer) {
      setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const nextQuestion = () => {
    if (!currentLesson) return;
    
    if (currentQuestionIndex < currentLesson.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setState("result");
    }
  };

  const resetToHome = () => {
    setState("home");
    setCurrentLesson(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-2xl mb-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-brand-primary mb-2 font-serif"
        >
          اختبارات الأحياء
        </motion.h1>
        <p className="text-gray-600">اختبر معلوماتك في دروس الأحياء المختلفة</p>
      </header>

      <main className="w-full max-w-2xl flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {state === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid gap-4"
            >
              {biologyLessons.map((lesson) => (
                <Card 
                  key={lesson.id} 
                  className="quiz-card cursor-pointer hover:ring-2 hover:ring-brand-primary transition-all"
                  onClick={() => startQuiz(lesson)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold">{lesson.title}</CardTitle>
                    <BookOpen className="h-5 w-5 text-brand-primary" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{lesson.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-brand-bg text-brand-primary">
                      {lesson.questions.length} أسئلة
                    </Badge>
                    <Button variant="ghost" className="text-brand-primary gap-2">
                      ابدأ الاختبار <ArrowRight className="h-4 w-4 rotate-180" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </motion.div>
          )}

          {state === "quiz" && currentLesson && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" size="sm" onClick={resetToHome} className="gap-2">
                  <ChevronLeft className="h-4 w-4 rotate-180" /> العودة للرئيسية
                </Button>
                <span className="text-sm font-medium text-gray-500">
                  السؤال {currentQuestionIndex + 1} من {currentLesson.questions.length}
                </span>
              </div>

              <Progress 
                value={((currentQuestionIndex + 1) / currentLesson.questions.length) * 100} 
                className="h-2 bg-gray-100"
              />

              <Card className="quiz-card">
                <CardHeader>
                  <CardTitle className="text-2xl leading-relaxed">
                    {currentLesson.questions[currentQuestionIndex].text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {currentLesson.questions[currentQuestionIndex].options.map((option, index) => {
                    const isCorrect = isAnswered && index === currentLesson.questions[currentQuestionIndex].correctAnswer;
                    const isWrong = isAnswered && selectedOption === index && index !== currentLesson.questions[currentQuestionIndex].correctAnswer;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        disabled={isAnswered}
                        className={`option-button ${selectedOption === index ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'incorrect' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          {isWrong && <XCircle className="h-5 w-5 text-red-500" />}
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
                <CardFooter>
                  {!isAnswered ? (
                    <Button 
                      className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white h-12 text-lg"
                      disabled={selectedOption === null}
                      onClick={submitAnswer}
                    >
                      تأكيد الإجابة
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white h-12 text-lg"
                      onClick={nextQuestion}
                    >
                      {currentQuestionIndex === currentLesson.questions.length - 1 ? "عرض النتيجة" : "السؤال التالي"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {state === "result" && currentLesson && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="quiz-card overflow-hidden">
                <div className="bg-brand-primary p-8 text-white">
                  <Award className="h-16 w-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">اكتمل الاختبار!</h2>
                  <p className="opacity-90">{currentLesson.title}</p>
                </div>
                <CardContent className="p-8">
                  <div className="text-6xl font-bold text-brand-primary mb-2">
                    {Math.round((score / currentLesson.questions.length) * 100)}%
                  </div>
                  <p className="text-gray-600 mb-6">
                    لقد أجبت على {score} من أصل {currentLesson.questions.length} أسئلة بشكل صحيح.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => startQuiz(currentLesson)} variant="outline" className="gap-2 h-12">
                      <RotateCcw className="h-4 w-4" /> إعادة الاختبار
                    </Button>
                    <Button onClick={resetToHome} className="bg-brand-primary text-white gap-2 h-12">
                      الرئيسية
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 text-gray-400 text-center flex flex-col gap-2 pb-8">
        <p className="text-sm">© 2026 تطبيق اختبارات الأحياء - تعلم بذكاء</p>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold text-brand-primary">تم التطوير بواسطة: وسيم قيمري وإبراهيم رويدي</p>
          <p className="text-sm font-medium">بإشراف معلمة المادة: حنين</p>
        </div>
      </footer>
    </div>
  );
}
