import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "./MuButton";
import MyHeader from "./MyHeader";
import EmotionItem from "./EmotionItem";
import { DiaryDispatchContext } from "../App";
import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";

const env = process.env;
env.PUBLIC_URL = env.PUBLIC_URL || " ";

const DiaryEditor = ({isEdit, originData}) => {
  const [date, setDate] = useState(getStringDate(new Date()));
  const [emotion, setEmotion] = useState(3);

  const [content, setContent] = useState("");
  const contentRef = useRef();

  const {onCreate, onEdit} = useContext(DiaryDispatchContext);

  const navigate = useNavigate();

  const handleClickEmote = (emotion) => {
    setEmotion(emotion);
  };

  const handleSubmit = () => {
    if(content.length < 1) {
      contentRef.current.focus();
      return;
    }
    if(window.confirm(isEdit ? "일기를 수정하시겠습니끼?" : "새로운 일기를 작성하시겠습니까?")) {
      if(!isEdit) {
        onCreate(date, content, emotion);
      } else {
        onEdit(originData.id, date, content, emotion);
      }
    }
    navigate('/', { replace: true });
  }

 useEffect(()=> {
  if(isEdit) {
    setDate(getStringDate(new Date(parseInt(originData.date))));
    setEmotion(originData.emotion);
    setContent(originData.content);
  }
 },[isEdit, originData]);

  return (
    <div className="DiaryEditor"> 
      <MyHeader 
        leftChild={<MyButton text={'< 뒤로가기'} onClick={()=> navigate(-1)} />}
        headText={isEdit ? '일기 수정하기' : '새로운 일기 쓰기'} 
      />
      <div>
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className="input_box"> 
            <input 
              className="input_date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date" />
          </div>
        </section>
        <section>
          <h4>오늘의 감정</h4>
          <div className="input_box emotion_list_wrapper">  
            {emotionList.map((it) => (
              <EmotionItem 
                  key={it.emotion_id} 
                  {...it}
                  onClick={handleClickEmote}
                  isSelected={it.emotion_id === emotion} 
              />
            ))}
          </div>
        </section>
        <section>
          <h4>오늘의 일기</h4>
          <div className="input_box_text_wrapper">
            <textarea 
                placeholder="오늘은 어땠나요?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                ref={contentRef}
            />
          </div>
        </section>
        <section>
          <div className="coltrol_box">
              <MyButton 
                  onClick={() => navigate(-1)}
                  text={'취소하기'} 
              />
              <MyButton 
                  type={'positive'}
                  text={'작성 완료'}
                  onClick={handleSubmit}
              />
          </div>
        </section>
      </div>
    </div>
  )
};

export default DiaryEditor;